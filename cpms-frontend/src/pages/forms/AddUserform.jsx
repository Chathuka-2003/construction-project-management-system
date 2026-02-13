// src/pages/admin/RegisterUser.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import userService from "../../services/userService"; // ✅ MUST be default import

const ROLES = ["SUPERADMIN", "ADMIN", "MANAGER", "ENGINEER", "OTHER_STAFF", "WORKER", "CUSTOMER"];
const GENDERS = ["MALE", "FEMALE", "OTHER"];

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function RegisterUser() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "OTHER_STAFF",
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
      role: form.role, // backend CompanyRegisterRequest requires role
      contactNumber: form.contactNumber.trim(),
      address: form.address.trim(),
      gender: form.gender,
      salary: Number(form.salary),
    };

    try {
      setLoading(true);

      // ✅ correct endpoint (AdminUserController -> /api/admin/register/user)
      await userService.createAdminUser(payload);

      toast.success("User registered successfully!");

      setForm({
        name: "",
        email: "",
        password: "",
        role: "OTHER_STAFF",
        contactNumber: "",
        address: "",
        gender: "MALE",
        salary: "",
      });
      setShowPw(false);

      // optional navigate back
      // navigate("/admin/manage-users");
    } catch (err) {
      toast.error(extractBackendError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 h-[380px] w-[680px] rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      <div className="relative w-full p-6 md:p-8 space-y-8">
        <div className="rounded-3xl bg-white/5 p-6 md:p-8 ring-1 ring-white/10 backdrop-blur-xl shadow-lg shadow-black/20">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-bold text-white/80 ring-1 ring-white/10">
                <Sparkles size={16} />
                Admin • Register
              </div>

              <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">
                Register User
              </h1>

              <p className="mt-2 text-sm text-white/65">
                Create accounts for staff, workers, managers, engineers and customers.
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-2 text-xs font-bold text-emerald-200 ring-1 ring-emerald-500/25">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Secure registration enabled
                <ShieldCheck size={14} className="opacity-90" />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/5 px-5 py-3 text-sm font-extrabold text-white/85 ring-1 ring-white/10 backdrop-blur hover:bg-white/10"
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <div className="w-full sm:w-[340px] rounded-3xl bg-slate-950/40 p-5 ring-1 ring-white/10 backdrop-blur shadow-md shadow-black/20">
                <p className="text-xs font-bold tracking-wider text-white/60 uppercase">
                  Password strength
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={cx(
                        "h-full rounded-full transition-all",
                        pwStrength === "weak" && "w-1/3 bg-red-500/70",
                        pwStrength === "medium" && "w-2/3 bg-amber-500/80",
                        pwStrength === "strong" && "w-full bg-emerald-500/80"
                      )}
                    />
                  </div>

                  <span
                    className={cx(
                      "text-xs font-extrabold px-3 py-1 rounded-full ring-1",
                      pwStrength === "weak" && "bg-red-500/15 text-red-200 ring-red-500/25",
                      pwStrength === "medium" && "bg-amber-500/15 text-amber-200 ring-amber-500/25",
                      pwStrength === "strong" && "bg-emerald-500/15 text-emerald-200 ring-emerald-500/25"
                    )}
                  >
                    {pwStrength.toUpperCase()}
                  </span>
                </div>

                <p className="mt-2 text-sm text-white/55">
                  Tip: Use letters, numbers, and a symbol for stronger security.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white/5 p-6 md:p-8 ring-1 ring-white/10 backdrop-blur-xl shadow-lg shadow-black/20">
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Full Name" icon={<User size={18} />} error={errors.name}>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                className={inputClass(!!errors.name)}
                placeholder="e.g., Kasun Perera"
              />
            </Field>

            <Field label="Email" icon={<Mail size={18} />} error={errors.email}>
              <input
                name="email"
                value={form.email}
                onChange={onChange}
                className={inputClass(!!errors.email)}
                placeholder="e.g., user@gmail.com"
              />
            </Field>

            <Field label="Password" icon={<Lock size={18} />} error={errors.password}>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  className={inputClass(!!errors.password, true)}
                  placeholder="Min 8 chars with letters & numbers"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/55 hover:text-white"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Field>

            <Field label="Role" icon={<Briefcase size={18} />} error={errors.role}>
              <select
                name="role"
                value={form.role}
                onChange={onChange}
                className={inputClass(!!errors.role, false, true)}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r} className="bg-slate-900">
                    {r}
                  </option>
                ))}
              </select>
            </Field>

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
                inputMode="numeric"
              />
            </Field>

            <Field label="Gender" icon={<Users size={18} />} error={errors.gender}>
              <select
                name="gender"
                value={form.gender}
                onChange={onChange}
                className={inputClass(!!errors.gender, false, true)}
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g} className="bg-slate-900">
                    {g}
                  </option>
                ))}
              </select>
            </Field>

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
                inputMode="decimal"
              />
            </Field>

            <div className="md:col-span-2 mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-2xl bg-white/5 px-6 py-3 text-sm font-extrabold text-white/80 ring-1 ring-white/10 backdrop-blur hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!isValid || loading}
                className={cx(
                  "rounded-2xl px-7 py-3 text-sm font-extrabold text-white shadow-lg",
                  "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-blue-600/20",
                  "hover:opacity-95",
                  (!isValid || loading) && "opacity-50 cursor-not-allowed hover:opacity-50"
                )}
              >
                {loading ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </div>

        <div className="pt-2 text-center text-xs text-white/45">
          © 2026 Construction Project Management System
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon, error, children }) {
  return (
    <div>
      <label className="block text-sm font-extrabold text-white/85">{label}</label>

      <div
        className={cx(
          "mt-2 flex items-center gap-2 rounded-2xl px-4 py-3 transition ring-1 backdrop-blur",
          error ? "bg-red-500/10 ring-red-500/25" : "bg-white/5 ring-white/10",
          "focus-within:ring-white/20"
        )}
      >
        <div className={cx("shrink-0", error ? "text-red-200" : "text-white/55")}>{icon}</div>
        <div className="w-full">{children}</div>
      </div>

      {error && <p className="mt-1 text-xs font-semibold text-red-200">{error}</p>}
    </div>
  );
}

function inputClass(isError, isPassword = false, isSelect = false) {
  return cx(
    "w-full bg-transparent outline-none",
    "text-white/90 placeholder:text-white/35",
    isSelect && "appearance-none",
    isPassword && "pr-10",
    isError && "text-red-100 placeholder:text-red-200/60"
  );
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
    return data.errors
      .map((x) => x.message || x.defaultMessage)
      .filter(Boolean)
      .join(" | ");
  }
  return "Registration failed. Please try again.";
}
