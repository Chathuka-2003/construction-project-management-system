import React, { useState } from "react";
import {
  Leaf,
  Droplet,
  Sun,
  Recycle,
  TrendingUp,
  TrendingDown,
  Download,
  Target,
} from "lucide-react";


const AllocationDashboard = () => {
  const role = localStorage.getItem("role") || "staff";
  const [timeRange, setTimeRange] = useState("6m");
  const [alerts, setAlerts] = useState(
    JSON.parse(localStorage.getItem("allocationAlerts") || "[]")
  );

  /* =======================
     Alerts Logic
  ======================= */
  
  const handleRequestAllocation = () => {
    const newAlerts = [
      ...alerts,
      {
        id: Date.now(),
        message: "Staff requested to allocate resources",
        timestamp: new Date().toISOString(),
      },
    ];
    setAlerts(newAlerts);
    localStorage.setItem("allocationAlerts", JSON.stringify(newAlerts));
    alert("Allocation request sent to admin for approval");
  };

  const handleAccept = (id) => {
    const updated = alerts.filter((a) => a.id !== id);
    setAlerts(updated);
    localStorage.setItem("allocationAlerts", JSON.stringify(updated));
    alert("Request accepted");
  };

  const handleReject = (id) => {
    const updated = alerts.filter((a) => a.id !== id);
    setAlerts(updated);
    localStorage.setItem("allocationAlerts", JSON.stringify(updated));
    alert("Request rejected");
  };

  /* =======================
     Metrics Card
  ======================= */
  const MetricsCard = ({ title, value, change, trend, icon, color }) => (
    <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-xl shadow-lg shadow-black/20 w-full">
      <div className="flex justify-between items-start mb-4">
        <div className={`${color} bg-opacity-20 p-3 rounded-xl`}>{icon}</div>
        <div
          className={`flex items-center gap-1 text-sm font-semibold ${
            trend === "up" ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {trend === "up" ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {change}
        </div>
      </div>
      <p className="text-sm text-white/60">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );

  /* =======================
     Resource Distribution
  ======================= */
  const ResourceDistribution = () => {
    const resources = [
      { name: "Human Resources", percentage: 55, impact: 4, color: "bg-emerald-500" },
      { name: "Energy", percentage: 25, impact: 3, color: "bg-amber-500" },
      { name: "Materials", percentage: 20, impact: 2, color: "bg-cyan-500" },
      { name: "Water", percentage: 12, impact: 5, color: "bg-blue-500" },
      { name: "Technology", percentage: 25, impact: 4, color: "bg-violet-500" },
    ];

    return (
      <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-xl shadow-lg shadow-black/20 w-full">
        <h2 className="text-xl font-bold text-white mb-6">Resource Distribution</h2>

        <div className="space-y-4">
          {resources.map((res, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{res.name}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Leaf
                        key={i}
                        className={`w-3 h-3 ${
                          i < res.impact
                            ? "text-emerald-400 fill-emerald-400"
                            : "text-white/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm font-bold text-white">{res.percentage}%</span>
              </div>

              <div className="w-full bg-white/10 rounded-full h-3">
                <div
                  className={`${res.color} h-full rounded-full`}
                  style={{ width: `${res.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* =======================
     Sustainability Insights
  ======================= */
  const SustainabilityInsights = () => (
    <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-3xl p-6 ring-1 ring-emerald-500/20 backdrop-blur-xl shadow-lg shadow-black/20 w-full">
      <h2 className="text-xl font-bold text-white mb-4">Sustainability Insights</h2>

      <div className="space-y-4">
        <InsightCard
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
          title="Great Progress!"
          desc="Carbon emissions reduced by 8% this quarter"
        />
        <InsightCard
          icon={<Droplet className="w-5 h-5 text-cyan-400" />}
          title="Water Optimization"
          desc="Consider water recycling in Manufacturing"
        />
        <InsightCard
          icon={<Sun className="w-5 h-5 text-amber-400" />}
          title="Renewable Energy"
          desc="64% of energy comes from renewables"
        />
      </div>


    </div>
  );

  const InsightCard = ({ icon, title, desc }) => (
    <div className="bg-white/5 p-4 rounded-xl border border-white/10 ring-1 ring-white/5">
      <div className="flex gap-3">
        <div className="p-2 rounded-lg bg-white/10">{icon}</div>
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="text-xs text-white/60">{desc}</p>
        </div>
      </div>
    </div>
  );

  /* =======================
     Metrics Data
  ======================= */
  const metrics = [
    { title: "Total Resources", value: "2.4M", change: "+12%", trend: "up", icon: <Target />, color: "text-emerald-600" },
    { title: "Carbon Footprint", value: "145t", change: "-8%", trend: "down", icon: <Leaf />, color: "text-green-600" },
    { title: "Efficiency Score", value: "87%", change: "+5%", trend: "up", icon: <Recycle />, color: "text-blue-600" },
    { title: "Renewable Energy", value: "64%", change: "+15%", trend: "up", icon: <Sun />, color: "text-amber-600" },
  ];

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="min-h-screen bg-slate-950 text-white w-full max-w-none px-6 py-6">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 h-[380px] w-[680px] rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Resource Allocation Overview</h1>
            <p className="text-white/60 text-sm mt-1">Sustainability-focused resource management</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-white/20 rounded-lg px-4 py-2 bg-white/5 text-white outline-none focus:border-white/40"
          >
            <option className="bg-slate-900" value="1m">1 Month</option>
            <option className="bg-slate-900" value="3m">3 Months</option>
            <option className="bg-slate-900" value="6m">6 Months</option>
            <option className="bg-slate-900" value="1y">1 Year</option>
          </select>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {metrics.map((m, i) => (
            <MetricsCard key={i} {...m} />
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <ResourceDistribution />
          </div>
          <SustainabilityInsights />
        </div>
      </div>
    </div>
  );
};

export default AllocationDashboard;
