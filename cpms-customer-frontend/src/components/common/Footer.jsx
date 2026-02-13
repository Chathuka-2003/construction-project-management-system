import { Link } from "react-router-dom";
import { Leaf, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      {/* top glow divider */}
      <div className="h-[2px] w-full bg-gradient-to-r from-emerald-400/70 via-amber-400/70 to-emerald-400/70" />

      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-400/25">
                <Leaf className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">
                  EcohBuild
                </h3>
                <p className="text-xs text-white/60">
                  Sustainable Construction Management
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-white/70">
              Build smarter, greener projects with clear tracking, transparent
              progress, and better collaboration.
            </p>

            <div className="mt-6 inline-flex rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/70">
              🌿 Eco-first planning • 📈 Real-time progress • 🤝 Team-friendly
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-white">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  className="text-white/70 hover:text-white transition"
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="text-white/70 hover:text-white transition"
                  to="/about"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  className="text-white/70 hover:text-white transition"
                  to="/gallery"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  className="text-white/70 hover:text-white transition"
                  to="/login"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-white">
              Contact
            </h4>

            <div className="mt-4 space-y-4 text-sm">
              <div className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-amber-300" />
                <div>
                  <p className="text-white/85">+1 (555) 123-4567</p>
                  <p className="text-xs text-white/60">Mon–Fri, 9AM–6PM</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-amber-300" />
                <div>
                  <p className="text-white/85">info@ecohbuild.com</p>
                  <p className="text-white/85">support@ecohbuild.com</p>
                </div>
              </div>

              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-amber-300" />
                <div>
                  <p className="text-white/85">123 Green Street</p>
                  <p className="text-white/85">Eco City, EC 12345</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/60 md:flex-row">
          <p>© {new Date().getFullYear()} EcohBuild. All rights reserved.</p>
          <p className="text-white/50">
            Designed for sustainability • Built for productivity
          </p>
        </div>
      </div>
    </footer>
  );
}
