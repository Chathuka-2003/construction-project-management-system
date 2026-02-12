import { Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRegister = () => {
    const { name, email, phone, company, password, confirmPassword, terms } =
      form;

    // ❌ Empty validation
    if (
      !name ||
      !email ||
      !phone ||
      !company ||
      !password ||
      !confirmPassword
    ) {
      toast.error("Please fill all fields");
      return;
    }

    // ❌ Password match check
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // ❌ Terms validation
    if (!terms) {
      toast.error("Please accept Terms & Conditions");
      return;
    }

    // ✅ Fake register success
    toast.success("Account created successfully");

    console.log({
      ...form,
      role: "Customer", // 🔥 fixed role
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1020] to-[#020617]">
      <div className="w-full max-w-3xl bg-[#0b1224]/80 backdrop-blur rounded-2xl p-10 text-white shadow-xl">
        <h2 className="mb-8 text-3xl font-semibold text-center">
          Create Account
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input"
            placeholder="Full Name"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="input"
            placeholder="Email Address"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="input"
            placeholder="Phone Number"
          />

          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            className="input"
            placeholder="Company Name"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="input"
            placeholder="Password"
          />

          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="input"
            placeholder="Confirm Password"
          />
        </div>

        {/* ✅ Fixed role display instead of select */}
        <div className="mt-6">
          <input
            value="Customer"
            disabled
            className="bg-gray-800 cursor-not-allowed input"
          />
        </div>

        <div className="flex items-center gap-2 mt-4 text-sm">
          <input
            type="checkbox"
            name="terms"
            checked={form.terms}
            onChange={handleChange}
          />
          <span>
            I agree to the{" "}
            <span className="text-teal-400">Terms & Conditions</span>
          </span>
        </div>

        <button
          onClick={handleRegister}
          className="w-full py-3 mt-6 font-semibold bg-teal-500 hover:bg-teal-600 rounded-xl"
        >
          Create Account
        </button>

        <p className="mt-6 text-sm text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/" className="text-teal-400">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
