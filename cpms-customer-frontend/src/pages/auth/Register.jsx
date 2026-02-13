import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Leaf,
  ArrowRight,
} from "lucide-react";
import { api } from "../../api/api";

const GENDERS = ["MALE", "FEMALE", "OTHER"];

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    address: "",
    gender: "",
  });

  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailOk = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()),
    [form.email]
  );
  const phoneOk = useMemo(
    () => /^[0-9]{10}$/.test(form.contactNumber.trim()),
    [form.contactNumber]
  );
  const pwOk = useMemo(() => form.password.trim().length >= 6, [form.password]);

  const canSubmit =
    form.name.trim() &&
    emailOk &&
    pwOk &&
    phoneOk &&
    form.address.trim() &&
    !!form.gender &&
    !loading;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function handleRegister(e) {
    e?.preventDefault();

    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.email.trim()) return toast.error("Email is required");
    if (!emailOk) return toast.error("Email should be valid");
    if (!pwOk) return toast.error("Password must be at least 6 characters");
    if (!form.contactNumber.trim()) return toast.error("Contact number is required");
    if (!phoneOk) return toast.error("Contact number must be 10 digits");
    if (!form.address.trim()) return toast.error("Address is required");
    if (!form.gender) return toast.error("Gender is required");

    try {
      setLoading(true);

      // ✅ matches CustomerRegisterRequest exactly
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        contactNumber: form.contactNumber.trim(),
        address: form.address.trim(),
        gender: form.gender,
      };

      const res = await api.post("/api/auth/register/customer", payload);

      toast.success(res?.data?.message || "Customer registered successfully");
      navigate("/login");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Registration failed. Please try again.";
      toast.error(msg);
      console.error("Register error:", err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.10),transparent_55%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-14 md:px-6">
        <div className="grid w-full items-stretch gap-8 md:grid-cols-2">
          <div className="hidden rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl md:flex md:flex-col md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70">
                <Leaf className="h-4 w-4 text-emerald-300" />
                EcohBuild • Customer Registration
              </div>

              <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white">
                Create your account for a
                <span className="block bg-gradient-to-r from-emerald-300 via-amber-300 to-emerald-300 bg-clip-text text-transparent">
                  smarter, greener build.
                </span>
              </h1>

              <p className="mt-4 text-sm leading-6 text-white/70">
                Register to track progress, payments, and project updates.
              </p>
            </div>

            <p className="mt-10 text-xs text-white/50">
              Backend rule: contact number must be 10 digits.
            </p>
          </div>

          <div className="w-full rounded-3xl border border-white/10 bg-slate-950/60 p-8 shadow-2xl backdrop-blur-xl md:p-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-white">Create Account</p>
                <p className="text-xs text-white/60">Customer</p>
              </div>

              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
                Role: <span className="ml-1 text-emerald-300">Customer</span>
              </div>
            </div>

            <form onSubmit={handleRegister} className="mt-8 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-white/70">Full Name</label>
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-emerald-400/50 focus-within:ring-2 focus-within:ring-emerald-400/20">
                    <User className="h-4 w-4 text-white/60" />
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-white/70">Email Address</label>
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-emerald-400/50 focus-within:ring-2 focus-within:ring-emerald-400/20">
                    <Mail className="h-4 w-4 text-white/60" />
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none"
                    />
                  </div>
                  {!emailOk && form.email.length > 2 && (
                    <p className="mt-2 text-xs text-amber-300">Email should be valid.</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-white/70">Contact Number</label>
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-emerald-400/50 focus-within:ring-2 focus-within:ring-emerald-400/20">
                    <Phone className="h-4 w-4 text-white/60" />
                    <input
                      name="contactNumber"
                      value={form.contactNumber}
                      onChange={handleChange}
                      placeholder="10-digit number"
                      className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none"
                      inputMode="numeric"
                    />
                  </div>
                  {form.contactNumber.length > 0 && !phoneOk && (
                    <p className="mt-2 text-xs text-amber-300">Contact number must be 10 digits.</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-white/70">Gender</label>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-emerald-400/50 focus-within:ring-2 focus-within:ring-emerald-400/20">
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="w-full bg-transparent text-sm text-white outline-none"
                    >
                      <option value="" className="bg-slate-900">Select gender</option>
                      {GENDERS.map((g) => (
                        <option key={g} value={g} className="bg-slate-900">
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-white/70">Address</label>
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-emerald-400/50 focus-within:ring-2 focus-within:ring-emerald-400/20">
                    <MapPin className="h-4 w-4 text-white/60" />
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Your address"
                      className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-white/70">Password</label>
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-emerald-400/50 focus-within:ring-2 focus-within:ring-emerald-400/20">
                    <Lock className="h-4 w-4 text-white/60" />
                    <input
                      type={showPw ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Min 6 characters"
                      className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      className="rounded-lg p-1 text-white/60 hover:text-white"
                      aria-label="Toggle password visibility"
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {form.password.length > 0 && !pwOk && (
                    <p className="mt-2 text-xs text-amber-300">Password must be at least 6 characters.</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className={`mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-300/50 ${
                  canSubmit
                    ? "bg-emerald-500 text-slate-900 hover:bg-emerald-400 shadow-sm shadow-emerald-500/20"
                    : "cursor-not-allowed bg-white/10 text-white/40"
                }`}
              >
                {loading ? "Creating..." : "Create Account"}
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="pt-2 text-center text-xs text-white/60">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-emerald-300 hover:text-emerald-200">
                  Sign in here
                </Link>
              </p>
            </form>

            <p className="mt-8 text-center text-[11px] text-white/45">
              Sends: name, email, password, contactNumber, address, gender
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
