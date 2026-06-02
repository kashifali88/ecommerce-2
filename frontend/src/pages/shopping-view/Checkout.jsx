import { useSelector } from "react-redux";
import { FaLock, FaTruck, FaCreditCard } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

function Checkout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const { items } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "cod",
  });

  // =========================
  // PRODUCTS NORMALIZED FIX
  // =========================
  const buyNowItem = location.state?.buyNowItem;
  const selectedItems = location.state?.selectedItems;

  const products = buyNowItem
    ? [
        {
          productId: buyNowItem._id,
          title: buyNowItem.title,
          image: buyNowItem.image,
          price:
            buyNowItem.salePrice > 0
              ? buyNowItem.salePrice
              : buyNowItem.price,
          quantity: 1,
        },
      ]
    : selectedItems && selectedItems.length > 0
    ? selectedItems.map((i) => ({
        productId: i.productId._id,
        title: i.productId.title,
        image: i.productId.image,
        price:
          i.productId.salePrice > 0
            ? i.productId.salePrice
            : i.productId.price,
        quantity: i.quantity,
      }))
    : items.map((i) => ({
        productId: i.productId._id,
        title: i.productId.title,
        image: i.productId.image,
        price:
          i.productId.salePrice > 0
            ? i.productId.salePrice
            : i.productId.price,
        quantity: i.quantity,
      }));

  // =========================
  // SUBTOTAL FIX (NO NAN)
  // =========================
  const subtotal = products.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
    0
  );

  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  const totalItems = products.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  );

  // =========================
  // FORM CHANGE
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // ORDER SUBMIT
  // =========================
  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.phone ||
        !formData.address ||
        !formData.city ||
        !formData.postalCode
      ) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      // CARD PAYMENT
      if (formData.paymentMethod === "card") {
        const res = await fetch(`${API}/orders/create-checkout-session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            products,
            shippingInfo: formData,
          }),
        });

        const data = await res.json();

        if (!res.ok || data.success === false) {
          return toast.error(data.message);
        }

        window.location.href = data.url;
        return;
      }

      // COD ORDER
      const res = await fetch(`${API}/orders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          products,
          shippingAddress: formData,
          paymentMethod: "cod",
          subtotal,
          shippingFee: shipping,
          totalAmount: total,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        return toast.error(data.message || "Failed to create order");
      }

      toast.success("Order created successfully");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        paymentMethod: "cod",
      });

      navigate("/order-success");
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-6 md:p-8">

          <div className="flex items-center gap-3 mb-8">
            <div className="bg-black text-white p-3 rounded-2xl">
              <FaLock />
            </div>

            <div>
              <h1 className="text-2xl font-bold">Secure Checkout</h1>
              <p className="text-sm text-gray-500">
                Complete your order details
              </p>
            </div>
          </div>

          <form id="checkoutForm" onSubmit={handleSubmitOrder}>

            {/* SHIPPING */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input name="firstName" onChange={handleChange} value={formData.firstName} placeholder="First Name" className="border border-gray-300 p-3 rounded-xl" required />
              <input name="lastName" onChange={handleChange} value={formData.lastName} placeholder="Last Name" className="border border-gray-300 p-3 rounded-xl" required />

              <input name="email" onChange={handleChange} value={formData.email} placeholder="Email" className="border border-gray-300 p-3 rounded-xl md:col-span-2" required />
              <input name="phone" onChange={handleChange} value={formData.phone} placeholder="Phone" className="border border-gray-300 p-3 rounded-xl md:col-span-2" required />

              <input name="address" onChange={handleChange} value={formData.address} placeholder="Address" className="border border-gray-300 p-3 rounded-xl md:col-span-2" required />

              <input name="city" onChange={handleChange} value={formData.city} placeholder="City" className="border border-gray-300 p-3 rounded-xl" required />
              <input name="postalCode" onChange={handleChange} value={formData.postalCode} placeholder="Postal Code" className="border border-gray-300 p-3 rounded-xl" required />

            </div>

            {/* PAYMENT */}
            <div className="mt-6 space-y-3">

              <label className="flex justify-between border border-gray-300 p-4 rounded-xl">
                Cash on Delivery
                <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === "cod"} onChange={handleChange} />
              </label>

              <label className="flex justify-between border border-gray-300 p-4 rounded-xl">
                Card Payment
                <input  type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === "card"} onChange={handleChange} />
              </label>

            </div>

          </form>
        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-3xl shadow-lg p-6 h-fit">

          <h2 className="text-xl font-bold mb-6">Order Summary</h2>

          <div className="space-y-4">
            {products.map((item) => (
              <div key={item.productId} className="flex justify-between border-b pb-3">
                 <img
           src={item.image}
            alt={item.title}
        className="w-16 h-16 object-cover rounded-xl"
         />

                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>

                <p>
                  ${(item.price || 0) * (item.quantity || 0)}
                </p>

              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4 space-y-2">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shipping}</span>
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total}</span>
            </div>

          </div>

          <button
            type="submit"
            form="checkoutForm"
            disabled={loading}
            className="w-full mt-6 bg-black text-white py-3 rounded-xl"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default Checkout;






