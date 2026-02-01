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
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 w-full">
      <div className="flex justify-between items-start mb-4">
        <div className={`${color} bg-opacity-10 p-3 rounded-xl`}>{icon}</div>
        <div
          className={`flex items-center gap-1 text-sm font-semibold ${
            trend === "up" ? "text-green-600" : "text-red-600"
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
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );

  /* =======================
     Resource Distribution
  ======================= */
  const ResourceDistribution = () => {
    const resources = [
      { name: "Human Resources", percentage: 55, impact: 4, color: "bg-emerald-500" },
      { name: "Energy", percentage: 25, impact: 3, color: "bg-amber-500" },
      { name: "Materials", percentage: 20, impact: 2, color: "bg-gray-500" },
      { name: "Water", percentage: 12, impact: 5, color: "bg-amber-600" },
      { name: "Technology", percentage: 25, impact: 4, color: "bg-gray-800" },
    ];

    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 w-full">
        <h2 className="text-xl font-bold mb-6">Resource Distribution</h2>

        <div className="space-y-4">
          {resources.map((res, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{res.name}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Leaf
                        key={i}
                        className={`w-3 h-3 ${
                          i < res.impact
                            ? "text-green-600 fill-green-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm font-bold">{res.percentage}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
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
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-sm border border-green-100 w-full">
      <h2 className="text-xl font-bold mb-4">Sustainability Insights</h2>

      <div className="space-y-4">
        <InsightCard
          icon={<TrendingUp className="w-5 h-5 text-green-600" />}
          title="Great Progress!"
          desc="Carbon emissions reduced by 8% this quarter"
        />
        <InsightCard
          icon={<Droplet className="w-5 h-5 text-blue-600" />}
          title="Water Optimization"
          desc="Consider water recycling in Manufacturing"
        />
        <InsightCard
          icon={<Sun className="w-5 h-5 text-amber-600" />}
          title="Renewable Energy"
          desc="64% of energy comes from renewables"
        />
      </div>


    </div>
  );

  const InsightCard = ({ icon, title, desc }) => (
    <div className="bg-white p-4 rounded-xl border">
      <div className="flex gap-3">
        <div className="p-2 rounded-lg bg-gray-100">{icon}</div>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-gray-600">{desc}</p>
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
    <div className="w-full max-w-none px-6 py-6">
      {/* Header */}
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Resource Allocation Overview</h1>
          <p className="text-gray-600">Sustainability-focused resource management</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="1m">1 Month</option>
          <option value="3m">3 Months</option>
          <option value="6m">6 Months</option>
          <option value="1y">1 Year</option>
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
  );
};

export default AllocationDashboard;
