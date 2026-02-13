import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById, getProjectsByCustomer } from "../../api/projectApi";
import { getCustomerIdFromStorage } from "../../util/auth";

function formatDate(iso) {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

// ✅ progress = 100 / number of statuses (steps)
const STATUS_STEPS = ["Planning", "Design", "Construction", "Finishing", "Handover"];

function calcProgress(statusLabel) {
  const step = 100 / STATUS_STEPS.length;
  const idx = STATUS_STEPS.findIndex(
    (s) => s.toLowerCase() === String(statusLabel || "").toLowerCase()
  );

  if (String(statusLabel || "").toLowerCase() === "on hold") return 0;
  if (idx === -1) return 0;

  // example: Planning => 20, Design=>40, ... Handover=>100
  return Math.round(step * (idx + 1));
}

const ProjectDetails = () => {
  const { id } = useParams(); // optional now
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [selectedId, setSelectedId] = useState(id ? Number(id) : null);

  const [selected, setSelected] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingOne, setLoadingOne] = useState(false);
  const [err, setErr] = useState("");

  // ✅ Load all customer projects on page open
  useEffect(() => {
    let alive = true;

    async function loadList() {
      try {
        setLoadingList(true);
        setErr("");

        const customerId = getCustomerIdFromStorage();
        if (!customerId) {
          throw new Error(
            "Customer ID not found in browser storage. Save user id after login."
          );
        }

        const list = await getProjectsByCustomer(customerId);
        if (!alive) return;

        setProjects(Array.isArray(list) ? list : []);

        // auto-select:
        const initialId =
          (id && Number(id)) ||
          (list?.[0]?.id ? Number(list[0].id) : null);

        setSelectedId(initialId);

        // keep URL clean but stable:
        if (!id && initialId) navigate(`/customer/project-details/${initialId}`, { replace: true });
      } catch (e) {
        if (!alive) return;
        setErr(
          e?.response?.data?.message ||
            e?.response?.data ||
            e?.message ||
            "Failed to load customer projects"
        );
      } finally {
        if (alive) setLoadingList(false);
      }
    }

    loadList();
    return () => {
      alive = false;
    };
  }, [id, navigate]);

  // ✅ Load selected project details (by id)
  useEffect(() => {
    let alive = true;

    async function loadOne() {
      if (!selectedId) {
        setSelected(null);
        return;
      }

      try {
        setLoadingOne(true);
        setErr("");
        const data = await getProjectById(selectedId);
        if (!alive) return;
        setSelected(data);
      } catch (e) {
        if (!alive) return;
        setErr(
          e?.response?.data?.message ||
            e?.response?.data ||
            e?.message ||
            "Failed to load project"
        );
      } finally {
        if (alive) setLoadingOne(false);
      }
    }

    loadOne();
    return () => {
      alive = false;
    };
  }, [selectedId]);

  const overallProgress = useMemo(() => calcProgress(selected?.status), [selected?.status]);

  const topCards = useMemo(() => {
    return [
      { label: "Start Date", value: formatDate(selected?.startDate) },
      { label: "Location", value: selected?.location || "-" },
      { label: "Status", value: selected?.status || "-" },
      { label: "Progress", value: `${overallProgress}%` },
    ];
  }, [selected, overallProgress]);

  return (
    <div className="flex min-h-screen bg-[#f4f1ec]">

      <main className="flex-1 p-8">
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT: Projects list */}
          <div className="col-span-4 bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">My Projects</h2>
              {loadingList && <span className="text-xs text-gray-500">Loading...</span>}
            </div>

            {err && (
              <div className="p-3 mb-3 text-sm text-red-700 bg-red-50 rounded-lg">
                {String(err)}
              </div>
            )}

            {!loadingList && projects.length === 0 && (
              <div className="p-3 text-sm text-gray-600 bg-gray-50 rounded-lg">
                No projects found for this customer.
              </div>
            )}

            <div className="space-y-2">
              {projects.map((p) => {
                const active = Number(p.id) === Number(selectedId);
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedId(Number(p.id));
                      navigate(`/customer/project-details/${p.id}`);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition ${
                      active
                        ? "bg-[#7a726c] text-white border-[#7a726c]"
                        : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-semibold">{p.name}</div>
                    <div className={`text-xs mt-1 ${active ? "text-white/80" : "text-gray-500"}`}>
                      {p.location || "-"} • {p.status || "-"} • {formatDate(p.startDate)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Selected details */}
          <div className="col-span-8">
            {loadingOne && (
              <div className="bg-white rounded-xl p-6 shadow-sm">Loading project details...</div>
            )}

            {!loadingOne && !selected && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                Select a project to view details.
              </div>
            )}

            {!loadingOne && selected && (
              <>
                <h1 className="mb-2 text-2xl font-semibold">{selected?.name}</h1>

                <p className="max-w-3xl mb-6 text-gray-500">
                  {selected?.description || "—"}
                </p>

                {/* Top Info Cards */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                  {topCards.map((item, i) => (
                    <div key={i} className="bg-[#7a726c] text-white p-5 rounded-xl">
                      <p className="text-sm opacity-80">{item.label}</p>
                      <h3 className="mt-1 font-semibold">{item.value}</h3>
                    </div>
                  ))}
                </div>

                {/* Progress */}
                <div className="bg-[#7a726c] p-6 rounded-xl text-white">
                  <h3 className="mb-4 font-semibold">Current Status & Progress</h3>

                  <p className="mb-1 text-sm">Overall Progress</p>
                  <div className="w-full h-2 mb-6 bg-gray-500 rounded">
                    <div
                      className="bg-black h-2 rounded"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>

                  <h4 className="mb-3 font-semibold">Status Steps</h4>

                  {STATUS_STEPS.map((stepLabel, i) => {
                    const stepValue = Math.round((100 / STATUS_STEPS.length) * (i + 1));
                    const done = overallProgress >= stepValue;
                    return (
                      <div key={stepLabel} className="mb-3">
                        <div className="flex justify-between mb-1 text-sm">
                          <span>{stepLabel}</span>
                          <span>{done ? "✅" : "⬜"} {stepValue}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-500 rounded">
                          <div
                            className="h-2 bg-black rounded"
                            style={{ width: `${done ? stepValue : 0}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;
