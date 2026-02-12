import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "cpms_staff_appointments_v1";

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function emptyForm() {
  return { title: "", location: "", date: "", time: "" };
}

function toISO(date, time) {
  return `${date}T${time}`;
}

function splitISO(dateTime) {
  const [d, t] = String(dateTime || "").split("T");
  return { date: d || "", time: (t || "").slice(0, 5) };
}

function Modal({ title, children, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-sm font-semibold text-gray-600 hover:bg-gray-100"
            type="button"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function ConfirmDialog({ message, onNo, onYes }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="px-6 py-5">
          <h3 className="text-base font-bold text-gray-900">Confirm</h3>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
          <div className="mt-5 flex justify-end gap-2">
            <button
              onClick={onNo}
              className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200"
              type="button"
            >
              No
            </button>
            <button
              onClick={onYes}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              type="button"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StaffAppointments() {
  const [appointments, setAppointments] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  }, [appointments]);

  const sorted = useMemo(() => {
    return [...appointments].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
  }, [appointments]);

  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [confirmId, setConfirmId] = useState(null);

  const startAdd = () => {
    setEditingId(null);
    setForm(emptyForm());
    setOpenForm(true);
  };

  const startEdit = (a) => {
    setEditingId(a.id);
    const { date, time } = splitISO(a.dateTime);
    setForm({ title: a.title || "", location: a.location || "", date, time });
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

    if (editingId) {
      setAppointments((prev) => prev.map((x) => (x.id === editingId ? { ...x, ...payload } : x)));
    } else {
      setAppointments((prev) => [{ id: uid(), ...payload }, ...prev]);
    }

    setOpenForm(false);
  };

  const doDelete = (id) => {
    setAppointments((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <div className="flex-1 p-6 min-h-screen">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Appointments</h2>
            <p className="mt-1 text-sm text-gray-500">Upcoming meetings and site visits</p>
          </div>

          <button
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            onClick={startAdd}
            type="button"
          >
            + New Appointment
          </button>
        </div>

        <div className="mt-5 grid gap-3">
          {sorted.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500">
              No appointments scheduled. Click <b>+ New Appointment</b> to add one.
            </div>
          ) : (
            sorted.map((a) => (
              <div
                key={a.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:bg-gray-50"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h4 className="text-base font-semibold text-gray-900">{a.title}</h4>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <div>📅 {new Date(a.dateTime).toLocaleString()}</div>
                      <div>📍 {a.location}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-200"
                      onClick={() => startEdit(a)}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                      onClick={() => setConfirmId(a.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {openForm && (
        <Modal title={editingId ? "Edit Appointment" : "New Appointment"} onClose={() => setOpenForm(false)}>
          <div className="grid gap-3">
            <input
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="Appointment title (e.g., Client Meeting)"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
            <input
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="Location (e.g., Site A)"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            />
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
              <input
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                type="time"
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              />
            </div>

            <div className="mt-2 flex justify-end gap-2">
              <button
                className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200"
                onClick={() => setOpenForm(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                onClick={save}
                type="button"
              >
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}

      {confirmId && (
        <ConfirmDialog
          message="Are you sure you want to delete this appointment?"
          onNo={() => setConfirmId(null)}
          onYes={() => {
            doDelete(confirmId);
            setConfirmId(null);
          }}
        />
      )}
    </div>
  );
}
