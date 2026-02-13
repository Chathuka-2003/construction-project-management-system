import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff, Lock, Mail, Leaf, ArrowRight } from "lucide-react";
import logo from "../../assets/logo.jpeg";
import { api } from "../../api/api";
import { setAuthSession, clearAuthSession } from "../../util/auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const emailOk = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
    [email]
  );

  const canSubmit = emailOk && password.trim().length >= 6 && !loading;

  async function handleLogin(e) {
    e?.preventDefault();

    if (!email || !password) return toast.error("Please enter email and password");
    if (!emailOk) return toast.error("Please enter a valid email address");
    if (password.trim().length < 6) return toast.error("Password must be at least 6 characters");

    try {
      setLoading(true);

      // ✅ backend expects: { email, password }
      const res = await api.post("/api/auth/login", {
        email: email.trim(),
        password,
      });

      // ✅ ApiResponse<AuthResponse> => res.data.data
      const auth = res?.data?.data;

      // ✅ token + role
      const token = auth?.token || auth?.accessToken || auth?.jwt;
      const role = auth?.role || auth?.user?.role;

      // ✅ user object (IMPORTANT: needs id)
      const user =
        auth?.user ||
        auth?.userDTO ||
        auth?.account ||
        {
          id: auth?.id || auth?.userId || auth?.customerId,
          name: auth?.name,
          email: auth?.email || email.trim(),
          role: role,
        };

      if (!token) {
        toast.error("Login failed: token not returned by server");
        return;
      }

      // ✅ clear old sessions (prevents wrong customerId from old logins)
      clearAuthSession();

      // ✅ store token + user
      setAuthSession({ token, user });

      // ✅ store role separately (optional)
      if (role) localStorage.setItem("role", role);

      // ✅ store customerId separately (so projects/customer/{id} works)
      const customerId = user?.id || user?.userId || user?.customerId;
      if (customerId) localStorage.setItem("customerId", String(customerId));

      // remember email
      if (remember) localStorage.setItem("rememberEmail", email.trim());
      else localStorage.removeItem("rememberEmail");

      toast.success(res?.data?.message || "Login successful");

      // ✅ redirect by role
      const normalizedRole = (role || "").replace("ROLE_", "").toUpperCase();

      // ✅ go directly to project details list after login
      if (normalizedRole === "CUSTOMER") navigate("/customer/project-details");
      else if (normalizedRole === "ADMIN") navigate("/admin/overview");
      else if (normalizedRole === "MANAGER") navigate("/manager/dashboard");
      else navigate("/");

    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Login failed. Please check credentials.";
      toast.error(msg);
      console.error("Login error:", err?.response?.data || err);
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
                EcohBuild • Customer Portal
              </div>

              <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white">
                Manage projects smarter —
                <span className="block bg-gradient-to-r from-emerald-300 via-amber-300 to-emerald-300 bg-clip-text text-transparent">
                  greener & faster.
                </span>
              </h1>

              <p className="mt-4 text-sm leading-6 text-white/70">
                Track progress, communicate with teams, and keep everything organized in one place.
              </p>
            </div>

            <p className="mt-10 text-xs text-white/50">
              Tip: Use a strong password and avoid public Wi-Fi for logins.
            </p>
          </div>

          <div className="w-full rounded-3xl border border-white/10 bg-slate-950/60 p-8 shadow-2xl backdrop-blur-xl md:p-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15">
                  <img src={logo} alt="EcohBuild Logo" className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Customer Login</p>
                  <p className="text-xs text-white/60">Construction management system</p>
                </div>
              </div>

              <Link
                to="/"
                className="hidden text-xs font-medium text-white/70 hover:text-white md:block"
              >
                Back to Home
              </Link>
            </div>

            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-white/70">
                  Email Address
                </label>
                <div className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-emerald-400/50 focus-within:ring-2 focus-within:ring-emerald-400/20">
                  <Mail className="h-4 w-4 text-white/60" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none"
                    autoComplete="email"
                  />
                </div>
                {!emailOk && email.length > 2 && (
                  <p className="mt-2 text-xs text-amber-300">
                    Please enter a valid email address.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-white/70">
                  Password
                </label>
                <div className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-emerald-400/50 focus-within:ring-2 focus-within:ring-emerald-400/20">
                  <Lock className="h-4 w-4 text-white/60" />
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none"
                    autoComplete="current-password"
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
              </div>

              <div className="flex items-center justify-between pt-1 text-sm">
                <label className="flex items-center gap-2 text-xs text-white/70">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 accent-emerald-500"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  onClick={() => toast("Forgot password flow not connected yet")}
                  className="text-xs font-medium text-emerald-300 hover:text-emerald-200"
                >
                  Forgot password?
                </button>
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
                {loading ? "Signing in..." : "Sign In"}
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="pt-2 text-center text-xs text-white/60">
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-emerald-300 hover:text-emerald-200"
                >
                  Register here
                </Link>
              </p>
            </form>

            <p className="mt-8 text-center text-[11px] text-white/45">
              By continuing, you agree to EcohBuild’s Terms & Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
