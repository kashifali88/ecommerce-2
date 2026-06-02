import express from "express";
import { createCheckoutSession, createOrder, getMyOrders } from "../controllers/orderController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { fetchSingleOrder } from '../controllers/orderController.js'

const orderRouter = new express.Router();

orderRouter.post("/create", verifyToken, createOrder);
orderRouter.get("/my-orders", verifyToken, getMyOrders);
orderRouter.get("/order/:id", verifyToken, fetchSingleOrder);
orderRouter.post(
  "/create-checkout-session",
  verifyToken,
  createCheckoutSession
);


export default orderRouter;
