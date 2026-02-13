import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Sparkles, User, Wrench } from "lucide-react";
import workerService from "../../services/workerService";

function cx(...c) {
  return c.filter(Boolean).join(" ");
}

export default function AddWorkerForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", skill: "" });
  const [loading, setLoading] = useState(false);

  const errors = useMemo(() => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 3) e.name = "Name must be at least 3 chars.";
    if (!form.skill.trim() || form.skill.trim().length < 2) e.skill = "Skill is required.";
    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  async function onSubmit(e) {
    e.preventDefault();
    if (!isValid) return toast.error("Fix errors first.");

    try {
      setLoading(true);
      await workerService.create({ name: form.name.trim(), skill: form.skill.trim() });
      toast.success("Worker created!");
      navigate("/admin/workers"); // change route
    } catch (err) {
      toast.error(err?.response?.data?.message || "Create failed");
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

      <div className="relative p-6 md:p-8 space-y-6">
        <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-xl shadow-lg shadow-black/20 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-bold text-white/80 ring-1 ring-white/10">
              <Sparkles size={16} /> Admin • Workers
            </div>
            <h1 className="mt-4 text-3xl font-extrabold">Add Worker</h1>
            <p className="mt-2 text-sm text-white/60">Creates a record in workers table.</p>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-5 py-3 text-sm font-extrabold text-white/85 ring-1 ring-white/10 hover:bg-white/10"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-xl shadow-lg shadow-black/20">
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Worker Name" icon={<User size={18} />} error={errors.name}>
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className={inputClass(!!errors.name)}
              />
            </Field>

            <Field label="Skill" icon={<Wrench size={18} />} error={errors.skill}>
              <input
                value={form.skill}
                onChange={(e) => setForm((p) => ({ ...p, skill: e.target.value }))}
                className={inputClass(!!errors.skill)}
                placeholder="e.g., Mason, Electrician..."
              />
            </Field>

            <div className="md:col-span-2 flex justify-end">
              <button
                disabled={!isValid || loading}
                className={cx(
                  "rounded-2xl px-7 py-3 text-sm font-extrabold text-white shadow-lg",
                  "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-blue-600/20 hover:opacity-95",
                  (!isValid || loading) && "opacity-50 cursor-not-allowed hover:opacity-50"
                )}
              >
                {loading ? "Saving..." : "Create Worker"}
              </button>
            </div>
          </form>
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
          error ? "bg-red-500/10 ring-red-500/25" : "bg-white/5 ring-white/10"
        )}
      >
        <div className={cx("shrink-0", error ? "text-red-200" : "text-white/55")}>{icon}</div>
        <div className="w-full">{children}</div>
      </div>
      {error && <p className="mt-1 text-xs font-semibold text-red-200">{error}</p>}
    </div>
  );
}

function inputClass(isError) {
  return cx(
    "w-full bg-transparent outline-none text-white/90 placeholder:text-white/35",
    isError && "text-red-100 placeholder:text-red-200/60"
  );
}
