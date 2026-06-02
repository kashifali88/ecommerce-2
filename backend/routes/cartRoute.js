import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { addToCart, getUserCart, removeFromCart, updateCartItem } from "../controllers/cartController.js";
const cartRouter = new express.Router();

cartRouter.post("/add", verifyToken, addToCart);
cartRouter.get("/:id", verifyToken, getUserCart);
cartRouter.put("/update/:id", verifyToken, updateCartItem);
cartRouter.delete("/remove/:userId/:productId", verifyToken, removeFromCart);
export default cartRouter;


