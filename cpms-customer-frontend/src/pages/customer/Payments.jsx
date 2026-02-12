import { useState } from "react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";

const Payments = () => {
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const downloadInvoice = () => {
    const pdf = new jsPDF();
    pdf.text("EcoBuild Construction", 20, 20);
    pdf.text("Invoice ID: INV-2025-002", 20, 40);
    pdf.text("Amount: Rs. 32,000", 20, 55);
    pdf.text("Status: Paid", 20, 70);
    pdf.save("invoice_INV-2025-002.pdf");
  };

  const handlePayment = () => {
    if (!paymentMethod) {
      toast.error("Select a payment method");
      return;
    }

    if (paymentMethod === "card") {
      if (!card.number || !card.name || !card.expiry || !card.cvv) {
        toast.error("Fill all card details");
        return;
      }
    }

    toast.success("Payment successful!");
    setShowModal(false);
    setPaymentMethod("");
    setCard({ number: "", name: "", expiry: "", cvv: "" });
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-[#3b342f]">Payments</h1>
        <p className="text-sm text-gray-500">
          Manage your invoices and payment history
        </p>
      </div>

      {/* INVOICES */}
      <div className="bg-[#7b736d] rounded-xl p-6 text-white">
        <h3 className="mb-4 text-lg font-semibold">Invoices</h3>

        <table className="w-full text-sm">
          <thead className="border-b border-white/20">
            <tr>
              <th>Invoice</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {/* Pending */}
            <tr className="border-b border-white/10">
              <td>INV-2025-001</td>
              <td>Rs. 45,000</td>
              <td className="text-yellow-400">Pending</td>
              <td>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-3 py-1 text-xs bg-orange-500 rounded"
                >
                  Pay Now
                </button>
              </td>
            </tr>

            {/* Paid */}
            <tr>
              <td>INV-2025-002</td>
              <td>Rs. 32,000</td>
              <td className="text-green-400">Paid</td>
              <td>
                <button
                  onClick={downloadInvoice}
                  className="px-3 py-1 text-xs bg-green-500 rounded"
                >
                  Download PDF
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PAYMENT HISTORY */}
      <div className="bg-[#7b736d] rounded-xl p-6 text-white">
        <h3 className="mb-4 text-lg font-semibold">Payment History</h3>

        <table className="w-full text-sm">
          <thead className="border-b border-white/20">
            <tr>
              <th>Invoice</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>INV-2025-002</td>
              <td>Rs. 32,000</td>
              <td>Credit Card</td>
              <td className="text-green-400">Completed</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PAYMENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#5c534d] text-white w-[420px] rounded-xl p-6">
            <h2 className="mb-3 text-lg font-semibold">Make Payment</h2>

            {/* METHOD */}
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-[#6b625b] rounded px-3 py-2 mb-4"
            >
              <option value="">Select payment method</option>
              <option value="card">Credit / Debit Card</option>
              <option value="bank">Bank Transfer</option>
              <option value="online">Online Wallet</option>
            </select>

            {/* CARD PAYMENT */}
            {paymentMethod === "card" && (
              <div className="mb-4 space-y-2">
                <input
                  placeholder="Card Number"
                  value={card.number}
                  onChange={(e) => setCard({ ...card, number: e.target.value })}
                  className="w-full bg-[#6b625b] px-3 py-2 rounded"
                />
                <input
                  placeholder="Card Holder Name"
                  value={card.name}
                  onChange={(e) => setCard({ ...card, name: e.target.value })}
                  className="w-full bg-[#6b625b] px-3 py-2 rounded"
                />
                <div className="flex gap-2">
                  <input
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={(e) =>
                      setCard({ ...card, expiry: e.target.value })
                    }
                    className="w-full bg-[#6b625b] px-3 py-2 rounded"
                  />
                  <input
                    placeholder="CVV"
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                    className="w-full bg-[#6b625b] px-3 py-2 rounded"
                  />
                </div>
              </div>
            )}

            {/* BANK PAYMENT */}
            {paymentMethod === "bank" && (
              <div className="p-3 mb-4 text-xs rounded bg-black/20">
                <p>Bank: EcoBuild National Bank</p>
                <p>Account Name: EcoBuild Construction Ltd</p>
                <p>Account No: 1234567890</p>
                <p>Branch: Colombo 07</p>
              </div>
            )}

            {/* ONLINE */}
            {paymentMethod === "online" && (
              <p className="mb-4 text-sm text-gray-300">
                You will be redirected to secure payment gateway.
              </p>
            )}

            {/* BUTTONS */}
            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handlePayment}
                className="px-4 py-2 bg-orange-500 rounded"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
