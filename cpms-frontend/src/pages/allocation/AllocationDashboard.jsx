import React, { useState } from 'react';

import {
  Leaf,
  Droplet,
  Sun,
  Recycle,
  TrendingUp,
  TrendingDown,
  Download,
  Target
} from 'lucide-react';

const AllocationDashboard = () => {
  const role = localStorage.getItem("role") || "staff";
  const [timeRange, setTimeRange] = useState('6m');
  const [alerts, setAlerts] = useState(JSON.parse(localStorage.getItem("allocationAlerts") || "[]"));

  const handleRequestAllocation = () => {
    const newAlerts = [...alerts, {
      id: Date.now(),
      message: "Staff requested to allocate resources",
      timestamp: new Date().toISOString(),
    }];
    setAlerts(newAlerts);
    localStorage.setItem("allocationAlerts", JSON.stringify(newAlerts));
    alert("Allocation request sent to admin for approval");
  };

  const handleAccept = (id) => {
    const newAlerts = alerts.filter(a => a.id !== id);
    setAlerts(newAlerts);
    localStorage.setItem("allocationAlerts", JSON.stringify(newAlerts));
    alert("Request accepted");
  };

  const handleReject = (id) => {
    const newAlerts = alerts.filter(a => a.id !== id);
    setAlerts(newAlerts);
    localStorage.setItem("allocationAlerts", JSON.stringify(newAlerts));
    alert("Request rejected");
  };

  /* =======================
     Metrics Card
  ======================= */
  const MetricsCard = ({ title, value, change, trend, icon, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className={`${color} bg-opacity-10 p-3 rounded-xl`}>
          {icon}
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-semibold ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {trend === 'up' ? (
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
      { name: 'Human Resources', percentage: 55, impact: 4, color: 'bg-emerald-500' },
      { name: 'Energy', percentage: 25, impact: 3, color: 'bg-amber-500' },
      { name: 'Materials', percentage: 20, impact: 2, color: 'bg-gray-500' },
      { name: 'Water', percentage: 12, impact: 5, color: 'bg-amber-600' },
      { name: 'Technology', percentage: 25, impact: 4, color: 'bg-gray-800' },
    ];

    return (
      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Resource Distribution
        </h2>

        <div className="space-y-4">
          {resources.map((res, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">
                    {res.name}
                  </span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Leaf
                        key={i}
                        className={`w-3 h-3 ${
                          i < res.impact
                            ? 'text-green-600 fill-green-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {res.percentage}%
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
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
    <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-sm border border-green-100">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Sustainability Insights
      </h2>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-xl border border-green-200">
          <div className="flex gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Great Progress!
              </p>
              <p className="text-xs text-gray-600">
                Carbon emissions reduced by 8% this quarter
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200">
          <div className="flex gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Droplet className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Water Optimization
              </p>
              <p className="text-xs text-gray-600">
                Consider water recycling in Manufacturing
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200">
          <div className="flex gap-3">
            <div className="bg-amber-100 p-2 rounded-lg">
              <Sun className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Renewable Energy
              </p>
              <p className="text-xs text-gray-600">
                64% of energy comes from renewables
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl">
          Optimize Allocation
        </button>

        <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
          <Download className="w-4 h-4" />
          Generate Report
        </button>
      </div>
    </div>
  );

  /* =======================
     Metrics Data
  ======================= */
  const metrics = [
    {
      title: 'Total Resources',
      value: '2.4M',
      change: '+12%',
      trend: 'up',
      icon: <Target className="w-6 h-6" />,
      color: 'text-emerald-600',
    },
    {
      title: 'Carbon Footprint',
      value: '145t',
      change: '-8%',
      trend: 'down',
      icon: <Leaf className="w-6 h-6" />,
      color: 'text-green-600',
    },
    {
      title: 'Efficiency Score',
      value: '87%',
      change: '+5%',
      trend: 'up',
      icon: <Recycle className="w-6 h-6" />,
      color: 'text-blue-600',
    },
    {
      title: 'Renewable Energy',
      value: '64%',
      change: '+15%',
      trend: 'up',
      icon: <Sun className="w-6 h-6" />,
      color: 'text-amber-600',
    },
  ];

  /* =======================
     Render (Sidebar handled by DashboardLayout)
  ======================= */
  return (
    
      <div className="p-6">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Resource Allocation Overview
            </h1>
            <p className="text-gray-600">
              Sustainability-focused resource management
            </p>
          </div>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm"
          >
            <option value="1m">1 Month</option>
            <option value="3m">3 Months</option>
            <option value="6m">6 Months</option>
            <option value="1y">1 Year</option>
          </select>
        </div>

        {role === "admin" && alerts.length > 0 && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            <h3 className="font-bold mb-2">Pending Allocation Requests</h3>
            {alerts.map(alert => (
              <div key={alert.id} className="flex justify-between items-center mb-2">
                <p>{alert.message} at {new Date(alert.timestamp).toLocaleString()}</p>
                <div>
                  <button onClick={() => handleAccept(alert.id)} className="px-2 py-1 bg-green-500 text-white rounded mr-2">Accept</button>
                  <button onClick={() => handleReject(alert.id)} className="px-2 py-1 bg-red-500 text-white rounded">Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {role === "staff" && (
          <button
            onClick={handleRequestAllocation}
            className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Allocate Resources
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((m, i) => (
            <MetricsCard key={i} {...m} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ResourceDistribution />
          </div>
          <SustainabilityInsights />
        </div>
      </div>
   
  );
};

export default AllocationDashboard;

