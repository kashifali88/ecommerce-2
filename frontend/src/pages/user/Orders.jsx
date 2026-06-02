import { useEffect, useState } from "react";
import { FaBoxOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
      const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";


  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/orders/my-orders`, {
        credentials: "include",
      });

      const data = await res.json();
      
            

      if (res.ok) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center gap-3 mb-8">
          <FaBoxOpen className="text-3xl text-gray-700" />
          <h1 className="text-3xl font-bold text-gray-800">
            My Orders
          </h1>
        </div>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow">
            <h2 className="text-xl font-semibold text-gray-700">
              No Orders Found
            </h2>
            <p className="text-gray-500 mt-2">
              You haven't placed any orders yet.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-md p-5"
              >
                <div className="grid md:grid-cols-6 gap-4">

                  <div>
                    <p className="text-xs text-gray-500">
                      Order ID
                    </p>
                    <p className="font-semibold">
                      #{order._id.slice(-8)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Date
                    </p>
                    <p className="font-semibold">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Total
                    </p>
                    <p className="font-semibold">
                      ${order.totalAmount}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Payment
                    </p>
                    <p className="font-semibold capitalize">
                      {order.paymentMethod}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Status
                    </p>

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        order.orderStatus === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.orderStatus === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  <div>
                    <button
                    onClick={() => navigate(`/order-details/${order._id}`)}
                      className="bg-black text-white px-4 py-2 rounded-xl hover:opacity-90"
                    >
                      View Details
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default MyOrders;