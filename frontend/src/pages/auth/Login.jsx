import React from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "./OAuth";
import { useState } from "react";
import Spinner from "../../components//Spinner";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/slice/authSlice";

function Login() {

  const [formData, setFormdata] = useState({
    login: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth)

// -----------------------------------------getting values ----------------------------------------//
  const handleChange = (e) => {
    setFormdata((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

// ------------------------------------Submitting form ---------------------------------------------//
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      if (!formData.login || !formData.password) {
        toast.error("Please fill all fields");
        return;
      }
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.login);
      const body = isEmail
        ? { email: formData.login, password: formData.password }
        : { username: formData.login, password: formData.password };

      dispatch(signInStart());
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        dispatch(signInFailure(data.message || "Failed to login"));
        toast.error(data.message)
        return;
      }
      
      dispatch(signInSuccess(data.userInfo));
      toast.success("Login successful");
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
        <h1 className="text-xl sm:text-2xl font-bold text-center mb-6">
          Please Login
        </h1>

        <form onSubmit={handleSubmitForm} className="flex flex-col gap-4">
          <input
            type="text"
            id="login"
            value={formData.login}
            onChange={handleChange}
            placeholder="Username or Email"
            className="w-full outline-none p-3 rounded-lg border border-gray-300"
          />

          <input
            type="password"
            id="password"
            onChange={handleChange}
            value={formData.password}
            placeholder="Password"
            className="w-full outline-none p-3 rounded-lg border border-gray-300"
          />

          <button className="flex items-center justify-center bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition">
            {loading ? <Spinner /> : "Login"}
          </button>
        </form>
        <OAuth />

        <div className="flex justify-between items-center gap-2 mt-5 text-sm">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-sm text-blue-600 hover:underline"
            >
              Sign up
            </Link>
          </p>

          <Link to="/forgot-password" className="text-sm text-red-500 cursor-pointer hover:underline">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
