import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { setCartItems } from "../../redux/slice/cartSlice";
import { toast } from "react-toastify";

function Cart() {
  const [cart, setCart] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  const { currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // FETCH CART
  const handleFetchCart = async () => {
    try {
      const res = await fetch(`/api/cart/${currentUser?._id}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        setCart(data.data);
        dispatch(setCartItems(data.data.items || []));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // REMOVE ITEM
  const handleRemove = async (productId) => {
    try {
      const res = await fetch(
        `/api/cart/remove/${currentUser._id}/${productId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      toast.success("Item removed");
      handleFetchCart();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // INCREASE QUANTITY
  const handleIncrease = async (item) => {
    try {
      const res = await fetch(`/api/cart/update/${item.productId._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser._id,
          productId: item.productId._id,
          quantity: item.quantity + 1,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setCart(data.data);
        dispatch(setCartItems(data.data.items || []));
        handleFetchCart();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // DECREASE QUANTITY
  const handleDecrease = async (item) => {
    if (item.quantity <= 1) return;

    try {
      const res = await fetch(`/api/cart/update/${item.productId._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser._id,
          productId: item.productId._id,
          quantity: item.quantity - 1,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setCart(data.data);
        dispatch(setCartItems(data.data.items || []));
        handleFetchCart();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleFetchCart();
  }, []);

  // Toggle selection
  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((pid) => pid !== id)
        : [...prev, id]
    );
  };

  const selectedCartItems = cart?.items?.filter((i) =>
    selectedItems.includes(i.productId._id)
  );

  // ✅ FIXED PRICE FUNCTION (IMPORTANT)
  const getPrice = (product) => {
    return product?.salePrice && product.salePrice > 0
      ? product.salePrice
      : product?.price;
  };

  // TOTAL QUANTITY
  const totalQuantity = useMemo(() => {
    return selectedCartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  }, [selectedCartItems]);

  // ✅ FIXED TOTAL PRICE (NOW MATCHES CHECKOUT)
  const totalPrice = useMemo(() => {
    return (
      selectedCartItems?.reduce(
        (acc, item) =>
          acc + getPrice(item.productId) * item.quantity,
        0
      ) || 0
    );
  }, [selectedCartItems]);

  const handleCheckout = () => {
    if (!selectedCartItems || selectedCartItems.length === 0) {
      toast.error("Please select at least one product to checkout");
      return;
    }

    navigate("/checkout", {
      state: { selectedItems: selectedCartItems },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* TOP */}
        <div className="flex items-center gap-3 mb-8">
          <FiShoppingBag size={32} className="text-slate-700" />
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Shopping Cart</h1>
            <p className="text-gray-500 text-sm">
              {cart?.items?.length || 0} items in your cart
            </p>
          </div>
        </div>

        {!cart?.items || cart.items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <h2 className="text-2xl font-semibold text-gray-700">
              Your cart is empty
            </h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">

            {/* CART ITEMS */}
            <div className="space-y-5">
              {cart.items.map((item) => (
                <div
                  key={item.productId._id}
                  className="bg-white rounded-2xl shadow-sm p-4 flex flex-col sm:flex-row gap-5"
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.productId._id)}
                    onChange={() => toggleSelect(item.productId._id)}
                    className="mr-2"
                  />

                  <div className="w-full sm:w-40 h-40 bg-gray-100 rounded-xl overflow-hidden">
                    <img
                      src={item.productId.image}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">

                    <h2 className="text-lg font-semibold">
                      {item.productId.title}
                    </h2>

                    <div className="flex items-center justify-between mt-5">

                      <div className="flex items-center border rounded-xl overflow-hidden">
                        <button onClick={() => handleDecrease(item)}>
                          <FaMinus />
                        </button>
                        <span className="px-4">{item.quantity}</span>
                        <button onClick={() => handleIncrease(item)}>
                          <FaPlus />
                        </button>
                      </div>

                      {/*  FIXED PRICE DISPLAY */}
                      <div className="text-xl font-bold">
                        ${getPrice(item.productId) * item.quantity}
                      </div>

                      <button onClick={() => handleRemove(item.productId._id)}>
                        <FaTrash />
                      </button>

                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ORDER SUMMARY */}
            <div className="bg-white p-6 rounded-2xl shadow-sm h-fit sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="flex justify-between text-gray-600">
                <span>Items</span>
                <span>{totalQuantity}</span>
              </div>

              <hr className="my-4" />

              {/*  FIXED TOTAL */}
              <div className="flex justify-between text-2xl font-bold">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-black text-white py-4 rounded-xl"
              >
                Proceed to Checkout
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;