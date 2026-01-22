import React, { useState } from "react";
import StatCard from "../../components/common/StatCard";
import {
  CreditCard,
  AlertTriangle,
  XCircle,
  CheckCircle,
  MessageCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Calendar,
  Wallet,
} from "lucide-react";

export default function PaymentsDashboard() {
  const [activeTab, setActiveTab] = useState("alerts");

  // ===== Payment Alerts =====
  const alertsData = [
    {
      id: 1,
      title: "Upcoming Payment Due",
      description: "Harbor Bridge - Contractor Payment #4",
      dueDate: "Jan 14, 2026",
      amount: "$65,000",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      id: 2,
      title: "Salary Payment Scheduled",
      description: "Monthly Staff Salaries",
      dueDate: "Jan 15, 2026",
      amount: "$42,000",
      icon: CreditCard,
      color: "text-red-600",
    },
    {
      id: 3,
      title: "Check Cancelled",
      description: "Material supplier check #4521 cancelled",
      dueDate: "Jan 11, 2026",
      amount: "$8,500",
      icon: XCircle,
      color: "text-orange-600",
    },
    {
      id: 4,
      title: "Deposit Received",
      description: "Downtown Office - Client advance payment",
      dueDate: "Jan 12, 2026",
      amount: "+$125,000",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      id: 5,
      title: "Bank Message",
      description: "Monthly maintenance fee debited",
      dueDate: "Jan 12, 2026",
      amount: "$150",
      icon: MessageCircle,
      color: "text-blue-600",
    },
  ];

  // ===== Today Transactions =====
  const todayTransactions = [
    {
      id: "TXN-001",
      description: "Project Payment",
      details: "Harbor Bridge - Contractor - Phase 2",
      category: "Project",
      amount: "$45,000",
      status: "completed",
      icon: CreditCard,
      color: "text-green-600",
    },
    {
      id: "TXN-002",
      description: "Material Payment",
      details: "Concrete & Steel Purchase",
      category: "Materials",
      amount: "$32,500",
      status: "completed",
      icon: XCircle,
      color: "text-red-600",
    },
    {
      id: "TXN-003",
      description: "Worker Salary",
      details: "Weekly Payroll - 45 Workers",
      category: "Payroll",
      amount: "$8,200",
      status: "completed",
      icon: Wallet,
      color: "text-blue-600",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Payments (Test)</h1>
          <p className="text-sm text-gray-500">
            Standalone Payments Dashboard (No Sidebar)
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-6">
        {["alerts", "today"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-white border"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {activeTab === "alerts" &&
          alertsData.map((item) => (
            <StatCard
              key={item.id}
              title={item.title}
              value={item.amount}
              icon={item.icon}
              color={item.color}
            />
          ))}

        {activeTab === "today" && (
          <>
            <StatCard title="Total Outgoing" value="$85,700" icon={TrendingDown} />
            <StatCard title="Total Incoming" value="$125,000" icon={TrendingUp} />
            <StatCard title="Net Flow" value="+$39,300" icon={Activity} />
          </>
        )}
      </div>

      {/* ALERT LIST */}
      {activeTab === "alerts" && (
        <ul className="space-y-3">
          {alertsData.map((alert) => (
            <li
              key={alert.id}
              className="bg-white p-4 rounded shadow flex justify-between"
            >
              <div className="flex gap-3">
                <alert.icon className={`text-xl ${alert.color}`} />
                <div>
                  <p className="font-semibold">{alert.title}</p>
                  <p className="text-sm text-gray-500">{alert.description}</p>
                  <p className="text-xs text-gray-400">
                    Due: {alert.dueDate}
                  </p>
                </div>
              </div>
              <div className={`font-semibold ${alert.color}`}>
                {alert.amount}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* TODAY TABLE */}
      {activeTab === "today" && (
        <div className="bg-white rounded shadow p-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Transaction</th>
                <th className="p-2">Category</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {todayTransactions.map((txn) => (
                <tr key={txn.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 flex gap-2 items-center">
                    <txn.icon className={txn.color} />
                    <div>
                      <div>{txn.description}</div>
                      <div className="text-xs text-gray-500">
                        {txn.details}
                      </div>
                    </div>
                  </td>
                  <td className="p-2">{txn.category}</td>
                  <td className="p-2">{txn.amount}</td>
                  <td className="p-2 capitalize">{txn.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
