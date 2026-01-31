import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../components/store/AppStore.jsx";
import UploadModal from "../../components/modals/UploadModal.jsx";
import ConfirmDialog from "../../components/modals/ConfirmDialog.jsx";

function emptyForm() {
  return {
    title: "",
    location: "",
    date: "",
    time: "",
    conversationId: null,
  };
}

function toISO(date, time) {
  return `${date}T${time}`;
}

function splitISO(dateTime) {
  const [d, t] = String(dateTime || "").split("T");
  return { date: d || "", time: (t || "").slice(0, 5) };
}

export default function StaffAppointments() {
  const {
    data,
    addAppointment,
    updateAppointment,
    deleteAppointment,
  } = useStore();

  const navigate = useNavigate();

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [confirm, setConfirm] = useState(null);

  // ✅ Sort appointments by date (earliest first)
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
      conversationId: a.conversationId || null,
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
      conversationId: form.conversationId || null,
    };

    if (editing) {
      updateAppointment(editing.id, payload);
    } else {
      addAppointment(payload);
    }

    setOpenForm(false);
  };

  return (
    <div className="bg-white rounded-[14px] shadow-[0_10px_22px_rgba(0,0,0,.10)] p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="m-0 text-[22px] font-extrabold">Appointments</h2>
          <p className="text-[#6f6f6f] text-[13px] mt-1 mb-0">
            Upcoming meetings and site visits
          </p>
        </div>

        <button
          className="border-0 cursor-pointer font-bold rounded-[10px] px-3 py-2 bg-[#4b3f3a] text-white"
          onClick={startAdd}
          type="button"
        >
          + New Appointment
        </button>
      </div>

      <div className="h-px bg-[#eee] my-3" />

      {/* List */}
      {appointments.length === 0 ? (
        <p className="text-[#6f6f6f] text-[13px]">
          No appointments scheduled.
        </p>
      ) : (
        <div className="space-y-3">
          {appointments.map((a) => (
            <div
              key={a.id}
              className="bg-white p-[14px] rounded-[12px]
                         shadow-[0_6px_16px_rgba(0,0,0,.08)]
                         border-l-[6px] border-l-[#d28b5c]"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h4 className="m-0 mb-1 font-extrabold">{a.title}</h4>

                  <div className="text-[13px] text-[#555]">
                    📅 {new Date(a.dateTime).toLocaleString()}
                  </div>

                  <div className="text-[13px] text-[#555]">
                    📍 {a.location}
                  </div>

                  {a.conversationId && (
                    <div className="text-[12px] text-[#777] mt-2">
                      💬 Linked chat: #{a.conversationId}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap items-center justify-end">
                  {a.conversationId && (
                    <button
                      className="cursor-pointer font-bold rounded-[10px]
                                 border border-[#ddd] bg-transparent
                                 px-[10px] py-2 text-[13px]"
                      onClick={() =>
                        navigate(`/messages?c=${a.conversationId}`)
                      }
                      type="button"
                    >
                      Open Chat
                    </button>
                  )}

                  <button
                    className="cursor-pointer font-bold rounded-[10px]
                               border border-[#ddd] bg-transparent
                               px-[10px] py-2 text-[13px]"
                    onClick={() => startEdit(a)}
                    type="button"
                  >
                    Edit
                  </button>

                  <button
                    className="cursor-pointer font-bold rounded-[10px]
                               bg-[#c0392b] text-white
                               px-[10px] py-2 text-[13px]"
                    onClick={() => setConfirm(a.id)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {openForm && (
        <UploadModal
          title={editing ? "Edit Appointment" : "New Appointment"}
          onClose={() => setOpenForm(false)}
        >
          <div className="grid gap-[10px]">
            <input
              className="px-3 py-2 rounded-[10px] border border-[#ddd]"
              placeholder="Appointment title"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />

            <input
              className="px-3 py-2 rounded-[10px] border border-[#ddd]"
              placeholder="Location"
              value={form.location}
              onChange={(e) =>
                setForm((f) => ({ ...f, location: e.target.value }))
              }
            />

            <div className="flex gap-2">
              <input
                type="date"
                className="flex-1 px-3 py-2 rounded-[10px] border border-[#ddd]"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
              />
              <input
                type="time"
                className="flex-1 px-3 py-2 rounded-[10px] border border-[#ddd]"
                value={form.time}
                onChange={(e) =>
                  setForm((f) => ({ ...f, time: e.target.value }))
                }
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpenForm(false)}
                className="border px-4 py-2 rounded font-bold"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="bg-[#4b3f3a] text-white px-4 py-2 rounded font-bold"
                type="button"
              >
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
