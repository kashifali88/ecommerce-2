import React from "react";
import { Link } from "react-router-dom";
import { addToCartStart, addToCartSuccess, addToCartFailure } from "../../redux/slice/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

function ProductCard({ product }) {
  const { currentUser } = useSelector((state) => state.auth)
  const dispatch = useDispatch();
    const handleAddToCart =async () => {
      try {
    dispatch(addToCartStart());
    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
     userId: currentUser._id,
     productId: product._id,
     quantity: 1,
    })
    })
    const data = await res.json();
    if (data.success) {
      dispatch(addToCartSuccess({ product, quantity: 1 }));
      toast.success("Product added to cart");
      }
    } catch (error) {
     dispatch(addToCartFailure(error.message));
    }
  }
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition">
      
      {/* IMAGE */}
      <div className="w-full h-52 bg-gray-100">
        <Link to={`/product/${product._id}`}>
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-full object-cover"
        />
        </Link>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-2">
        <Link to={`/product/${product._id}`}>
        
        <h4 className="font-medium text-sm md:text-base line-clamp-1">
          {product?.title}
        </h4>
        </Link>

        <p className="text-sm text-gray-500 capitalize">
          {product?.brand}
        </p>

        {/* PRICE */}
        <div className="flex items-center gap-2">
          
          <span className="font-semibold text-base">
            ${product?.salePrice > 0
              ? product.salePrice
              : product.price}
          </span>

          {product?.salePrice > 0 && (
            <span className="text-sm text-gray-400 line-through">
              ${product?.price}
            </span>
          )}
        </div>
          <button onClick={handleAddToCart} className="w-full cursor-pointer hover:opacity-90 bg-black text-white py-2 px-4 rounded-lg">
            Add to Cart
          </button>
      </div>
    </div>
  );
}

export default ProductCard;