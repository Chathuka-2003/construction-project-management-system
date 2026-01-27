import DashboardLayout from "../../components/common/DashboardLayout";

export default function VehicleDashboard() {
  return (
    <DashboardLayout role={"admin"}>
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-1">
          Construction Vehicle Management
        </h1>
        <p className="text-gray-600 mb-6">
          Sri Lankan Construction Fleet System
        </p>

      <div className="grid grid-cols-4 gap-4">
        {[
          ["Total Vehicles", 34],
          ["Active Vehicles", 32],
          ["Assigned Vehicles", 26],
          ["Under Maintenance", 2],
        ].map(([title, value]) => (
          <div
            key={title}
            className="bg-[#E7D6C1] rounded-xl p-4"
          >
            <p className="text-sm">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>
    </main>
    </DashboardLayout>
  );
}