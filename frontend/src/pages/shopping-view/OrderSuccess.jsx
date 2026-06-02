import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/order-success");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-green-600">
        Order Successful 🎉
      </h1>
      <p><Link to="/my-orders" className="text-sky-600 hover:underline cursor-pointer">click here</Link> to see your order details</p>
    </div>
  );
}

export default OrderSuccess;