import { useMemo, useState } from "react";
import { useStore } from "../components/store/AppStore.jsx";
import UploadModal from "../components/modals/UploadModal.jsx";
import ConfirmDialog from "../components/modals/ConfirmDialog.jsx";

function emptyForm() {
  return { title: "", location: "", date: "", time: "" };
}

function toISO(date, time) {
  // date: YYYY-MM-DD, time: HH:MM
  return `${date}T${time}`;
}

function splitISO(dateTime) {
  const [d, t] = String(dateTime || "").split("T");
  return { date: d || "", time: (t || "").slice(0, 5) };
}

export default function StaffAppointments() {
  const { data, addAppointment, updateAppointment, deleteAppointment } = useStore();

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null); // appointment object
  const [form, setForm] = useState(emptyForm());
  const [confirm, setConfirm] = useState(null); // id to delete

  // sort appointments by date (earliest first)
  const appointments = useMemo(() => {
    return [...(data.appointments || [])].sort(
      (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
    );
  }, [data.appointments]);

  const startAdd = () => {
    setEditing(null);
    setForm(emptyForm());
    setOpenForm(true);
  };

  const startEdit = (a) => {
    setEditing(a);
    const { date, time } = splitISO(a.dateTime);
    setForm({
      title: a.title || "",
      location: a.location || "",
      date,
      time,
    });
    setOpenForm(true);
  };

  const save = () => {
    if (!form.title.trim()) return alert("Appointment title is required");
    if (!form.location.trim()) return alert("Location is required");
    if (!form.date) return alert("Date is required");
    if (!form.time) return alert("Time is required");

    const payload = {
      title: form.title.trim(),
      location: form.location.trim(),
      dateTime: toISO(form.date, form.time),
    };

    if (editing) updateAppointment(editing.id, payload);
    else addAppointment(payload);

    setOpenForm(false);
  };

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: "0 0 6px 0" }}>Appointments</h2>
          <p className="card-sub" style={{ margin: 0 }}>
            Upcoming meetings and site visits
          </p>
        </div>

        <button className="btn primary" onClick={startAdd}>
          + New Appointment
        </button>
      </div>

      <div className="hr" />

      {appointments.length === 0 ? (
        <p className="card-sub">No appointments scheduled.</p>
      ) : (
        appointments.map((a) => (
          <div
            key={a.id}
            style={{
              background: "#fff",
              padding: "14px",
              borderRadius: "12px",
              marginBottom: "12px",
              boxShadow: "0 6px 16px rgba(0,0,0,.08)",
              borderLeft: "6px solid #d28b5c",
            }}
          >
            <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h4 style={{ margin: "0 0 6px 0" }}>{a.title}</h4>

                <div style={{ fontSize: "13px", color: "#555" }}>
                  📅 {new Date(a.dateTime).toLocaleString()}
                </div>

                <div style={{ fontSize: "13px", color: "#555" }}>
                  📍 {a.location}
                </div>
              </div>

              <div className="row" style={{ gap: 8 }}>
                <button className="btn ghost small" onClick={() => startEdit(a)}>
                  Edit
                </button>
                <button className="btn danger small" onClick={() => setConfirm(a.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Add/Edit Modal */}
      {openForm && (
        <UploadModal
          title={editing ? "Edit Appointment" : "New Appointment"}
          onClose={() => setOpenForm(false)}
        >
          <div style={{ display: "grid", gap: 10 }}>
            <input
              className="input"
              placeholder="Appointment title (e.g., Client Meeting)"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />

            <input
              className="input"
              placeholder="Location (e.g., Conference Room A)"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            />

            <div className="row">
              <input
                className="input"
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
              <input
                className="input"
                type="time"
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              />
            </div>

            <div className="row" style={{ justifyContent: "flex-end", gap: 10 }}>
              <button className="btn ghost" onClick={() => setOpenForm(false)}>
                Cancel
              </button>
              <button className="btn primary" onClick={save}>
                Save
              </button>
            </div>
          </div>
        </UploadModal>
      )}

      {/* Confirm Delete */}
      {confirm && (
        <ConfirmDialog
          message="Are you sure you want to delete this appointment?"
          onNo={() => setConfirm(null)}
          onYes={() => {
            deleteAppointment(confirm);
            setConfirm(null);
          }}
        />
      )}
    </div>
  );
}
