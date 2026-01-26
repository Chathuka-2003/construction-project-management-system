import Sidebar from "../../components/Sidebar";

const ProjectDetails = () => {
  return (
    <div className="flex min-h-screen bg-[#f4f1ec]">
      <main className="flex-1 p-8">
        <h1 className="mb-2 text-2xl font-semibold">
          Residential Villa Construction
        </h1>

        <p className="max-w-3xl mb-6 text-gray-500">
          Modern 3-story residential villa with eco-friendly materials and smart
          home integration. The project includes landscaping, swimming pool, and
          outdoor entertainment area.
        </p>

        {/* Top Info Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { label: "Start Date", value: "Dec 01, 2024" },
            { label: "Expected Completion", value: "Apr 15, 2025" },
            { label: "Budget", value: "Rs. 450,000" },
            { label: "Status", value: "In Progress" },
          ].map((item, i) => (
            <div key={i} className="bg-[#7a726c] text-white p-5 rounded-xl">
              <p className="text-sm opacity-80">{item.label}</p>
              <h3 className="mt-1 font-semibold">{item.value}</h3>
            </div>
          ))}
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-3 gap-6">
          {/* Progress */}
          <div className="col-span-2 bg-[#7a726c] p-6 rounded-xl text-white">
            <h3 className="mb-4 font-semibold">Current Status & Progress</h3>

            <p className="mb-1 text-sm">Overall Progress</p>
            <div className="w-full h-2 mb-6 bg-gray-500 rounded">
              <div className="bg-black h-2 w-[65%] rounded"></div>
            </div>

            <h4 className="mb-3 font-semibold">Project Milestones</h4>

            {[
              { name: "Foundation & Structure", progress: 100 },
              { name: "Walls & Roofing", progress: 100 },
              { name: "Electrical & Plumbing", progress: 75 },
              { name: "Interior Finishing", progress: 45 },
              { name: "Landscaping", progress: 0 },
            ].map((m, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between mb-1 text-sm">
                  <span>{m.name}</span>
                  <span>{m.progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-500 rounded">
                  <div
                    className="h-2 bg-black rounded"
                    style={{ width: `${m.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Manager */}
          <div className="bg-[#7a726c] p-6 rounded-xl text-white">
            <h3 className="mb-4 font-semibold">Assigned Manager</h3>

            <div className="flex flex-col items-center mb-4">
              <div className="flex items-center justify-center w-20 h-20 font-bold bg-orange-500 rounded-full">
                JA
              </div>
              <p className="mt-3 font-medium">John Anderson</p>
              <p className="text-sm opacity-80">Senior Project Manager</p>
            </div>

            <div className="space-y-2 text-sm">
              <p>📞 +94 77 123 4567</p>
              <p>📧 john.anderson@ecobuild.lk</p>
              <p>📍 123 Green Avenue, Colombo 07</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;
