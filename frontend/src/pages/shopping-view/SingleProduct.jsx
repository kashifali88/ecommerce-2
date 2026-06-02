import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCartFailure, addToCartStart, addToCartSuccess } from "../../redux/slice/cartSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const {currentUser} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
      const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API}/products/${id}`);
        const data = await res.json();

        if (data.success) {
          setProduct(data.product);
        }

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

    const handleAddToCart = async () => {

      try {
        dispatch(addToCartStart());
        const res = await fetch(`${API}/cart/add`, {
          method: "POST",
          headers: {
            "content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: currentUser._id,
            productId: product._id,
            quantity: 1,
          })
          
        })
        const data = await res.json();
        if (!res.ok || data.success === false) {
          dispatch(addToCartFailure(data.message || "Failed to add to cart"));
          return;
        } 
        dispatch(addToCartSuccess({ product, quantity: 1 }));
        toast.success("Product added to cart");
      } catch (error) {
        dispatch(addToCartFailure(error.message));
      }
    }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-red-500">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto p-4 md:p-10">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-md p-6">

        {/* IMAGE SECTION */}
        <div className="w-full h-[400px] bg-gray-100 rounded-xl overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
        </div>

        {/* DETAILS SECTION */}
        <div className="flex flex-col gap-4">

          <span className="text-sm text-gray-500 uppercase">
            {product.brand}
          </span>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {product.title}
          </h1>

          {/* PRICE */}
          <div className="flex items-center gap-3">
            <p className="text-2xl font-semibold text-black">
              ${product.salePrice > 0 ? product.salePrice : product.price}
            </p>

            {product.salePrice > 0 && (
              <p className="text-lg text-gray-400 line-through">
                ${product.price}
              </p>
            )}
          </div>

          {/* STOCK */}
          <p className="text-sm text-gray-600">
            Stock:{" "}
            <span className="font-medium">
              {product.totalStock > 0 ? product.totalStock : "Out of stock"}
            </span>
          </p>

          {/* DESCRIPTION */}
          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* BUTTONS */}
          <div className="flex gap-3 mt-4">

            <button onClick={handleAddToCart} className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition w-full">
              Add to Cart
            </button>

            <Link state = {{
              buyNowItem: {
                product,
                quantity:1
              }
            }} to="/checkout" className="flex items-center justify-center border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100 transition w-full">
              Buy Now
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
}

export default SingleProduct;