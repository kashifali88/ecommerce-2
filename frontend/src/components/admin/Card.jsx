

function UserProductCard({ product }) {

    
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition">

      <img
        src={product.image || "https://via.placeholder.com/300"}
        className="w-full h-44 object-cover"
      />

      <div className="p-3">

        <h2 className="font-semibold line-clamp-1">
          {product.title}
        </h2>

        <p className="text-xs text-gray-500 line-clamp-2 mt-1">
          {product.description}
        </p>

        <div className="flex justify-between mt-2">
          <span className="font-bold">Rs {product.price}</span>

          {product.salePrice > 0 && (
            <span className="text-xs line-through text-gray-400">
              Rs {product.salePrice}
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
export default UserProductCard