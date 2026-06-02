import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      lowercase: true,
    },

    brand: {
      type: String,
      required: [true, "Brand is required"],
      lowercase: true,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },

    salePrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalStock: {
      type: Number,
      required: [true, "Total stock is required"],
      min: 0,
    },
  },

  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;