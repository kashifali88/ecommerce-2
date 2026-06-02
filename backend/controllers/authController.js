import { catchAsync } from "../utils/catchAsync.js";
import { errorHandler } from "../utils/errorHandler.js";
import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken'
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// register user
export const register = catchAsync(async (req, res, next) => {
  const { username, email, password, profileImage } = req.body;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
if (!username || !email || !password) return next(errorHandler(401, 'Please fill all required fields'))
  // check if user exists
  const user = await User.findOne({ email });
  if (user) return next(errorHandler(401, "User already exists"));
  if (!passwordRegex.test(password)) {
    return next(
      errorHandler(
        400,
        "Password must be at least 6 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character",
      ),
    );
  }
  // hash password
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashPassword,
    profileImage,
  });
  await newUser.save();
  const { password: pass, ...userInfo } = newUser._doc;
  res
    .status(201)
    .json({ success: true, message: "User created", userInfo});
});

// login user

export const login = catchAsync(async (req, res, next) => {
    const {username, email, password } = req.body;
    if ( !username &&  !email) return next(errorHandler(400, 'Please enter username or email'))
    // user can either login with username or email
    const query = email ? {email:email} : {username:username};
    const user = await User.findOne(query).select("+password");
    if(!user) return next(errorHandler(404, 'User not found'))
        // password validation
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return next(errorHandler(401, 'Please enter valid password'))
        const token = jwt.sign({id: user._id, role:user.role},
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
        )
        res.cookie("token", token, {
            httpOnly: true
        });
        const {password:pass, ...userInfo} = user._doc
        res.status(200).json({success:true, message: "User logged In successfully", userInfo})


});

export const google = catchAsync(async (req, res, next) => {
  const { email, username, profileImage } = req.body;

  if (!email) {
    return next(errorHandler(400, "Email is required"));
  }

  const existingUser = await User.findOne({ email });

  // existing user
  if (existingUser) {
    const token = jwt.sign(
      { id: existingUser._id, role: existingUser.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: pass, ...userInfo } = existingUser._doc;

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: userInfo,
    });
  }

  //  new user
  const randomPassword =
    Math.random().toString(36).slice(-8) +
    Math.random().toString(36).slice(-8);

  const hashPassword = await bcrypt.hash(randomPassword, 10);

  const newUser = await User.create({
    username: username
      ? username.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(2)
      : "user" + Math.random().toString(36).slice(2),
    email,
    password: hashPassword,
    profileImage,
  });

  const token = jwt.sign(
    { id: newUser._id, role: newUser.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const { password: pass, ...userInfo } = newUser._doc;

  return res.status(201).json({
    success: true,
    message: "User created successfully",
    user: userInfo,
  });
});

export const signOut = catchAsync(async(req, res, next) => {
    res.clearCookie("token");
    res.status(200).json({success:true, message: "User logged out successfully"})
})

export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(errorHandler(400, "Please enter email to reset your password"))
    const user = await User.findOne({email})
  if (!user) return next(errorHandler(404, 'User not found'))
    const resetToken = crypto.randomBytes(20).toString("hex")
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000
    await user.save()
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.USER_PASS
        }
      })
      const mailOptions = {
        from: process.env.USER_EMAIL,
        to: user.email,
        subject: "Reset Password",
        text: `Please click on the following link to reset your password ${resetUrl}`
      }
      await transporter.sendMail(mailOptions);
      res.status(200).json({success:true, message: "Password reset link sent successful"})

})

    // reset password
    export const resetPassword = catchAsync(async (req, res, next) => {
      const { token } = req.params;
      const { password } = req.body;
      if (!password) {
        return next(errorHandler(400, "Password is required"));
      }
      const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpire: { $gt: Date.now() } });
      if (!user) {
        return next(errorHandler(400, "Invalid or expired token"));
      }
      user.password = await bcrypt.hash(password, 10);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      res.status(200).json({ success: true, message: "Password reset successful" });
    })

