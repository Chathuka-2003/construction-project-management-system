// src/pages/auth/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff, Briefcase } from "lucide-react";
import Logo from "../../assets/Logo.png";

export default function CMSLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // TEMP LOGIC
    let role = "staff";
    if (username.toLowerCase() === "admin") role = "admin";

    localStorage.setItem("role", role);
    localStorage.setItem("username", username);

    if (role === "admin") navigate("/admin");
    else navigate("/staff");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-blue-900 to-gray-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">

        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            {/* Logo */}
            <img
              src={Logo}
              alt="CMS Logo"
              className="h-32 w-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">echo build</h1>
          <p className="text-gray-400 uppercase tracking-wider text-sm">
            Construction Management System
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700">
          <form onSubmit={handleLogin} className="space-y-6">

            {/* Username */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-300">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-gray-700 border-gray-600 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Remember me</span>
              </label>
              <span className="text-sm text-blue-400">Forgot password?</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Sign In
            </button>

            {/* Demo Info */}
            <div className="text-center">
              <p className="text-sm text-gray-400">
                Demo:
                <br />
                Username <b>admin</b> → Admin Dashboard
                <br />
                Any other username → Staff Dashboard
              </p>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            © 2026 Construction Management System. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  );
}
