import React, { useState } from "react";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    try {
      setLoading(true);

      const res = await fetch(`${API}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        toast.error(data.message || "Something went wrong");
        return;
      }

      toast.success("Reset link sent to your email");
      setEmail("");

      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* BACK BUTTON */}
        <Link
          to="/login"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-6"
        >
          <FaArrowLeft />
          Back to login
        </Link>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-gray-800">
          Forgot Password
        </h2>

        <p className="text-sm text-gray-500 mt-1 mb-6">
          Enter your email and we’ll send you a reset link
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* EMAIL INPUT */}
          <div className="relative">
            <FaEnvelope className="absolute top-3.5 left-3 text-gray-400" />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-xs text-gray-500 text-center mt-6">
          We’ll send a secure link to reset your password
        </p>

      </div>
    </div>
  );
}

export default ForgotPassword;