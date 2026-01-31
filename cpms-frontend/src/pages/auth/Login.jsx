import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Building2 } from "lucide-react";
import heroImg from "../../assets/construction-hero.jpg";
import Logo from "../../assets/Logo.png";

export default function CompanyLogin() {
  const navigate = useNavigate();

  // UI state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  function onSubmit(e) {
    e.preventDefault();

    // 🔐 DEMO AUTH (for ProtectedRoute)
    localStorage.setItem("token", "dummy-token");

    if (email.toLowerCase().includes("admin")) {
      localStorage.setItem("role", "admin");
      navigate("/admin/overview", { replace: true });
    } else {
      localStorage.setItem("role", "staff");
      navigate("/staff/overview", { replace: true });
    }
  }

  return (
    <div className="min-h-screen w-screen bg-slate-950 overflow-hidden">
      <div className="mx-auto grid min-h-screen grid-cols-1 lg:grid-cols-2">

        {/* LEFT HERO */}
        <section className="relative hidden lg:block">
          <img
            src={heroImg}
            alt="Construction"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/60 to-blue-950/75" />

          <div className="relative z-10 flex h-full flex-col justify-between px-10 py-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur">
              <ShieldCheck className="h-4 w-4" />
              CPMS Company Portal
            </div>

            <div>
              <h1 className="text-4xl font-extrabold text-white">
                Manage construction projects
                <br /> with full control
              </h1>
              <p className="mt-4 max-w-lg text-slate-200">
                Projects, workforce, payments and approvals in one secure system.
              </p>
            </div>

            <div className="text-xs text-slate-300">
              © 2026 Construction Management System
            </div>
          </div>
        </section>

        {/* RIGHT FORM */}
        <section className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-[520px]">

            {/* Brand */}
            <div className="mb-6 flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-white/5 p-2 ring-1 ring-white/10">
                <img src={Logo} alt="Logo" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-white">echo build</h2>
                <p className="text-xs uppercase tracking-widest text-slate-300">
                  Construction Management System
                </p>
              </div>
            </div>

            {/* Card */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <div className="mb-6 flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/20">
                  <Building2 className="h-6 w-6 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Company Login</h3>
                  <p className="text-sm text-slate-300">
                    Admins & Staff sign in here
                  </p>
                </div>
              </div>

              <form onSubmit={onSubmit} className="space-y-5">

                {/* Email */}
                <div>
                  <label className="text-sm font-semibold text-slate-200">
                    Email
                  </label>
                  <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/30 px-4 py-3">
                    <Mail className="h-5 w-5 text-slate-300" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="company@email.com"
                      className="w-full bg-transparent text-white outline-none"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-sm font-semibold text-slate-200">
                    Password
                  </label>
                  <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/30 px-4 py-3">
                    <Lock className="h-5 w-5 text-slate-300" />
                    <input
                      type={showPw ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="text-slate-300"
                    >
                      {showPw ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 font-bold text-white hover:opacity-95"
                >
                  Login
                </button>

                <p className="text-center text-xs text-slate-400">
                  Demo login – no backend connected
                </p>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
