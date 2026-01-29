import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "../../components/store/AppStore.jsx";
import UploadModal from "../../components/modals/UploadModal.jsx";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "project", label: "Projects" },
  { key: "customer", label: "Customers" },
  { key: "admin", label: "Admin" },
];

function timeLabel(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function toISO(date, time) {
  return `${date}T${time}`;
}

function avatarBg(kind) {
  if (kind === "project") return "bg-[#b56c3f]";
  if (kind === "customer") return "bg-[#2e9c5b]";
  return "bg-[#9a6b4a]";
}

export default function Messages() {
  const {
    data,
    sendMessage,
    markConversationRead,
    addAppointment,
  } = useStore();

  const [params] = useSearchParams();

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [activeId, setActiveId] = useState(
    data.conversations?.[0]?.id || null
  );
  const [text, setText] = useState("");

  const [openAppt, setOpenAppt] = useState(false);
  const [appt, setAppt] = useState({
    title: "",
    location: "",
    date: "",
    time: "",
  });

  // open conversation from URL ?c=
  useEffect(() => {
    const cid = params.get("c");
    if (cid != null) {
      const num = Number(cid);
      setActiveId(Number.isNaN(num) ? cid : num);
    }
  }, [params]);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let arr = [...(data.conversations || [])];

    if (filter !== "all") arr = arr.filter((c) => c.kind === filter);
    if (needle) {
      arr = arr.filter((c) =>
        (c.title || "").toLowerCase().includes(needle)
      );
    }

    arr.sort(
      (a, b) =>
        new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0)
    );
    return arr;
  }, [data.conversations, q, filter]);

  const active = useMemo(
    () => (data.conversations || []).find((c) => c.id === activeId) || null,
    [data.conversations, activeId]
  );

  const msgs = useMemo(() => {
    return (data.chatMessages || [])
      .filter((m) => m.conversationId === activeId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [data.chatMessages, activeId]);

  const scrollerRef = useRef(null);

  useEffect(() => {
    if (activeId != null) markConversationRead(activeId);
  }, [activeId, markConversationRead]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs.length, activeId]);

  const onSend = () => {
    const t = text.trim();
    if (!t || !activeId) return;
    sendMessage(activeId, t);
    setText("");
  };

  const saveAppointment = () => {
    if (!activeId) return;

    if (!appt.title.trim()) return alert("Appointment title is required");
    if (!appt.location.trim()) return alert("Location is required");
    if (!appt.date) return alert("Date is required");
    if (!appt.time) return alert("Time is required");

    addAppointment({
      title: appt.title.trim(),
      location: appt.location.trim(),
      dateTime: toISO(appt.date, appt.time),
    });

    setOpenAppt(false);
    setAppt({ title: "", location: "", date: "", time: "" });
  };

  return (
    <div className="grid min-h-[70vh] gap-3 md:grid-cols-[360px_1fr]">
      {/* LEFT */}
      <aside className="bg-white border border-[#eee] rounded-[14px] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-[#eee]">
          <h3 className="font-bold mb-2">Messages</h3>

          <div className="flex items-center gap-2 bg-[#f6f6f6] border border-[#e6e6e6] rounded-[10px] px-3 py-2">
            <span>⌕</span>
            <input
              className="bg-transparent outline-none w-full"
              placeholder="Search conversations..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="flex gap-2 mt-3 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1 rounded-full border text-sm ${
                  filter === f.key
                    ? "bg-[#b56c3f] text-white border-[#b56c3f]"
                    : "bg-white border-[#e6e6e6]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-2">
          {list.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`w-full flex gap-3 items-center p-2 rounded-[12px] text-left ${
                c.id === activeId
                  ? "bg-[#fff8f3] border border-[#e7d6cb]"
                  : "hover:bg-[#fafafa]"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${avatarBg(
                  c.kind
                )}`}
              >
                {c.kind === "project" ? "🏗️" : c.kind === "customer" ? "👤" : "🛡️"}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <b className="truncate">{c.title}</b>
                  <span className="text-xs text-gray-400">
                    {timeLabel(c.lastMessageAt)}
                  </span>
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {c.subtitle}
                </div>
              </div>

              {c.unread > 0 && (
                <span className="bg-[#b56c3f] text-white text-xs px-2 rounded-full">
                  {c.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* RIGHT */}
      <section className="bg-white border border-[#eee] rounded-[14px] flex flex-col overflow-hidden">
        {!active ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a conversation
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 p-4 border-b border-[#eee]">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${avatarBg(
                  active.kind
                )}`}
              >
                {active.kind === "project"
                  ? "🏗️"
                  : active.kind === "customer"
                  ? "👤"
                  : "🛡️"}
              </div>

              <div className="flex-1">
                <div className="font-bold">{active.title}</div>
                <div className="text-sm text-gray-500">{active.subtitle}</div>
              </div>

              <button
                onClick={() => setOpenAppt(true)}
                className="border px-3 py-2 rounded-[10px] text-sm"
              >
                + Appointment
              </button>
            </div>

            <div
              ref={scrollerRef}
              className="flex-1 overflow-auto p-4 bg-[#fafafa]"
            >
              {msgs.map((m) => (
                <div
                  key={m.id}
                  className={`flex mb-2 ${
                    m.sender === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-[14px] p-3 text-sm ${
                      m.sender === "me"
                        ? "bg-[#b56c3f] text-white"
                        : "bg-white border"
                    }`}
                  >
                    <div className="text-xs opacity-80 mb-1">
                      {m.senderLabel}
                    </div>
                    {m.text}
                    <div className="text-[10px] opacity-70 text-right mt-1">
                      {timeLabel(m.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 p-3 border-t border-[#eee]">
              <input
                className="flex-1 border rounded-full px-4 py-2"
                placeholder="Type your message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSend()}
              />
              <button
                onClick={onSend}
                className="bg-[#b56c3f] text-white px-4 rounded-full"
              >
                Send
              </button>
            </div>
          </>
        )}
      </section>

      {/* APPOINTMENT MODAL */}
      {openAppt && (
        <UploadModal title="Create Appointment" onClose={() => setOpenAppt(false)}>
          <div className="grid gap-3">
            <input
              className="border rounded px-3 py-2"
              placeholder="Appointment title"
              value={appt.title}
              onChange={(e) => setAppt((a) => ({ ...a, title: e.target.value }))}
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Location"
              value={appt.location}
              onChange={(e) =>
                setAppt((a) => ({ ...a, location: e.target.value }))
              }
            />
            <div className="flex gap-2">
              <input
                type="date"
                className="border rounded px-3 py-2 flex-1"
                value={appt.date}
                onChange={(e) =>
                  setAppt((a) => ({ ...a, date: e.target.value }))
                }
              />
              <input
                type="time"
                className="border rounded px-3 py-2 flex-1"
                value={appt.time}
                onChange={(e) =>
                  setAppt((a) => ({ ...a, time: e.target.value }))
                }
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpenAppt(false)}
                className="border px-3 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveAppointment}
                className="bg-[#4b3f3a] text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </UploadModal>
      )}
    </div>
  );
}
