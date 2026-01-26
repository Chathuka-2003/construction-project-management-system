import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import logo from "../../assets/logo.jpeg";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // ❌ Empty validation
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    // 🔐 Fake login save
    localStorage.setItem("token", "dummy-token");
    localStorage.setItem("role", "customer");

    toast.success("Login successful");

    // 🚀 Redirect
    navigate("/customer/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617]">
      <div className="w-full max-w-md rounded-2xl bg-[#020617]/80 backdrop-blur-xl p-8 shadow-2xl border border-white/10">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="EchoBuild Logo"
            className="w-16 h-16 p-1 bg-white rounded-md"
          />
        </div>

        <h2 className="text-2xl font-semibold text-center text-white">
          Customer
        </h2>
        <p className="mb-6 text-sm text-center text-gray-400">
          construction management system
        </p>

        {/* Email */}
        <label className="block mb-1 text-sm text-gray-300">
          Email Address
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 text-white placeholder-gray-500 bg-transparent border rounded-lg border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        {/* Password */}
        <label className="block mb-1 text-sm text-gray-300">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 text-white placeholder-gray-500 bg-transparent border rounded-lg border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between mb-6 text-sm">
          <label className="flex items-center gap-2 text-gray-300">
            <input type="checkbox" className="accent-emerald-500" />
            Remember me
          </label>
          <span className="cursor-pointer text-emerald-400 hover:underline">
            Forgot password?
          </span>
        </div>

        {/* 🔥 Sign In */}
        <button
          onClick={handleLogin}
          className="w-full py-2 font-semibold text-black transition rounded-lg bg-emerald-500 hover:bg-emerald-400"
        >
          Sign In
        </button>

        {/* Register */}
        <p className="mt-4 text-sm text-center text-gray-400">
          Don’t have an account?{" "}
          <Link to="/register" className="text-emerald-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
