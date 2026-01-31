import { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "cpms_staff_messages_v1";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "project", label: "Projects" },
  { key: "customer", label: "Customers" },
  { key: "admin", label: "Admin" },
];

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function timeLabel(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const now = new Date().toISOString();
  return {
    conversations: [
      { id: "c1", kind: "project", title: "Project #1 - Colombo Site", subtitle: "Client updates & site notes", lastMessageAt: now, unread: 2 },
      { id: "c2", kind: "customer", title: "Customer - John", subtitle: "Payment & appointment discussion", lastMessageAt: now, unread: 0 },
      { id: "c3", kind: "admin", title: "Admin Desk", subtitle: "Approvals & internal notices", lastMessageAt: now, unread: 1 },
    ],
    messages: [
      { id: uid(), conversationId: "c1", sender: "other", senderLabel: "Customer", text: "Hi, any update on the materials delivery?", createdAt: now },
      { id: uid(), conversationId: "c1", sender: "other", senderLabel: "Customer", text: "Also, can we schedule a meeting tomorrow?", createdAt: now },
      { id: uid(), conversationId: "c3", sender: "other", senderLabel: "Admin", text: "Please update today’s progress before 6 PM.", createdAt: now },
    ],
  };
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function KindBadge({ kind }) {
  const map = { project: "bg-orange-100 text-orange-700", customer: "bg-emerald-100 text-emerald-700", admin: "bg-indigo-100 text-indigo-700" };
  const label = kind === "project" ? "Project" : kind === "customer" ? "Customer" : "Admin";
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${map[kind] || "bg-gray-100 text-gray-700"}`}>{label}</span>;
}

export default function Messages() {
  const role = localStorage.getItem("role") || "staff";

  const [state, setState] = useState(() => loadState());
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [activeId, setActiveId] = useState(() => state.conversations?.[0]?.id || null);
  const [text, setText] = useState("");

  const scrollerRef = useRef(null);

  useEffect(() => saveState(state), [state]);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let arr = [...(state.conversations || [])];
    if (filter !== "all") arr = arr.filter((c) => c.kind === filter);
    if (needle) arr = arr.filter((c) => (c.title || "").toLowerCase().includes(needle));
    arr.sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0));
    return arr;
  }, [state.conversations, q, filter]);

  const active = useMemo(() => state.conversations.find((c) => c.id === activeId) || null, [state.conversations, activeId]);

  const msgs = useMemo(() => {
    return (state.messages || [])
      .filter((m) => m.conversationId === activeId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [state.messages, activeId]);

  useEffect(() => {
    if (!activeId) return;
    setState((prev) => ({
      ...prev,
      conversations: prev.conversations.map((c) => (c.id === activeId ? { ...c, unread: 0 } : c)),
    }));
  }, [activeId]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [msgs.length, activeId]);

  const onSend = () => {
    const t = text.trim();
    if (!t || !activeId) return;
    const now = new Date().toISOString();
    const newMsg = { id: uid(), conversationId: activeId, sender: "me", senderLabel: role === "admin" ? "Admin" : "Staff", text: t, createdAt: now };
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
      conversations: prev.conversations.map((c) =>
        c.id === activeId ? { ...c, lastMessageAt: now, subtitle: t } : c
      ),
    }));
    setText("");
  };

  return (
    <div className="p-6">
      <div className="grid min-h-[75vh] grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 lg:grid-cols-12">
        {/* LEFT Sidebar */}
        <aside className="border-b p-4 lg:col-span-4 lg:border-b-0 lg:border-r">
          <h3 className="text-lg font-semibold text-gray-900">Messages</h3>

          <div className="mt-4">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
              <span className="text-gray-400">⌕</span>
              <input
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Search conversations..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold ${filter === f.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 max-h-[62vh] overflow-y-auto pr-1">
            {list.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveId(c.id)}
                className={`w-full rounded-xl border p-3 text-left transition ${c.id === activeId ? "border-blue-200 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-gray-100 text-lg">
                    {c.kind === "project" ? "🏗️" : c.kind === "customer" ? "👤" : "🛡️"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-sm font-semibold text-gray-900">{c.title}</div>
                      <div className="shrink-0 text-xs text-gray-500">{timeLabel(c.lastMessageAt)}</div>
                    </div>
                    <div className="mt-1 truncate text-xs text-gray-500">{c.subtitle}</div>
                  </div>
                  {c.unread > 0 && <div className="grid h-6 min-w-6 place-items-center rounded-full bg-red-600 px-2 text-xs font-bold text-white">{c.unread}</div>}
                </div>
              </button>
            ))}

            {list.length === 0 && <div className="mt-6 text-center text-sm text-gray-500">No conversations found.</div>}
          </div>
        </aside>

        {/* RIGHT Content */}
        <section className="flex flex-col lg:col-span-8">
          {!active ? (
            <div className="grid flex-1 place-items-center p-10 text-sm text-gray-500">Select a conversation</div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3 border-b p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-gray-100 text-lg">
                    {active.kind === "project" ? "🏗️" : active.kind === "customer" ? "👤" : "🛡️"}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-gray-900">{active.title}</div>
                    <div className="truncate text-xs text-gray-500">{active.subtitle}</div>
                  </div>
                </div>
                <KindBadge kind={active.kind} />
              </div>

              <div ref={scrollerRef} className="flex-1 overflow-y-auto bg-gray-50 p-4">
                {msgs.map((m) => (
                  <div key={m.id} className={`mb-3 flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${m.sender === "me" ? "bg-blue-600 text-white" : "bg-white text-gray-900 ring-1 ring-gray-200"}`}>
                      <div className="text-xs font-semibold opacity-80">{m.senderLabel}</div>
                      <div className="mt-1 text-sm">{m.text}</div>
                      <div className="mt-2 text-[11px] opacity-70">{timeLabel(m.createdAt)}</div>
                    </div>
                  </div>
                ))}

                {msgs.length === 0 && <div className="grid place-items-center py-12 text-sm text-gray-500">No messages yet. Say hi 👋</div>}
              </div>

              <div className="border-t p-4">
                <div className="flex gap-2">
                  <input
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    placeholder="Type your message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") onSend(); }}
                  />
                  <button
                    className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                    onClick={onSend}
                    type="button"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
