import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Briefcase,
  Users,
  BadgeDollarSign,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

// Axios instance
const api = axios.create({
  baseURL: "http://localhost:8080",
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ROLES = ["ADMIN", "STAFF", "CUSTOMER", "ENGINEER", "MANAGER", "WORKER"];
const GENDERS = ["MALE", "FEMALE", "OTHER"];

export default function RegisterUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STAFF",
    contactNumber: "",
    address: "",
    gender: "MALE",
    salary: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const errors = useMemo(() => validate(form), [form]);
  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);
  const pwStrength = useMemo(() => passwordStrength(form.password), [form.password]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const currentErrors = validate(form);
    if (Object.keys(currentErrors).length > 0) {
      toast.error("Please fix the highlighted errors.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      role: form.role,
      contactNumber: form.contactNumber.trim(),
      address: form.address.trim(),
      gender: form.gender,
      salary: Number(form.salary),
    };

    try {
      setLoading(true);
      await api.post("/api/auth/register", payload);
      toast.success("User registered successfully!");
      setForm({
        name: "",
        email: "",
        password: "",
        role: "STAFF",
        contactNumber: "",
        address: "",
        gender: "MALE",
        salary: "",
      });
    } catch (err) {
      toast.error(extractBackendError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Register User</h1>
          <p className="mt-2 text-slate-600">
            Create accounts for staff, workers, managers, and customers.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <div className="max-w-6xl max-auto rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
        {/* Form grid */}
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name */}
          <Field label="Full Name" icon={<User size={18} />} error={errors.name}>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className={inputClass(!!errors.name)}
              placeholder="e.g., Kasun Perera"
            />
          </Field>
          {/* Email */}
          <Field label="Email" icon={<Mail size={18} />} error={errors.email}>
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              className={inputClass(!!errors.email)}
              placeholder="e.g., user@gmail.com"
            />
          </Field>
          {/* Password */}
          <Field label="Password" icon={<Lock size={18} />} error={errors.password}>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={onChange}
                className={inputClass(!!errors.password)}
                placeholder="Min 8 chars with letters & numbers"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Field>
          {/* Role */}
          <Field label="Role" icon={<Briefcase size={18} />} error={errors.role}>
            <select name="role" value={form.role} onChange={onChange} className={inputClass(!!errors.role)}>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </Field>
          {/* Contact */}
          <Field label="Contact Number" icon={<Phone size={18} />} error={errors.contactNumber}>
            <input
              name="contactNumber"
              value={form.contactNumber}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/[^\d]/g, "");
                setForm((p) => ({ ...p, contactNumber: digitsOnly }));
              }}
              className={inputClass(!!errors.contactNumber)}
              placeholder="10 digits (e.g., 0771234567)"
            />
          </Field>
          {/* Gender */}
          <Field label="Gender" icon={<Users size={18} />} error={errors.gender}>
            <select name="gender" value={form.gender} onChange={onChange} className={inputClass(!!errors.gender)}>
              {GENDERS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </Field>
          {/* Address */}
          <div className="md:col-span-2">
            <Field label="Address" icon={<MapPin size={18} />} error={errors.address}>
              <input
                name="address"
                value={form.address}
                onChange={onChange}
                className={inputClass(!!errors.address)}
                placeholder="e.g., No 12, Galle Road, Colombo"
              />
            </Field>
          </div>
          {/* Salary */}
          <Field label="Salary (LKR)" icon={<BadgeDollarSign size={18} />} error={errors.salary}>
            <input
              name="salary"
              value={form.salary}
              onChange={(e) => {
                const safe = e.target.value.replace(/[^\d.]/g, "");
                setForm((p) => ({ ...p, salary: safe }));
              }}
              className={inputClass(!!errors.salary)}
              placeholder="e.g., 75000"
            />
          </Field>
          {/* Buttons */}
          <div className="md:col-span-2 mt-6 flex gap-3 justify-end">
            <button type="button" onClick={() => navigate(-1)}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={!isValid || loading}
              className={`rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-sm ${
                !isValid || loading ? "cursor-not-allowed bg-slate-400" : "bg-slate-900 hover:bg-slate-800"
              }`}>
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------------- HELPERS ----------------
function Field({ label, icon, error, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-800">{label}</label>
      <div className={[
        "mt-2 flex items-center gap-2 rounded-xl border px-3 py-2.5 transition",
        error ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50",
        "focus-within:border-slate-400",
      ].join(" ")}>
        <div className={error ? "text-red-500" : "text-slate-500"}>{icon}</div>
        <div className="w-full">{children}</div>
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

function inputClass(isError) {
  return `w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400 ${
    isError ? "text-red-700 placeholder:text-red-300" : ""
  }`;
}

function validate(f) {
  const e = {};
  if (!f.name.trim() || f.name.trim().length < 3) e.name = "Name must be at least 3 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "Enter a valid email address.";
  if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(f.password)) e.password = "Min 8 chars, include letters & numbers.";
  if (!f.role) e.role = "Role is required.";
  if (!/^\d{10}$/.test(f.contactNumber.trim())) e.contactNumber = "Contact number must be exactly 10 digits.";
  if (!f.address.trim() || f.address.trim().length < 5) e.address = "Address must be at least 5 characters.";
  if (!f.gender) e.gender = "Gender is required.";
  const salaryNum = Number(f.salary);
  if (!f.salary || Number.isNaN(salaryNum)) e.salary = "Salary must be a valid number.";
  else if (salaryNum < 0) e.salary = "Salary cannot be negative.";
  return e;
}

function passwordStrength(pw) {
  if (!pw) return "weak";
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score >= 4) return "strong";
  if (score >= 3) return "medium";
  return "weak";
}

function extractBackendError(err) {
  const data = err?.response?.data;
  if (!data) return "Registration failed. Please try again.";
  if (typeof data === "string") return data;
  if (data.message) return data.message;
  if (data.error) return data.error;
  if (Array.isArray(data.errors) && data.errors.length) {
    return data.errors.map((x) => x.message || x.defaultMessage).filter(Boolean).join(" | ");
  }
  return "Registration failed. Please try again.";
}
