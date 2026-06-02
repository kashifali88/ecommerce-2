import { imageUploadUtil } from "../utils/cloudinary.js";
import { catchAsync } from "../utils/catchAsync.js";
import Product from "../models/productModel.js";
import { errorHandler } from "../utils/errorHandler.js";

export const handleImageUpload = catchAsync(async (req, res, next) => {
  const b64 = Buffer.from(req.file.buffer).toString("base64");

  const url = `data:${req.file.mimetype};base64,${b64}`;

  const result = await imageUploadUtil(url);

  res.json({
    success: true,
    imageUrl: result.secure_url,
    publicId: result.public_id,
  });
});

// create product 
export const createProduct = catchAsync(async (req, res, next) => {
  const {
    image,
    title,
    description,
    category,
    brand,
    price,
    salePrice,
    totalStock,
  } = req.body;
  // Check existing product
  const existingProduct = await Product.findOne({ title });

  if (existingProduct) {
    return next(errorHandler(400, "Product already exists"));
  }

  const newProduct = new Product({
    image,
    title,
    description,
    category,
    brand,
    price,
    salePrice,
    totalStock,
  });
  await newProduct.save();
  res
    .status(201)
    .json({
      success: true,
      message: "Product created successfully",
      newProduct,
    });
});

// fetch all products
export const fetchAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({});
  res.status(200).json({ success: true, products: products });
});

export const filterProducts = catchAsync(async (req, res) => {
  console.log("QUERY:", req.query);

  const { category, brand, sortBy } = req.query;

  let query = {};

  if (category) {
    query.category = { $in: category.split(",") };
  }

  if (brand) {
    query.brand = { $in: brand.split(",") };
  }

  let sort = {};

  if (sortBy === "priceLowToHigh") sort.price = 1;
  if (sortBy === "priceHighToLow") sort.price = -1;
  if (sortBy === "newest") sort.createdAt = -1;

  console.log("MONGO QUERY:", query);

  const products = await Product.find(query).sort(sort);

  return res.status(200).json({
    success: true,
    products,
  });
});

// fetch single product
export const fetchSingleProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(errorHandler(404, "Product not found"));
  res.status(200).json({ success: true, product: product });
});

// query products
export const searchProducts = catchAsync(async (req, res, next) => {
  const { keyword } = req.query;
  const products = await Product.find({
    $or: [
      { title: {$regex: keyword, $options: 'i'}},
      { category: {$regex: keyword, $options: 'i'}},
      { brand: {$regex: keyword, $options: 'i'}}
    ]});
  res.status(200).json({
    success: true,
    products,
  });
})

// update product
export const updateProduct = catchAsync(async (req, res, next) => {
  const {
    image,
    title,
    description,
    price,
    salePrice,
    totalStock,
    category,
    brand,
  } = req.body;

  const updateProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { returnDocument: "after" },
  );
  if (!updateProduct) return next(errorHandler(404, "Product not found"));
  res
    .status(200)
    .json({
      success: true,
      message: "Product updated successfully",
      updatedProduct: updateProduct,
    });
});

// delete product
export const deleteProduct = catchAsync(async (req, res, next) => {

  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(errorHandler(404, 'Product not found'));
  }

 // ONLY if you stored public_id
  if (product.publicId) {
    await cloudinary.uploader.destroy(product.publicId);
  }
  // delete product from database
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
    deletedProduct
  });

});



