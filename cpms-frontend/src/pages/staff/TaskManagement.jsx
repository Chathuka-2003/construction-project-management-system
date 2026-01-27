
import { useMemo, useState } from "react";
import { useStore } from "../components/store/AppStore.jsx";
import ExpandSection from "../components/common/ExpandSection.jsx";
import UploadModal from "../components/modals/UploadModal.jsx";
import ConfirmDialog from "../components/modals/ConfirmDialog.jsx";

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
  const [sort, setSort] = useState("new"); // due date sorting
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyTask());
  const [confirm, setConfirm] = useState(null);

  const baseFiltered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = [...data.tasks];

    if (needle) {
      list = list.filter(t =>
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

  const todays = baseFiltered.filter(t => t.dueDate === todayISO());
  const pending = baseFiltered.filter(t => t.dueDate === "pending");

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

    // If user doesn't set a date, treat as pending
    const payload = { ...form, dueDate: form.dueDate ? form.dueDate : "pending" };

    if (editing) updateTask(editing.id, payload);
    else addTask(payload);

    setOpenForm(false);
  };

  const renderTaskRow = (t) => (
    <tr key={t.id}>
      <td>
        <b>{t.name}</b>
        <div className="card-sub">{t.description}</div>
      </td>
      <td>{t.location}</td>
      <td>{t.dueDate === "pending" ? <span className="pill warn">Pending</span> : t.dueDate}</td>
      <td>{t.assignedWorker} <div className="card-sub">{t.role}</div></td>
      <td><span className="pill">{t.status}</span></td>
      <td>
        <div className="row">
          <button className="btn ghost small" onClick={() => startEdit(t)}>Edit</button>
          <button className="btn danger small" onClick={() => setConfirm(t.id)}>Delete</button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <h2 style={{ margin: "0 0 6px 0" }}>Tasks</h2>
          <div className="card-sub">Expandable lists: Today’s & Pending • Search + Sort • CRUD</div>
        </div>
        <button className="btn primary" onClick={startAdd}>+ New Task</button>
      </div>

      <div className="hr" />

      <div className="row">
        <input
          className="input"
          placeholder="Search by task name or location..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="new">Due date: New → Old</option>
          <option value="old">Due date: Old → New</option>
        </select>
      </div>

      <div className="hr" />

      <div style={{ display: "grid", gap: 14 }}>
        <ExpandSection title="Today's Tasks" count={todays.length} defaultOpen={data.tasksView === "today"}>
          <table className="table">
            <thead>
              <tr>
                <th>Task</th><th>Location</th><th>Due</th><th>Assigned</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {todays.map(renderTaskRow)}
              {todays.length === 0 ? (
                <tr><td colSpan={6} className="card-sub" style={{ padding: 14 }}>No tasks for today.</td></tr>
              ) : null}
            </tbody>
          </table>
        </ExpandSection>

        <ExpandSection title="Pending Tasks" count={pending.length} defaultOpen={data.tasksView === "pending"}>
          <table className="table">
            <thead>
              <tr>
                <th>Task</th><th>Location</th><th>Due</th><th>Assigned</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.map(renderTaskRow)}
              {pending.length === 0 ? (
                <tr><td colSpan={6} className="card-sub" style={{ padding: 14 }}>No pending tasks.</td></tr>
              ) : null}
            </tbody>
          </table>
        </ExpandSection>
      </div>

      {openForm ? (
        <UploadModal title={editing ? "Edit Task" : "New Task"} onClose={() => setOpenForm(false)}>
          <div className="row">
            <input className="input" placeholder="Task name"
              value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
            <input className="input" placeholder="Location"
              value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} />
          </div>

          <div style={{ marginTop: 10 }}>
            <textarea className="textarea" placeholder="Description"
              value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>

          <div className="row" style={{ marginTop: 10 }}>
            <input className="input" type="date"
              value={form.dueDate} onChange={(e) => setForm(f => ({ ...f, dueDate: e.target.value }))} />
            <select className="select" value={form.status}
              onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}>
              {TASK_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="row" style={{ marginTop: 10 }}>
            <input className="input" placeholder="Assigned worker"
              value={form.assignedWorker} onChange={(e) => setForm(f => ({ ...f, assignedWorker: e.target.value }))} />
            <input className="input" placeholder="Role"
              value={form.role} onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))} />
          </div>

          <div className="row" style={{ justifyContent: "flex-end", marginTop: 10 }}>
            <button className="btn ghost" onClick={() => setOpenForm(false)}>Cancel</button>
            <button className="btn primary" onClick={save}>Save</button>
          </div>

          <div className="card-sub" style={{ marginTop: 8 }}>
            Leave due date empty to make it a <b>Pending Task</b>.
          </div>
        </UploadModal>
      ) : null}

      {confirm ? (
        <ConfirmDialog
          message="Are you sure you want to delete this task?"
          onNo={() => setConfirm(null)}
          onYes={() => { deleteTask(confirm); setConfirm(null); }}
        />
      ) : null}
    </div>
  );
}
