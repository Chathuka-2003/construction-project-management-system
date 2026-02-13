// src/components/home/Welcome.jsx
import { Leaf, Sparkles, ShieldCheck } from "lucide-react";

export function Welcome() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-16">
      {/* background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_55%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid items-center gap-10 md:grid-cols-2">
          {/* Left: text */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70">
              <Leaf className="h-4 w-4 text-emerald-300" />
              Sustainable • Smart • Reliable
            </div>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-amber-300 to-emerald-300 bg-clip-text text-transparent">
                EcohBuild
              </span>
              .
            </h2>

            <p className="mt-4 text-base leading-7 text-white/70 md:text-lg">
              Build a smarter, greener future — together. Track projects, manage
              tasks, and stay on schedule with modern, sustainable construction
              management.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm shadow-emerald-500/20 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
              >
                Get Started
              </a>
              <a
                href="/about"
                className="inline-flex items-center justify-center rounded-xl border border-white/12 bg-white/5 px-5 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Right: feature cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-400/25">
                  <Sparkles className="h-5 w-5 text-emerald-300" />
                </div>
                <h3 className="text-sm font-semibold text-white">
                  Efficient Project Control
                </h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Keep tasks, timelines, and updates organized in one clean place.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 ring-1 ring-amber-400/25">
                  <Leaf className="h-5 w-5 text-amber-300" />
                </div>
                <h3 className="text-sm font-semibold text-white">
                  Sustainability First
                </h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Support eco-friendly workflows and responsible building choices.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur sm:col-span-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                  <ShieldCheck className="h-5 w-5 text-white/80" />
                </div>
                <h3 className="text-sm font-semibold text-white">
                  Confidence & Transparency
                </h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Clear progress visibility for customers, managers, and teams —
                so everyone stays aligned.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
