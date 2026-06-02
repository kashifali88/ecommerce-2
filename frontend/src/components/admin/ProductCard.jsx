
import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { deleteProduct } from "../../redux/slice/productSlice";
import { toast } from "react-toastify";

function ProductCard({ product }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleDeleteProduct = () => {
      const confirmDelete = window.confirm("Are you sure want to delete this product?")
      if (!confirmDelete) return;
      dispatch(deleteProduct(product._id)).then((res) => {
        if (res?.payload?.success) {
          toast.success("Product deleted successfully")
        }
      })


    }
    
  return (
    <div className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition border-gray-300">

      {/* IMAGE */}
      <div className="w-full h-44 bg-gray-100">
        <img
          src={
            product.image ||
            "https://via.placeholder.com/300"
          }
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="p-3">

        {/* TITLE */}
        <h2 className="text-sm font-semibold line-clamp-1">
          {product.title}
        </h2>

        {/* DESCRIPTION */}
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {product.description}
        </p>

        {/* PRICE */}
        <div className="flex items-center gap-2 mt-2">

          <span className="text-base font-bold">
            Rs {product.price}
          </span>

          {product.salePrice > 0 && (
            <span className="text-xs text-gray-400 line-through">
              Rs {product.salePrice}
            </span>
          )}

        </div>

        {/* STOCK */}
        <p className="text-xs text-gray-500 mt-1">
          Stock: {product.totalStock}
        </p>

        {/* BUTTONS */}
        <div className="flex items-center gap-2 mt-3">

          <button onClick={()=> navigate(`/admin/update-product/${product._id}`)} className="hover:bg-sky-700 hover:text-white flex-1 border border-gray-400 rounded-md py-2 flex items-center justify-center cursor-pointer">
            <FiEdit2 className="w-4 h-4" />
          </button>

          <button onClick={handleDeleteProduct} className="flex-1 border border-gray-400 rounded-md py-2 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white cursor-pointer">
            <FiTrash2 className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
}

export default ProductCard;