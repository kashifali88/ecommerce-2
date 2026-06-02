import express from "express";
import {
  createProduct,
  deleteProduct,
  fetchAllProducts,
  fetchSingleProduct,
  filterProducts,
  handleImageUpload,
  searchProducts,
  updateProduct,
} from "../controllers/productController.js";
import { upload } from "../utils/cloudinary.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const productRouter = new express.Router();

productRouter.post(
  "/upload-image",
  verifyToken,
  verifyAdmin,
  upload.single("my_file"),
  handleImageUpload,
);
productRouter.post("/create-product", verifyToken, verifyAdmin, createProduct);
productRouter.get("/search", filterProducts)
productRouter.get("/", fetchAllProducts);
productRouter.get("/:id", fetchSingleProduct);
productRouter.put("/:id", verifyToken, verifyAdmin, updateProduct);
productRouter.delete("/:id", verifyToken, verifyAdmin, deleteProduct);
productRouter.get("/search", searchProducts);

export default productRouter;
