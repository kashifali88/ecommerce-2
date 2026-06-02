import express from 'express'
import { forgotPassword, google, login, register, resetPassword, signOut } from '../controllers/authController.js';

const authRouter = new express.Router();


authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/google',google);
authRouter.post('/signout',signOut);
authRouter.post('/forgot-password',forgotPassword);
authRouter.post('/reset-password/:token', resetPassword);




export default authRouter;