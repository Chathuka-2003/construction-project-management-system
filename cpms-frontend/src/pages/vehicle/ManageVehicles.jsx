import DashboardLayout from "../../components/common/DashboardLayout";

export default function ManageVehicles() {
  const vehicles = [
    {
      number: "LK-CAA-2146",
      type: "Tipper Truck",
      fuel: "Diesel",
      capacity: "10 Tons",
      machine: "TATA 2618",
      condition: "Good",
      status: "Available",
    },
    {
      number: "LK-WP-6032",
      type: "JCB",
      fuel: "Diesel",
      capacity: "1.5 Cubic Meter",
      machine: "JCB 3DX",
      condition: "Excellent",
      status: "Assigned",
    },
  ];

  return (
    <DashboardLayout role={"staff"}>
    <div>
      <h1 className="text-2xl font-bold mb-2">Manage Vehicles</h1>
      <p className="text-gray-600 mb-4">
        Add, edit, and manage your construction vehicle fleet
      </p>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by vehicle number, type, or machine..."
          className="border rounded px-4 py-2 w-1/2"
        />
        <button className="bg-orange-600 text-white px-4 py-2 rounded">
          + Add Vehicle
        </button>
      </div>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-black text-white">
          <tr>
            <th className="p-2 text-left">Vehicle Number</th>
            <th className="p-2">Vehicle Type</th>
            <th className="p-2">Fuel</th>
            <th className="p-2">Capacity</th>
            <th className="p-2">Machine</th>
            <th className="p-2">Condition</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v.number} className="border-b">
              <td className="p-2">{v.number}</td>
              <td className="p-2 text-center">{v.type}</td>
              <td className="p-2 text-center">{v.fuel}</td>
              <td className="p-2 text-center">{v.capacity}</td>
              <td className="p-2 text-center">{v.machine}</td>
              <td className="p-2 text-center">{v.condition}</td>
              <td className="p-2 text-center">{v.status}</td>
              <td className="p-2 text-center">✏️ 🗑️</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </DashboardLayout>
  );
}