import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Leaf } from "lucide-react";
import logo from "../../assets/logo.jpeg";

const navLinkBase =
  "text-sm font-medium text-white/80 hover:text-white transition-colors";
const navLinkActive = "text-white";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  return (
    <header className="sticky top-0 z-50">
      {/* top gradient line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-emerald-400 via-amber-400 to-emerald-400" />

      <nav className="border-b border-white/10 bg-slate-900/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 text-white no-underline"
          >
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/15">
              <img
                src={logo}
                alt="EcohBuild Logo"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-emerald-300" />
                <span className="text-lg font-semibold tracking-tight">
                  EcohBuild
                </span>
              </div>
              <p className="hidden text-xs text-white/60 md:block">
                Sustainable Construction Management
              </p>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? navLinkActive : ""}`
              }
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? navLinkActive : ""}`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? navLinkActive : ""}`
              }
            >
              Gallery
            </NavLink>

            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm shadow-emerald-500/20 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
            >
              Login
            </Link>
          </div>

          {/* Mobile button */}
          <button
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10 md:hidden"
            onClick={() => setOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden ${
            open ? "block" : "hidden"
          } border-t border-white/10`}
        >
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="flex flex-col gap-3">
              <NavLink
                to="/"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`
                }
                end
              >
                Home
              </NavLink>

              <NavLink
                to="/about"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                About
              </NavLink>

              <NavLink
                to="/gallery"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                Gallery
              </NavLink>

              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm shadow-emerald-500/20 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
