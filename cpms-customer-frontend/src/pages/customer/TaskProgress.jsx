export default function TaskProgress() {
  return (
    <div className="flex min-h-screen bg-[#f4f1ec]">
      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Task progress</h1>
          <p className="text-sm text-gray-500">Date: December 30, 2024</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Tasks", value: "22" },
            { label: "Completed", value: "11", color: "text-green-400" },
            { label: "In progress", value: "4", color: "text-blue-400" },
            { label: "Overall progress", value: "50%" },
          ].map((item, i) => (
            <div key={i} className="bg-[#5c6572] text-white p-5 rounded-xl">
              <p className="text-sm text-gray-300">{item.label}</p>
              <h2 className={`text-2xl font-bold ${item.color || ""}`}>
                {item.value}
              </h2>
            </div>
          ))}
        </div>

        {/* Overall Project Progress */}
        <div className="bg-[#5c6572] text-white p-6 rounded-xl mb-8">
          <div className="flex justify-between mb-3">
            <h3 className="font-medium">Overall project progress</h3>
            <span className="text-sm">50%</span>
          </div>

          <div className="w-full bg-[#394457] h-3 rounded-full">
            <div className="w-1/2 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
          </div>
        </div>

        {/* Task Progress Cards */}
        <div className="grid grid-cols-2 gap-6">
          {/* Card */}
          <TaskCard
            title="Foundation & Structure"
            percent={100}
            color="bg-green-400"
          />
          <TaskCard
            title="Walls & Roofing"
            percent={100}
            color="bg-green-400"
          />
          <TaskCard
            title="Electrical & Plumbing"
            percent={69}
            color="bg-yellow-400"
          />
          <TaskCard
            title="Interior Finishing"
            percent={38}
            color="bg-orange-400"
          />
        </div>

        {/* Landscaping */}
        <div className="mt-6">
          <TaskCard
            title="Landscaping & Exterior"
            percent={0}
            color="bg-gray-500"
          />
        </div>
      </main>
    </div>
  );
}

function TaskCard({ title, percent, color }) {
  return (
    <div className="bg-[#5c6572] text-white p-6 rounded-xl">
      <div className="flex justify-between mb-3">
        <h4 className="font-medium">{title}</h4>
        <span className="text-sm text-gray-300">{percent}%</span>
      </div>

      <div className="w-full bg-[#394457] h-3 rounded-full">
        <div
          className={`h-3 rounded-full ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
