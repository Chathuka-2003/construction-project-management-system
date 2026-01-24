// src/pages/payments/PaymentsDashboard.jsx
import React, { useState } from "react";
import StatCard from "../../components/common/StatCard";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/common/DashboardLayout";
import {
  CreditCard,
  XCircle,
  CheckCircle,
  Wallet,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Calendar,
  AlertTriangle,
} from "lucide-react";

export default function PaymentsDashboard() {
  const [activeTab, setActiveTab] = useState("alerts");
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "admin";

  // ===== Payment Alerts =====
  const alertsData = [
    { id: 1, title: "Upcoming Payment Due", description: "Harbor Bridge - Contractor Payment #4", amount: "$65,000", icon: AlertTriangle, color: "text-red-600" },
    { id: 2, title: "Salary Payment Scheduled", description: "Monthly Staff Salaries", amount: "$42,000", icon: CreditCard, color: "text-red-600" },
    { id: 3, title: "Check Cancelled", description: "Material supplier check #4521 cancelled", amount: "$8,500", icon: XCircle, color: "text-orange-600" },
    { id: 4, title: "Deposit Received", description: "Client advance payment", amount: "+$125,000", icon: CheckCircle, color: "text-green-600" },
    { id: 5, title: "Bank Message", description: "Maintenance fee debited", amount: "$150", icon: Wallet, color: "text-blue-600" },
  ];

  // ===== Today Transactions =====
  const todayTransactions = [
    { id: "TXN-001", description: "Project Payment", details: "Harbor Bridge - Phase 2", category: "Project", amount: "$45,000", status: "completed", icon: CreditCard, color: "text-green-600" },
    { id: "TXN-002", description: "Material Payment", details: "Concrete & Steel Purchase", category: "Materials", amount: "$32,500", status: "completed", icon: XCircle, color: "text-red-600" },
    { id: "TXN-003", description: "Worker Salary", details: "Weekly Payroll - 45 Workers", category: "Payroll", amount: "$8,200", status: "completed", icon: Wallet, color: "text-blue-600" },
  ];

  const totalOutgoing = "$85,700";
  const totalIncoming = "$0";
  const netFlow = "-$85,700";

  // ===== Monthly Summary =====
  const monthlyData = [
    { period: "Week 1 (Jan 1–7)", income: "$280,000", expenses: "$200,000", netFlow: "$80,000", icon: TrendingUp },
    { period: "Week 2 (Jan 8–12)", income: "$150,000", expenses: "$166,300", netFlow: "-$16,300", icon: TrendingDown },
    { period: "Week 3 (Jan 13–19)", income: "$120,000", expenses: "$129,800", netFlow: "-$9,800", icon: TrendingDown },
  ];

  const totalIncome = "$550,000";
  const totalExpenses = "$496,100";
  const totalProfit = "$53,900";

  return (
    <DashboardLayout role={role}>
      <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Payments Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome! Here’s a quick overview of payments.</p>
        </div>
        <button
          onClick={() => navigate("/payments/new")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Do Transaction
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-6">
        {["alerts", "today", "monthly"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md ${activeTab === tab ? "bg-blue-600 text-white" : "bg-white border"}`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ALERTS TAB */}
      {activeTab === "alerts" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {alertsData.map((alert) => (
            <StatCard
              key={alert.id}
              title={alert.title}
              value={alert.amount}
              icon={alert.icon}
              color={alert.color}
            />
          ))}
        </div>
      )}

      {/* TODAY TAB */}
      {activeTab === "today" && (
        <>
          {/* StatCards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard title="Total Outgoing" value={totalOutgoing} icon={TrendingDown} color="text-red-600" />
            <StatCard title="Total Incoming" value={totalIncoming} icon={TrendingUp} color="text-green-600" />
            <StatCard title="Net Flow" value={netFlow} icon={Activity} color="text-gray-800" />
          </div>

          {/* Transactions Table */}
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
                        <div className="text-xs text-gray-500">{txn.details}</div>
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
        </>
      )}

      {/* MONTHLY TAB */}
      {activeTab === "monthly" && (
        <>
          {/* StatCards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard title="Total Income" value={totalIncome} icon={DollarSign} color="text-green-600" />
            <StatCard title="Total Expenses" value={totalExpenses} icon={TrendingDown} color="text-red-600" />
            <StatCard title="Net Profit" value={totalProfit} icon={TrendingUp} color="text-blue-600" />
          </div>

          {/* Monthly Table */}
          <div className="bg-white rounded shadow p-4 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Period</th>
                  <th className="p-2">Income</th>
                  <th className="p-2">Expenses</th>
                  <th className="p-2">Net Flow</th>
                  <th className="p-2">Trend</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((row, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-2">{row.period}</td>
                    <td className="p-2 text-green-600">{row.income}</td>
                    <td className="p-2 text-red-600">{row.expenses}</td>
                    <td className="p-2">{row.netFlow}</td>
                    <td className="p-2">
                      <row.icon />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>    </DashboardLayout>  );
}
