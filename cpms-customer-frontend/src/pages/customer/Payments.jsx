import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import { getMyPayments, initPayHere, getPaymentById } from "../../api/paymentApi";

function fmtMoney(amount, currency = "LKR") {
  const n = Number(amount || 0);
  return `${currency} ${n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function fmtDate(s) {
  if (!s) return "-";
  return String(s).slice(0, 10);
}

function statusColor(status) {
  const v = String(status || "").toUpperCase();
  if (v === "PAID") return "text-green-400";
  if (v === "PENDING") return "text-yellow-300";
  return "text-red-300";
}

// ✅ guaranteed PayHere loader
function loadPayHereScript() {
  return new Promise((resolve, reject) => {
    if (window.payhere) return resolve(true);

    const existing = document.querySelector("script[data-payhere='true']");
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => reject(new Error("PayHere script failed to load")));
      return;
    }

    const s = document.createElement("script");
    s.src = "https://sandbox.payhere.lk/lib/payhere.js";
    s.async = true;
    s.type = "text/javascript";
    s.dataset.payhere = "true";
    s.onload = () => resolve(true);
    s.onerror = () => reject(new Error("PayHere script failed to load"));
    document.body.appendChild(s);
  });
}

export default function Payments() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [payments, setPayments] = useState([]);
  const [payingId, setPayingId] = useState(null);

  async function loadMyInvoices() {
    try {
      setLoading(true);
      setErr("");
      const list = await getMyPayments();
      setPayments(Array.isArray(list) ? list : []);
    } catch (e) {
      setErr(
        e?.response?.data?.message ||
          e?.response?.data ||
          e?.message ||
          "Failed to load invoices"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMyInvoices();
  }, []);

  const pending = useMemo(
    () => payments.filter((p) => String(p.status).toUpperCase() === "PENDING"),
    [payments]
  );

  const history = useMemo(
    () => payments.filter((p) => String(p.status).toUpperCase() !== "PENDING"),
    [payments]
  );

  function downloadInvoice(p) {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text("EcoBuild Construction", 20, 20);

    pdf.setFontSize(12);
    pdf.text(`Invoice No: ${p.invoiceNo || "-"}`, 20, 40);
    pdf.text(`Payment ID: ${p.id}`, 20, 50);
    pdf.text(`Project ID: ${p.projectId}`, 20, 60);
    pdf.text(`Amount: ${fmtMoney(p.amount, "LKR")}`, 20, 70);
    pdf.text(`Status: ${p.status}`, 20, 80);
    pdf.text(`Due Date: ${fmtDate(p.dueDate)}`, 20, 90);
    pdf.text(`Paid Date: ${fmtDate(p.paidDate)}`, 20, 100);
    pdf.text(`Created At: ${p.createdAt || "-"}`, 20, 110);

    pdf.save(`invoice_${p.invoiceNo || p.id}.pdf`);
  }

  async function pollUntilPaid(paymentId) {
    const maxTries = 20;
    for (let i = 0; i < maxTries; i++) {
      try {
        const updated = await getPaymentById(paymentId);
        const st = String(updated?.status || "").toUpperCase();
        if (st === "PAID") return updated;
        if (st === "FAILED") return updated;
      } catch {}
      await new Promise((r) => setTimeout(r, 3000));
    }
    return null;
  }

  async function handlePayNow(payment) {
    const paymentId = payment?.id;
    if (!paymentId) return;

    try {
      setPayingId(paymentId);

      // ✅ 1) make sure payhere script exists
      await loadPayHereScript();

      if (!window.payhere) {
        toast.error("PayHere script not available. Check network / adblock.");
        return;
      }

      // ✅ 2) init from backend
      const init = await initPayHere(paymentId);

      // ✅ 3) callbacks
      window.payhere.onCompleted = async function () {
        toast.success("Payment completed. Updating status...");
        const updated = await pollUntilPaid(paymentId);
        await loadMyInvoices();

        if (!updated) {
          toast("Payment done. If still PENDING, your notify_url must be public (ngrok).");
        } else if (String(updated.status).toUpperCase() === "PAID") {
          toast.success("Invoice marked as PAID ✅");
        } else {
          toast("Payment status: " + updated.status);
        }
      };

      window.payhere.onDismissed = function () {
        toast("Payment cancelled");
      };

      window.payhere.onError = function (error) {
        toast.error("PayHere error: " + error);
      };

      // ✅ 4) open payhere popup
      window.payhere.startPayment(init);
    } catch (e) {
      toast.error(
        e?.response?.data?.message ||
          e?.response?.data ||
          e?.message ||
          "PayHere init failed"
      );
      console.error("PayNow error:", e?.response?.data || e);
    } finally {
      setPayingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#3b342f]">Payments</h1>
        <p className="text-sm text-gray-500">Manage your invoices and payment history</p>
      </div>

      {loading && (
        <div className="rounded-xl bg-white p-4 text-sm text-gray-600">
          Loading invoices...
        </div>
      )}

      {err && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {String(err)}
        </div>
      )}

      <div className="bg-[#7b736d] rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Pending Invoices</h3>
          <button
            onClick={loadMyInvoices}
            className="px-3 py-1 text-xs bg-white/10 rounded hover:bg-white/15"
          >
            Refresh
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/20">
              <tr className="text-left">
                <th className="py-2">Invoice</th>
                <th>Project</th>
                <th>Amount</th>
                <th>Due</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {pending.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-white/70">
                    No pending invoices.
                  </td>
                </tr>
              ) : (
                pending.map((p) => (
                  <tr key={p.id} className="border-b border-white/10">
                    <td className="py-3">{p.invoiceNo || `INV-${p.id}`}</td>
                    <td>#{p.projectId}</td>
                    <td>{fmtMoney(p.amount, "LKR")}</td>
                    <td>{fmtDate(p.dueDate)}</td>
                    <td className={statusColor(p.status)}>{p.status}</td>
                    <td className="text-right">
                      <button
                        onClick={() => handlePayNow(p)}
                        disabled={payingId === p.id}
                        className="px-3 py-1 text-xs bg-orange-500 rounded disabled:opacity-60"
                      >
                        {payingId === p.id ? "Opening..." : "Pay Now"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#7b736d] rounded-xl p-6 text-white">
        <h3 className="mb-4 text-lg font-semibold">Payment History</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/20">
              <tr className="text-left">
                <th className="py-2">Invoice</th>
                <th>Project</th>
                <th>Amount</th>
                <th>Paid Date</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-white/70">
                    No payment history yet.
                  </td>
                </tr>
              ) : (
                history.map((p) => (
                  <tr key={p.id} className="border-b border-white/10">
                    <td className="py-3">{p.invoiceNo || `INV-${p.id}`}</td>
                    <td>#{p.projectId}</td>
                    <td>{fmtMoney(p.amount, "LKR")}</td>
                    <td>{fmtDate(p.paidDate)}</td>
                    <td className={statusColor(p.status)}>{p.status}</td>
                    <td className="text-right">
                      <button
                        onClick={() => downloadInvoice(p)}
                        className="px-3 py-1 text-xs bg-green-500 rounded"
                      >
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-xs text-gray-500">
        Note: If PayHere payment completes but invoice stays <b>PENDING</b>, your backend
        <b> notify_url must be public</b> (ngrok). PayHere cannot call localhost.
      </div>
    </div>
  );
}
