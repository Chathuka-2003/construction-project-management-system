import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const Navigate = useNavigate();
  return (
    <div className="flex min-h-screen bg-[#f4f1ec]">
      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <h1 className="mb-1 text-2xl font-semibold">Welcome back, Customer!</h1>
        <p className="mb-8 text-gray-500">
          Here’s what’s happening with your projects today.
        </p>

        {/* Top Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { label: "Active Projects", value: "2" },
            { label: "Upcoming Appointments", value: "3" },
            { label: "Pending Payments", value: "Rs. 45,000" },
            { label: "Overall Progress", value: "48%" },
          ].map((item, index) => (
            <div key={index} className="p-5 bg-white shadow-sm rounded-xl">
              <p className="mb-1 text-sm text-gray-500">{item.label}</p>
              <h2 className="text-xl font-bold">{item.value}</h2>
            </div>
          ))}
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-2 gap-6">
          {/* Project Summary */}
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Project Summary</h3>
              <span className="text-sm text-orange-500 cursor-pointer">
                View All
              </span>
            </div>

            {/* Project Card */}
            <div className="bg-[#faf7f2] p-5 rounded-lg border mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Residential Villa Construction</p>
                  <p className="text-sm text-gray-500">
                    Manager: John Anderson
                  </p>
                </div>
                <span className="px-3 py-1 text-xs text-orange-600 bg-orange-100 rounded-full">
                  In Progress
                </span>
              </div>

              <div className="mt-4">
                <div className="flex justify-between mb-1 text-sm">
                  <span>Progress</span>
                  <span>65%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded">
                  <div className="bg-black h-2 w-[65%] rounded"></div>
                </div>
              </div>

              <p className="mt-3 text-sm text-gray-500">⏰ Due: Apr 15, 2025</p>
            </div>

            {/* Second Project */}
            <div className="bg-[#faf7f2] p-5 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Office Building Renovation</p>
                  <p className="text-sm text-gray-500">
                    Manager: Sarah Williams
                  </p>
                </div>
                <span className="px-3 py-1 text-xs text-orange-600 bg-orange-100 rounded-full">
                  In Progress
                </span>
              </div>

              <div className="mt-4">
                <div className="flex justify-between mb-1 text-sm">
                  <span>Progress</span>
                  <span>30%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded">
                  <div className="bg-black h-2 w-[30%] rounded"></div>
                </div>
              </div>

              <p className="mt-3 text-sm text-gray-500">⏰ Due: Jun 20, 2025</p>
            </div>
          </div>

          {/* Appointments */}
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Upcoming Appointments</h3>
              <span className="text-sm text-orange-500 cursor-pointer">
                View All
              </span>
            </div>

            {/* Upcoming Appointments */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
                <span className="text-sm text-orange-500 cursor-pointer">
                  View All
                </span>
              </div>

              <div className="space-y-4">
                {/* Appointment Card */}
                <div className="bg-[#faf7f2] border rounded-xl p-5 flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-semibold">Site Inspection</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      📅 Jan 05, 2025 at 10:00 AM
                    </p>

                    <span className="inline-block px-3 py-1 mt-3 text-xs text-green-600 bg-green-100 rounded">
                      Confirmed
                    </span>
                  </div>

                  <div className="text-xl text-green-500">✔</div>
                </div>

                {/* Appointment Card */}
                <div className="bg-[#faf7f2] border rounded-xl p-5 flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-semibold">
                      Design Review Meeting
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      📅 Jan 08, 2025 at 2:00 PM
                    </p>

                    <span className="inline-block px-3 py-1 mt-3 text-xs text-yellow-600 bg-yellow-100 rounded">
                      Pending
                    </span>
                  </div>

                  <div className="text-xl text-yellow-500">⏰</div>
                </div>

                {/* Appointment Card */}
                <div className="bg-[#faf7f2] border rounded-xl p-5 flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-semibold">
                      Material Selection
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      📅 Jan 12, 2025 at 11:00 AM
                    </p>

                    <span className="inline-block px-3 py-1 mt-3 text-xs text-green-600 bg-green-100 rounded">
                      Confirmed
                    </span>
                  </div>

                  <div className="text-xl text-green-500">✔</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="p-6 mt-8 bg-white shadow-sm rounded-xl">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold">Payment Summary</h3>
            <span className="text-sm text-orange-500 cursor-pointer">
              View All
            </span>
          </div>

          <table className="w-full text-sm">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-2 text-left">Invoice</th>
                <th className="py-2 text-left">Amount</th>
                <th className="py-2 text-left">Due Date</th>
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3">INV-2025-001</td>
                <td>Rs. 45,000</td>
                <td>Jan 10, 2025</td>
                <td>
                  <span className="px-3 py-1 text-xs text-yellow-600 bg-yellow-100 rounded-full">
                    Pending
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => {
                      console.log("Pay Now clicked");
                      Navigate("/Customer/Payments");
                    }}
                    className="px-4 py-2 mt-4 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
                  >
                    Pay Now
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
