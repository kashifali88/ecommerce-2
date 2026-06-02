import Cart from "../models/cartModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import { errorHandler } from "../utils/errorHandler.js";

export const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId });

    // IF NO CART
    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            quantity,
          },
        ],
      });
    } else {
   // CHECK EXISTING PRODUCT
      const existingProductIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId,
      );

      if (existingProductIndex >= 0) {
        // INCREASE QUANTITY
        cart.items[existingProductIndex].quantity += quantity;
      } else {
        // ADD NEW PRODUCT
        cart.items.push({
          productId,
          quantity,
        });
      }
    }

    await cart.save();

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserCart = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const cart = await Cart.findOne({ user: userId }).populate(
    "items.productId",
    "title price salePrice image",
  );
  if (!cart) return next(errorHandler(404, "Cart not found"));
  res.status(200).json({
    success:true,
    data: cart,
  });
});

export const updateCartItem = catchAsync(async (req, res, next) => {
  const { userId, productId, quantity } = req.body;
  if (!productId || !quantity)
    return next(errorHandler(400, "Product ID and quantity are required"));
  const cart = await Cart.findOne({ userId: userId });
  if (!cart) return next(errorHandler(404, "Cart not found"));
  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId,
  );
  if (itemIndex === -1) return next(errorHandler(404, "Product not in cart"));
  cart.items[itemIndex].quantity = quantity;
  await cart.save();
  res.status(200).json({
    success: true,
    data: cart,
  });
});

export const removeFromCart = catchAsync(async (req, res, next) => {
  const { userId, productId } = req.params;
  if (!productId) return next(errorHandler(400, "Product ID is required"));
  const cart = await Cart.findOne({ userId: userId });
  if (!cart) return next(errorHandler(404, "Cart not found"));
  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId,
  );
  if (itemIndex === -1) return next(errorHandler(404, "Product not in cart"));
  cart.items.splice(itemIndex, 1);
  await cart.save();
  res.status(200).json({
    success: true,
    message: "Item removed from cart",
  });
});
