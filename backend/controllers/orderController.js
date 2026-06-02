import Order from "../models/orderModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import Product from "../models/productModel.js";
import { errorHandler } from '../utils/errorHandler.js'
import Stripe from "stripe";


const getStripe = () => {
  return new Stripe(process.env.STRIPE_SECRET);
}
export const createOrder = catchAsync(async (req, res, next) => {
    const { products, shippingAddress, paymentMethod, subtotal, shippingFee, totalAmount } = req.body;

    const order = await Order.create({
        userId: req.user._id,
        products,
        shippingAddress,
        paymentMethod,
        subtotal,
        shippingFee,
        totalAmount,
    });
    res.status(201).json({success:true, message: "Order created successfully", order});
})

export const getMyOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({success:true, orders});
}
)

export const fetchSingleOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(errorHandler(404, "No order found"))
    res.status(200).json({success:true, order})
})



export const createCheckoutSession = async (req, res) => {
  try {
    const { products } = req.body;
    const stripe = getStripe(); 


    const line_items = await Promise.all(
      products.map(async (item) => {

        const product = await Product.findById(item.product);

        if (!product) throw new Error("Product not found");

        const price =
          product.salePrice > 0 ? product.salePrice : product.price;

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.title,
              images: [product.image],
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: item.quantity,
        };
      })
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: "http://localhost:5173/payment/success?session_id={CHECKOUT_SESSION_ID}",      
      cancel_url: "http://localhost:5173/payment/cancel",
    });

    res.json({
      success: true,
      url: session.url,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};