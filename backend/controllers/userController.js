import { catchAsync } from '../utils/catchAsync.js'
import User from '../models/userModel.js'
import { errorHandler } from '../utils/errorHandler.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// getAllUsers
export const getAllUsers = catchAsync(async(req, res, next) => {
const users = await User.find({}).select("-password");

res.status(200).json({success:true, users:users});
})

// getSingleUser
export const getSingleUser = catchAsync(async(req, res, next) => {
    const id = req.params.id
    const user = await User.findById(id);
    if (!user) return next(errorHandler(404, 'User not found'));
    res.status(200).json({success:true, user:user})
});

export const updateUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  if (req.user.id !== id)
    return next(errorHandler(401, "You can update only your own account"));

  const user = await User.findById(id).select("+password");

  if (!user) return next(errorHandler(404, "User not found"));

  // -----------------------
  // BASIC INFO UPDATE
  // -----------------------
  if (req.body.username) user.username = req.body.username;
  if (req.body.email) user.email = req.body.email;
  if (req.body.profileImage) user.profileImage = req.body.profileImage;

  // -----------------------
  // PASSWORD UPDATE (SECURE)
  // -----------------------
  if (req.body.oldPassword && req.body.newPassword) {

    const isMatch = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    );

    if (!isMatch) {
      return next(errorHandler(400, "Old password is incorrect"));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(errorHandler(400, "Passwords do not match"));
    }

    user.password = await bcrypt.hash(req.body.newPassword, 10);
  }

  await user.save();

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  user.password = undefined

  res.status(200).json({
    success: true,
    message: "User updated",
    user
  });
});

// delete user
export const deleteUser = catchAsync(async(req, res, next) => {
  const { password } = req.body;
  
    if (req.user.id !== req.params.id) return next(errorHandler('401', 'You can delete only your account'));
    const user = await User.findById(req.params.id).select("+password");
    if (!user) return next(errorHandler('404', 'User not found'));
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(errorHandler('400', 'Password is incorrect'));
     const deletedUser = await User.findByIdAndDelete(req.params.id)
    if (!deletedUser) return next(errorHandler('404', 'User not found'))
        res.status(200).json('User deleted successfully')
});
 