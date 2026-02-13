import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({ baseURL: BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function VehicleDashboard() {
  const role = (localStorage.getItem("role") || "").replace("ROLE_", "");
  const isAllowed = ["SUPERADMIN", "ADMIN", "MANAGER"].includes(role);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    assigned: 0,
    inMaintenance: 0,
  });

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get("/api/vehicles/stats");
      const data = res.data?.data ?? res.data;
      setStats({
        total: data.total ?? 0,
        active: data.active ?? 0,
        assigned: data.assigned ?? 0,
        inMaintenance: data.inMaintenance ?? 0,
      });
    } catch (e) {
      setErr(
        e?.response?.data?.message ||
          `Failed to load stats (${e?.response?.status || "Network"})`
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAllowed) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isAllowed) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-950 text-white">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-400">
            Access denied. Admins only.
          </p>
          <p className="text-sm text-white/60 mt-2">
            Please log in with an admin account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[1100px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 h-[500px] w-[950px] rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      <main className="relative p-6 md:p-10 w-full">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Construction Vehicle Management
          </h1>
          <p className="mt-2 text-sm text-white/65">
            Sri Lankan Construction Fleet System
          </p>
        </div>

        {err && (
          <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            <div className="font-bold">Error</div>
            <div className="text-rose-100/80 mt-1 break-words">{err}</div>
          </div>
        )}

        <div className="mb-6 flex gap-3">
          <button
            onClick={load}
            className="rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-3 text-sm font-semibold text-white/90 transition"
            disabled={loading}
            type="button"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {loading ? (
            <div className="col-span-full rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 backdrop-blur-xl shadow-lg shadow-black/20 text-white/70 flex items-center gap-2">
              <Loader2 className="animate-spin" size={18} />
              Loading dashboard stats...
            </div>
          ) : (
            [
              ["Total Vehicles", stats.total],
              ["Active Vehicles", stats.active],
              ["Assigned Vehicles", stats.assigned],
              ["Under Maintenance", stats.inMaintenance],
            ].map(([title, value]) => (
              <div
                key={title}
                className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-xl shadow-lg shadow-black/20"
              >
                <p className="text-sm text-white/60">{title}</p>
                <p className="mt-3 text-3xl font-extrabold text-white">
                  {value}
                </p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
