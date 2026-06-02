import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaBoxOpen, FaTruck, FaCreditCard } from "react-icons/fa";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
      const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";


  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/orders/order/${id}`, {
        credentials: "include",
      });

      const data = await res.json();
  
      if (res.ok) {
        setOrder(data.order);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-600">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-10 text-center text-gray-600">
        Order not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white p-6 rounded-2xl shadow flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaBoxOpen className="text-2xl text-gray-700" />
            <div>
              <h1 className="text-xl font-bold">
                Order #{order._id.slice(-8)}
              </h1>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <span className={`px-4 py-1 rounded-full text-sm font-semibold
            ${
              order.orderStatus === "delivered"
                ? "bg-green-100 text-green-700"
                : order.orderStatus === "cancelled"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }
          `}>
            {order.orderStatus}
          </span>
        </div>

        {/* PRODUCTS */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-bold mb-4">Products</h2>

          <div className="space-y-4">
            {order.products.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 border-b pb-4"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded-xl"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>

                <p className="font-bold text-gray-800">
                  ${item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SHIPPING */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FaTruck /> Shipping Info
          </h2>

          <div className="text-sm text-gray-700 space-y-1">
            <p>
              <b>Name:</b> {order.shippingAddress.firstName}{" "}
              {order.shippingAddress.lastName}
            </p>
            <p>
              <b>Email:</b> {order.shippingAddress.email}
            </p>
            <p>
              <b>Phone:</b> {order.shippingAddress.phone}
            </p>
            <p>
              <b>Address:</b> {order.shippingAddress.address},{" "}
              {order.shippingAddress.city}
            </p>
            <p>
              <b>Postal Code:</b> {order.shippingAddress.postalCode}
            </p>
          </div>
        </div>

        {/* PAYMENT + TOTAL */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FaCreditCard /> Payment Summary
          </h2>

          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${order.subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${order.shippingFee}</span>
            </div>

            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>${order.totalAmount}</span>
            </div>

            <p className="text-sm mt-2">
              Payment Method:{" "}
              <b className="capitalize">{order.paymentMethod}</b>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OrderDetails;