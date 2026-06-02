import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
    const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return toast.error("Please fill all fields");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API}/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.message);
      }

      toast.success("Password reset successful");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        
        <h2 className="text-2xl font-bold text-center mb-2">
          Reset Password
        </h2>

        <p className="text-gray-500 text-sm text-center mb-6">
          Enter your new password below
        </p>

        <form onSubmit={handleReset} className="space-y-4">

          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;