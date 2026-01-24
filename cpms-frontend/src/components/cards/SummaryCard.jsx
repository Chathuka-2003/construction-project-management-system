export default function SummaryCard({ icon, label, value }) {
  return (
    <div className="bg-white shadow rounded p-4 flex items-center gap-4">
      <div>{icon}</div>  {/* <- This will render the Lucide icon */}
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
