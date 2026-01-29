// src/pages/staff/TaskManagement.jsx
import { useMemo, useState } from "react";
import { useStore } from "../../components/store/AppStore.jsx";
import ExpandSection from "../../components/common/ExpandSection.jsx";
import UploadModal from "../../components/modals/UploadModal.jsx";
import ConfirmDialog from "../../components/modals/ConfirmDialog.jsx";

const TASK_STATUSES = ["Not Started", "In Progress", "Blocked", "Completed"];

function emptyTask() {
  return {
    name: "",
    location: "",
    description: "",
    dueDate: "",
    assignedWorker: "",
    role: "",
    status: "Not Started",
  };
}

export default function TaskManagement() {
  const { data, addTask, updateTask, deleteTask, todayISO } = useStore();

  const [q, setQ] = useState("");
  const [sort, setSort] = useState("new");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyTask());
  const [confirm, setConfirm] = useState(null);

  const baseFiltered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = [...(data.tasks || [])];

    if (needle) {
      list = list.filter(
        (t) =>
          (t.name || "").toLowerCase().includes(needle) ||
          (t.location || "").toLowerCase().includes(needle)
      );
    }

    list.sort((a, b) => {
      const da = a.dueDate === "pending" ? 0 : new Date(a.dueDate).getTime();
      const db = b.dueDate === "pending" ? 0 : new Date(b.dueDate).getTime();
      return sort === "new" ? db - da : da - db;
    });

    return list;
  }, [data.tasks, q, sort]);

  const todays = baseFiltered.filter((t) => t.dueDate === todayISO());
  const pending = baseFiltered.filter((t) => t.dueDate === "pending");

  const startAdd = () => {
    setEditing(null);
    setForm(emptyTask());
    setOpenForm(true);
  };

  const startEdit = (t) => {
    setEditing(t);
    setForm({
      name: t.name || "",
      location: t.location || "",
      description: t.description || "",
      dueDate: t.dueDate === "pending" ? "" : t.dueDate,
      assignedWorker: t.assignedWorker || "",
      role: t.role || "",
      status: t.status || "Not Started",
    });
    setOpenForm(true);
  };

  const save = () => {
    if (!form.name.trim()) return alert("Task name is required");
    if (!form.location.trim()) return alert("Location is required");

    const payload = { ...form, dueDate: form.dueDate ? form.dueDate : "pending" };

    if (editing) updateTask(editing.id, payload);
    else addTask(payload);

    setOpenForm(false);
  };

  const pillStatusClass = (status) => {
    if (status === "Completed") return "bg-[#e8fff1] text-[#14532d]";
    if (status === "Blocked") return "bg-[#ffe9e7] text-[#7f1d1d]";
    if (status === "In Progress") return "bg-[#fff3e3] text-[#7c2d12]";
    return "bg-[#f3f3f3] text-[#222]";
  };

  const renderTaskRow = (t) => (
    <tr key={t.id} className="border-b border-[#eee]">
      <td className="p-[10px_8px] align-top">
        <b className="block">{t.name}</b>
        {t.description ? (
          <div className="text-[#6f6f6f] text-[13px] mt-1">{t.description}</div>
        ) : null}
      </td>

      <td className="p-[10px_8px] align-top">{t.location}</td>

      <td className="p-[10px_8px] align-top">
        {t.dueDate === "pending" ? (
          <span className="inline-block px-[10px] py-[5px] rounded-full text-[12px] font-bold bg-[#fff3e3] text-[#7c2d12]">
            Pending
          </span>
        ) : (
          t.dueDate
        )}
      </td>

      <td className="p-[10px_8px] align-top">
        {t.assignedWorker}
        {t.role ? <div className="text-[#6f6f6f] text-[13px]">{t.role}</div> : null}
      </td>

      <td className="p-[10px_8px] align-top">
        <span
          className={[
            "inline-block px-[10px] py-[5px] rounded-full text-[12px] font-bold",
            pillStatusClass(t.status),
          ].join(" ")}
        >
          {t.status}
        </span>
      </td>

      <td className="p-[10px_8px] align-top">
        <div className="flex gap-2 flex-wrap items-center">
          <button
            className="cursor-pointer font-bold rounded-[10px] border border-[#ddd] bg-transparent px-[10px] py-2 text-[13px]"
            onClick={() => startEdit(t)}
            type="button"
          >
            Edit
          </button>
          <button
            className="cursor-pointer font-bold rounded-[10px] bg-[#c0392b] text-white px-[10px] py-2 text-[13px]"
            onClick={() => setConfirm(t.id)}
            type="button"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-[14px] shadow-[0_10px_22px_rgba(0,0,0,.10)] p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="m-0 text-[22px] font-extrabold">Tasks</h2>
          <div className="text-[#6f6f6f] text-[13px] mt-1">
            Expandable lists: Today’s & Pending • Search + Sort • CRUD
          </div>
        </div>

        <button
          className="border-0 cursor-pointer font-bold rounded-[10px] px-3 py-2 bg-[#4b3f3a] text-white"
          onClick={startAdd}
          type="button"
        >
          + New Task
        </button>
      </div>

      <div className="h-px bg-[#eee] my-3" />

      {/* Controls */}
      <div className="flex gap-2 flex-wrap items-center">
        <input
          className="min-w-[220px] px-3 py-2 rounded-[10px] border border-[#ddd] bg-white outline-none"
          placeholder="Search by task name or location..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <select
          className="min-w-[220px] px-3 py-2 rounded-[10px] border border-[#ddd] bg-white outline-none"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="new">Due date: New → Old</option>
          <option value="old">Due date: Old → New</option>
        </select>
      </div>

      <div className="h-px bg-[#eee] my-3" />

      <div className="grid gap-[14px]">
        {/* Today */}
        <ExpandSection title="Today's Tasks" count={todays.length} defaultOpen>
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#eee]">
                  <th className="text-left p-[10px_8px]">Task</th>
                  <th className="text-left p-[10px_8px]">Location</th>
                  <th className="text-left p-[10px_8px]">Due</th>
                  <th className="text-left p-[10px_8px]">Assigned</th>
                  <th className="text-left p-[10px_8px]">Status</th>
                  <th className="text-left p-[10px_8px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {todays.map(renderTaskRow)}
                {todays.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-[#6f6f6f] text-[13px] p-[14px]">
                      No tasks for today.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </ExpandSection>

        {/* Pending */}
        <ExpandSection title="Pending Tasks" count={pending.length} defaultOpen>
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#eee]">
                  <th className="text-left p-[10px_8px]">Task</th>
                  <th className="text-left p-[10px_8px]">Location</th>
                  <th className="text-left p-[10px_8px]">Due</th>
                  <th className="text-left p-[10px_8px]">Assigned</th>
                  <th className="text-left p-[10px_8px]">Status</th>
                  <th className="text-left p-[10px_8px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map(renderTaskRow)}
                {pending.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-[#6f6f6f] text-[13px] p-[14px]">
                      No pending tasks.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </ExpandSection>
      </div>

      {/* Modal */}
      {openForm ? (
        <UploadModal title={editing ? "Edit Task" : "New Task"} onClose={() => setOpenForm(false)}>
          <div className="flex gap-2 flex-wrap items-center">
            <input
              className="min-w-[220px] px-3 py-2 rounded-[10px] border border-[#ddd] bg-white outline-none"
              placeholder="Task name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <input
              className="min-w-[220px] px-3 py-2 rounded-[10px] border border-[#ddd] bg-white outline-none"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            />
          </div>

          <div className="mt-[10px]">
            <textarea
              className="w-full min-h-[90px] px-3 py-2 rounded-[10px] border border-[#ddd] bg-white outline-none"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center mt-[10px]">
            <input
              className="min-w-[220px] px-3 py-2 rounded-[10px] border border-[#ddd] bg-white outline-none"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
            />
            <select
              className="min-w-[220px] px-3 py-2 rounded-[10px] border border-[#ddd] bg-white outline-none"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            >
              {TASK_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 flex-wrap items-center mt-[10px]">
            <input
              className="min-w-[220px] px-3 py-2 rounded-[10px] border border-[#ddd] bg-white outline-none"
              placeholder="Assigned worker"
              value={form.assignedWorker}
              onChange={(e) => setForm((f) => ({ ...f, assignedWorker: e.target.value }))}
            />
            <input
              className="min-w-[220px] px-3 py-2 rounded-[10px] border border-[#ddd] bg-white outline-none"
              placeholder="Role"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center justify-end mt-[10px]">
            <button
              className="cursor-pointer font-bold rounded-[10px] border border-[#ddd] bg-transparent px-3 py-2"
              onClick={() => setOpenForm(false)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="cursor-pointer font-bold rounded-[10px] px-3 py-2 bg-[#4b3f3a] text-white"
              onClick={save}
              type="button"
            >
              Save
            </button>
          </div>

          <div className="text-[#6f6f6f] text-[13px] mt-2">
            Leave due date empty to make it a <b>Pending Task</b>.
          </div>
        </UploadModal>
      ) : null}

      {/* Confirm */}
      {confirm ? (
        <ConfirmDialog
          message="Are you sure you want to delete this task?"
          onNo={() => setConfirm(null)}
          onYes={() => {
            deleteTask(confirm);
            setConfirm(null);
          }}
        />
      ) : null}
    </div>
  );
}
