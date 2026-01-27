import { useMemo, useState } from "react";
import { useStore } from "../store/AppStore.jsx";
import UploadModal from "../components/modals/UploadModal.jsx";
import ConfirmDialog from "../components/modals/ConfirmDialog.jsx";

const STATUSES = ["Planning", "Design", "Construction", "Finishing", "Handover", "On Hold"];

function emptyForm() {
  return {
    name: "",
    customer: "",
    location: "",
    description: "",
    startDate: "",
    status: "Planning",
  };
}

export default function AssignedProjects() {
  const { data, addProject, updateProject, deleteProject } = useStore();

  const [q, setQ] = useState("");
  const [sort, setSort] = useState("new"); // new or old
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null); // project object or null
  const [form, setForm] = useState(emptyForm());
  const [confirm, setConfirm] = useState(null); // project id to delete

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = [...data.projects];

    if (needle) {
      list = list.filter(p =>
        (p.name || "").toLowerCase().includes(needle) ||
        (p.location || "").toLowerCase().includes(needle)
      );
    }

    list.sort((a, b) => {
      const da = new Date(a.startDate || "1970-01-01").getTime();
      const db = new Date(b.startDate || "1970-01-01").getTime();
      return sort === "new" ? db - da : da - db;
    });

    return list;
  }, [data.projects, q, sort]);

  const startAdd = () => {
    setEditing(null);
    setForm(emptyForm());
    setOpenForm(true);
  };

  const startEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name || "",
      customer: p.customer || "",
      location: p.location || "",
      description: p.description || "",
      startDate: p.startDate || "",
      status: p.status || "Planning",
    });
    setOpenForm(true);
  };

  const save = () => {
    if (!form.name.trim()) return alert("Project name is required");
    if (!form.location.trim()) return alert("Location is required");
    if (!form.startDate) return alert("Starting date is required");

    if (editing) updateProject(editing.id, form);
    else addProject(form);

    setOpenForm(false);
  };

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <h2 style={{ margin: "0 0 6px 0" }}>Projects</h2>
          <div className="card-sub">Search by project name or location • Sort by date</div>
        </div>
        <button className="btn primary" onClick={startAdd}>+ New Project</button>
      </div>

      <div className="hr" />

      <div className="row">
        <input
          className="input"
          placeholder="Search by name or location..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="new">Date: New → Old</option>
          <option value="old">Date: Old → New</option>
        </select>
      </div>

      <div className="hr" />

      <table className="table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Customer</th>
            <th>Location</th>
            <th>Start</th>
            <th>Status</th>
            <th style={{ width: 160 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id}>
              <td>
                <b>{p.name}</b>
                <div className="card-sub">{p.description}</div>
              </td>
              <td>{p.customer}</td>
              <td>{p.location}</td>
              <td>{p.startDate}</td>
              <td>
                <span className="pill">{p.status}</span>
              </td>
              <td>
                <div className="row">
                  <button className="btn ghost small" onClick={() => startEdit(p)}>Edit</button>
                  <button className="btn danger small" onClick={() => setConfirm(p.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={6} className="card-sub" style={{ padding: 14 }}>
                No projects found.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>

      {openForm ? (
        <UploadModal title={editing ? "Edit Project" : "New Project"} onClose={() => setOpenForm(false)}>
          <div className="row">
            <input className="input" placeholder="Project name"
              value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
            <input className="input" placeholder="Customer name"
              value={form.customer} onChange={(e) => setForm(f => ({ ...f, customer: e.target.value }))} />
          </div>

          <div className="row" style={{ marginTop: 10 }}>
            <input className="input" placeholder="Location"
              value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} />
            <input className="input" type="date"
              value={form.startDate} onChange={(e) => setForm(f => ({ ...f, startDate: e.target.value }))} />
          </div>

          <div className="row" style={{ marginTop: 10 }}>
            <select className="select" value={form.status}
              onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ marginTop: 10 }}>
            <textarea className="textarea" placeholder="Description"
              value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>

          <div className="row" style={{ justifyContent: "flex-end", marginTop: 10 }}>
            <button className="btn ghost" onClick={() => setOpenForm(false)}>Cancel</button>
            <button className="btn primary" onClick={save}>Save</button>
          </div>
        </UploadModal>
      ) : null}

      {confirm ? (
        <ConfirmDialog
          message="Are you sure you want to delete this project?"
          onNo={() => setConfirm(null)}
          onYes={() => {
            deleteProject(confirm);
            setConfirm(null);
          }}
        />
      ) : null}
    </div>
  );
}
