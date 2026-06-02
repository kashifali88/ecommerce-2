// src/pages/admin/AdminProducts.jsx

import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../../redux/slice/productSlice";
import { useEffect } from "react";
import ProductCard from "../../components/admin/ProductCard";
import { Link } from "react-router-dom";

function AdminProducts() {
  const dispatch = useDispatch();

  const { productList, loading } = useSelector(
    (state) => state.products
  );

  console.log(productList);
  
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <div className="p-4">
      
      {/* TOP */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">
          All Products
        </h1>

        <Link
          to="/admin/create-product"
          className="bg-black text-white px-4 py-2 rounded-md"
        >
          Add Product
        </Link>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center">
          <p>Loading products...</p>
        </div>
      ) : productList.length === 0 ? (
        <div className="text-center text-gray-500">
          No Products Found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {productList.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminProducts;