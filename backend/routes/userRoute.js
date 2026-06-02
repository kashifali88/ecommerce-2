import express from 'express';
import { deleteUser, getAllUsers, getSingleUser, updateUser } from '../controllers/userController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const userRouter = new express.Router();
userRouter.get('/', getAllUsers);
userRouter.get('/:id', getSingleUser);
userRouter.put('/:id',verifyToken, updateUser);
userRouter.delete('/:id',verifyToken, deleteUser);

export default userRouter;
