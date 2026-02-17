// src/pages/staff/Messages.jsx
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import axios from "axios";
import SockJS from "sockjs-client/dist/sockjs";
import { Client as StompClient } from "@stomp/stompjs";

// =================== CONFIG ===================
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// keep same as backend multipart limit

const MAX_FILE_MB = 20;
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

const api = axios.create({ baseURL: BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ENDPOINTS = {
  companyProjects: "/api/chat/company/projects",
  projectMessages: (projectId) => `/api/chat/project/${projectId}`,
  send: "/api/chat/send",
  uploadChatFile: (projectId) => `/api/files/upload/chat/${projectId}`,
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "project", label: "Projects" },
];

// =================== HELPERS ===================
function timeLabel(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getEmailFromJwt() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return "";
    const payload = token.split(".")[1];
    if (!payload) return "";
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return json.email || json.sub || json.username || "";
  } catch {
    return "";
  }
}

function getNameFromJwt() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return "";
    const payload = token.split(".")[1];
    if (!payload) return "";
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return json.name || json.fullName || json.username || "";
  } catch {
    return "";
  }
}

function getMyName() {
  return (
    localStorage.getItem("name") ||
    localStorage.getItem("username") ||
    getNameFromJwt() ||
    getEmailFromJwt() ||
    "Staff"
  );
}

function uid() {
  try {
    if (crypto?.randomUUID) return crypto.randomUUID();
  } catch (_) {}
  return `m_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function isImageMime(mime) {
  return String(mime || "").startsWith("image/");
}

function fileUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
}

function extractAxiosError(e) {
  if (!e?.response) return "Network error. Check backend is running + CORS + proxy.";
  const status = e.response.status;
  if (status === 413) return `File too large. Backend rejected (413). Max ${MAX_FILE_MB}MB.`;
  if (status === 415) return "Unsupported file type (415).";
  if (status === 401) return "Unauthorized (401). Login again.";
  if (status === 403) return "Forbidden (403). Check role / security / CORS.";
  return e.response.data?.message || `Request failed (${status}).`;
}

// =================== NOTIFICATION UI ===================
function NotificationBell({ items, onClear }) {
  const [open, setOpen] = useState(false);
  const unread = items.filter((n) => !n.read).length;

  const wrapRef = useRef(null);
  useEffect(() => {
    function onDoc(e) {
      if (!open) return;
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex items-center justify-center rounded-xl bg-white/5 px-3 py-2 text-sm font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/20 transition"
        title="Notifications"
      >
        🔔
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-gradient-to-r from-rose-500 to-red-600 text-[11px] font-extrabold text-white shadow-lg">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-[360px] max-w-[92vw] rounded-2xl border border-white/10 bg-[#071022]/95 p-3 shadow-2xl shadow-black/50 ring-1 ring-white/10 z-50">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-white">Notifications</div>
            <div className="flex items-center gap-2">
              <button onClick={onClear} type="button" className="text-xs text-white/60 hover:text-white">
                Clear
              </button>
              <button onClick={() => setOpen(false)} type="button" className="text-xs text-white/60 hover:text-white">
                Close
              </button>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="mt-3 text-xs text-white/60">No notifications</div>
          ) : (
            <div className="mt-3 max-h-72 overflow-y-auto space-y-2 pr-1">
              {items.slice(0, 10).map((n) => (
                <div key={n.id || `${n.title}-${n.createdAt}`} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                  <div className="text-xs font-bold text-white">{n.title}</div>
                  <div className="text-xs text-white/70 mt-1 break-words">{n.message}</div>
                  <div className="text-[11px] text-white/40 mt-2">{n.createdAt ? timeLabel(n.createdAt) : ""}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// =================== COMPONENT ===================
export default function Messages() {
  const myLabel = getMyName();
  const myEmail = getEmailFromJwt();

  const [loadingList, setLoadingList] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);

  const [activeId, setActiveId] = useState(null);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");

  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [topError, setTopError] = useState("");

  const scrollerRef = useRef(null);
  const fileInputRef = useRef(null);

  const stompRef = useRef(null);
  const topicSubRef = useRef(null);
  const notifSubRef = useRef(null);

  const fetchConversations = useCallback(async () => {
    setLoadingList(true);
    setTopError("");
    try {
      const res = await api.get(ENDPOINTS.companyProjects);
      const arr = Array.isArray(res.data) ? res.data : res.data?.data || [];

      const mapped = arr.map((p) => ({
        id: p.projectId,
        kind: "project",
        title: p.projectTitle || `Project #${p.projectId}`,
        subtitle: `${p.customerName || "Customer"} • ${p.customerEmail || ""}`,
        lastMessageAt: null,
        unread: 0,
      }));

      setConversations(mapped);
      setActiveId((prev) => prev ?? (mapped[0]?.id ?? null));
    } catch (e) {
      setConversations([]);
      setTopError(extractAxiosError(e));
    } finally {
      setLoadingList(false);
    }
  }, []);

  const fetchMessages = useCallback(
    async (projectId) => {
      if (!projectId) return;
      setLoadingMsgs(true);
      setTopError("");
      try {
        const res = await api.get(ENDPOINTS.projectMessages(projectId));
        const arr = Array.isArray(res.data) ? res.data : res.data?.data || [];

        const mapped = arr.map((m) => ({
          id: m.messageId,
          text: m.content || "",
          createdAt: m.timestamp,
          senderLabel: m.senderName,
          senderEmail: m.senderEmail,
          mine: !!myEmail && String(m.senderEmail || "").toLowerCase() === String(myEmail).toLowerCase(),
          attachments: m.fileUrl
            ? [
                {
                  type: isImageMime(m.fileType) ? "image" : "file",
                  url: fileUrl(m.fileUrl),
                  name: m.fileName || "file",
                },
              ]
            : [],
          clientMessageId: m.clientMessageId,
        }));

        setMessages(mapped);
      } catch (e) {
        setMessages([]);
        setTopError(extractAxiosError(e));
      } finally {
        setLoadingMsgs(false);
      }
    },
    [myEmail]
  );

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (!activeId) return;
    fetchMessages(activeId);
  }, [activeId, fetchMessages]);

  // scroll stick
  const shouldStickToBottomRef = useRef(true);
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
      shouldStickToBottomRef.current = nearBottom;
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    if (shouldStickToBottomRef.current) el.scrollTop = el.scrollHeight;
  }, [messages.length, activeId]);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let arr = [...conversations];
    if (filter !== "all") arr = arr.filter((c) => c.kind === filter);
    if (needle) arr = arr.filter((c) => (c.title || "").toLowerCase().includes(needle));
    return arr;
  }, [conversations, q, filter]);

  const active = useMemo(() => conversations.find((c) => c.id === activeId) || null, [conversations, activeId]);

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_BYTES) {
      setTopError(`Maximum upload size exceeded. Max allowed is ${MAX_FILE_MB}MB.`);
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => setFilePreview(event.target.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  }

  function clearFile() {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ✅ subscribe helper (FIX)
  const subscribeToActiveTopic = useCallback(
    (client, projectId) => {
      if (!client || !client.connected) return;
      if (!projectId) return;

      // unsubscribe previous topic
      try {
        topicSubRef.current?.unsubscribe?.();
      } catch (_) {}

      topicSubRef.current = client.subscribe(`/topic/project/${projectId}`, (frame) => {
        try {
          const m = JSON.parse(frame.body);
          const mapped = {
            id: m.messageId,
            text: m.content || "",
            createdAt: m.timestamp,
            senderLabel: m.senderName,
            senderEmail: m.senderEmail,
            mine: !!myEmail && String(m.senderEmail || "").toLowerCase() === String(myEmail).toLowerCase(),
            attachments: m.fileUrl
              ? [
                  {
                    type: isImageMime(m.fileType) ? "image" : "file",
                    url: fileUrl(m.fileUrl),
                    name: m.fileName || "file",
                  },
                ]
              : [],
            clientMessageId: m.clientMessageId,
          };

          setMessages((prev) => {
            if (prev.some((x) => x.id === mapped.id)) return prev;
            if (mapped.clientMessageId && prev.some((x) => x.clientMessageId === mapped.clientMessageId)) {
              return prev.map((x) => (x.clientMessageId === mapped.clientMessageId ? mapped : x));
            }
            return [...prev, mapped];
          });
        } catch {}
      });
    },
    [myEmail]
  );

  const connectWs = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // ✅ if already connected: just resubscribe to topic (FIX)
    if (stompRef.current?.connected) {
      subscribeToActiveTopic(stompRef.current, activeId);
      return;
    }

    const sock = new SockJS(`${BASE_URL}/ws`);
    const client = new StompClient({
      webSocketFactory: () => sock,
      debug: () => {},
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 3000,

      onConnect: () => {
        // notifications (always)
        try {
          notifSubRef.current?.unsubscribe?.();
        } catch (_) {}
        notifSubRef.current = client.subscribe("/user/queue/notifications", (frame) => {
          try {
            const n = JSON.parse(frame.body);
            setNotifications((prev) => [
              { id: n.id, title: n.title, message: n.message, createdAt: n.createdAt, read: false },
              ...prev,
            ]);
          } catch {}
        });

        // ✅ subscribe for current active project (FIX)
        subscribeToActiveTopic(client, activeId);
      },

      onStompError: () => setTopError("WebSocket error. Check backend STOMP + security for /ws/**."),
    });

    client.activate();
    stompRef.current = client;
  }, [activeId, subscribeToActiveTopic]);

  // connect once + cleanup
  useEffect(() => {
    connectWs();
    return () => {
      try {
        topicSubRef.current?.unsubscribe?.();
      } catch (_) {}
      try {
        notifSubRef.current?.unsubscribe?.();
      } catch (_) {}
      try {
        stompRef.current?.deactivate?.();
      } catch (_) {}
    };
  }, [connectWs]);

  // ✅ when activeId changes, re-subscribe immediately (FIX)
  useEffect(() => {
    if (!activeId) return;
    if (!stompRef.current?.connected) return;
    subscribeToActiveTopic(stompRef.current, activeId);
  }, [activeId, subscribeToActiveTopic]);

  async function onSend() {
    setTopError("");
    const t = text.trim();
    const hasFile = !!selectedFile;

    if (!activeId || sending) return;
    if (!t && !hasFile) return;

    setSending(true);

    const nowIso = new Date().toISOString();
    const tempClientId = uid();

    const optimistic = {
      id: `temp-${tempClientId}`,
      clientMessageId: tempClientId,
      text: t,
      createdAt: nowIso,
      senderLabel: myLabel,
      senderEmail: myEmail,
      mine: true,
      attachments: hasFile
        ? [{ type: selectedFile.type.startsWith("image/") ? "image" : "file", url: filePreview || "", name: selectedFile.name }]
        : [],
    };

    setMessages((prev) => [...prev, optimistic]);
    setText("");

    try {
      let fileId = null;

      if (hasFile) {
        const fd = new FormData();
        fd.append("file", selectedFile);

        const up = await api.post(ENDPOINTS.uploadChatFile(activeId), fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const savedFile = up?.data?.data ?? up?.data;
        fileId = savedFile?.id;

        if (savedFile?.fileUrl) {
          setMessages((prev) =>
            prev.map((m) =>
              m.clientMessageId === tempClientId
                ? {
                    ...m,
                    attachments: [
                      {
                        type: isImageMime(savedFile.fileType) ? "image" : "file",
                        url: fileUrl(savedFile.fileUrl),
                        name: savedFile.fileName || selectedFile.name,
                      },
                    ],
                  }
                : m
            )
          );
        }
      }

      await api.post(ENDPOINTS.send, {
        projectId: activeId,
        content: t,
        clientMessageId: tempClientId,
        fileId,
      });

      clearFile();
      await fetchMessages(activeId);
      await fetchConversations();
    } catch (e) {
      const msg = extractAxiosError(e);
      setMessages((prev) => prev.filter((m) => m.clientMessageId !== tempClientId));
      setText(t);
      setTopError(msg);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="relative min-h-[100dvh] w-full text-white bg-slate-950">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[1100px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 h-[500px] w-[950px] rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      <div className="relative h-[100dvh] w-full">
        <div className="grid h-[100dvh] min-h-0 overflow-hidden rounded-none bg-slate-950 ring-0 shadow-none backdrop-blur-xl lg:grid-cols-3">
          <aside className="flex min-h-0 flex-col bg-slate-900/50 border-b border-white/10 lg:col-span-1 lg:border-b-0 lg:border-r">
            <div className="shrink-0 border-b border-white/10 p-4 md:p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-2xl font-bold text-white leading-tight">Messages</h2>
                  <p className="text-xs text-white/60 mt-1">Company ↔ Customers</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <NotificationBell items={notifications} onClear={() => setNotifications([])} />
                  <button
                    type="button"
                    onClick={fetchConversations}
                    className="rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/20 transition"
                    title="Refresh list"
                  >
                    ↻
                  </button>
                </div>
              </div>

              {topError && (
                <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-100">
                  <div className="font-bold">Error</div>
                  <div className="text-rose-100/80 mt-1 break-words">{topError}</div>
                </div>
              )}

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-white/40 text-lg">🔍</span>
                <input
                  className="w-full bg-transparent text-sm text-white placeholder-white/40 outline-none"
                  placeholder="Search projects..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilter(f.key)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      filter === f.key
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                        : "bg-white/5 text-white/70 hover:bg-white/10 ring-1 ring-white/10"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-3 py-4">
              {loadingList ? (
                <div className="text-center py-12 text-white/60">Loading...</div>
              ) : list.length === 0 ? (
                <div className="text-center py-12 text-white/60">No projects found</div>
              ) : (
                <div className="space-y-2">
                  {list.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveId(c.id)}
                      className={`w-full rounded-2xl border p-3 text-left transition ${
                        c.id === activeId
                          ? "border-cyan-500/35 bg-gradient-to-r from-cyan-500/15 to-blue-600/15 ring-1 ring-cyan-500/20"
                          : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 ring-1 ring-orange-500/20 text-xl shrink-0">
                          🏗️
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold text-white">{c.title}</div>
                          <p className="text-xs text-white/60 truncate">{c.subtitle}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>

          <section className="flex min-h-0 flex-col lg:col-span-2">
            <div className="shrink-0 border-b border-white/10 p-4 md:p-5">
              {!active ? (
                <div className="text-center py-2 text-white/60">Select a project</div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold text-white">{active.title}</h3>
                    <p className="truncate text-sm text-white/60">{active.subtitle}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => fetchMessages(activeId)}
                    className="rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/20 transition shrink-0"
                    title="Reload chat"
                  >
                    ↻ Reload
                  </button>
                </div>
              )}
            </div>

            <div ref={scrollerRef} className="flex-1 min-h-0 overflow-y-auto px-4 md:px-6 py-5 space-y-4 bg-slate-950">
              {!active ? (
                <div className="grid h-full place-items-center text-white/60">No active chat</div>
              ) : loadingMsgs ? (
                <div className="grid h-full place-items-center text-white/60">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="grid h-full place-items-center text-white/60">No messages yet.</div>
              ) : (
                <div className="space-y-4">
                  {messages.map((m) => {
                    const mine = !!m.mine;
                    const bubbleSender = m.senderLabel || (mine ? myLabel : "Customer");
                    return (
                      <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                        <div className={`w-full max-w-[720px] ${mine ? "text-right" : "text-left"}`}>
                          <div
                            className={`inline-block max-w-[92%] rounded-2xl px-4 py-3 shadow-lg align-top ${
                              mine
                                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-sm"
                                : "bg-white/5 text-white ring-1 ring-white/10 rounded-bl-sm"
                            }`}
                          >
                            <div className="text-[11px] font-semibold opacity-80 mb-1">{bubbleSender}</div>

                            {!!m.text && <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">{m.text}</div>}

                            {!!m.attachments?.length && (
                              <div className="mt-3 space-y-2">
                                {m.attachments.map((att, idx) => (
                                  <div key={idx}>
                                    {att.type === "image" ? (
                                      <a href={att.url} target="_blank" rel="noreferrer">
                                        <img
                                          src={att.url}
                                          alt={att.name || "attachment"}
                                          className="max-h-[320px] w-full max-w-[420px] rounded-xl object-cover ring-1 ring-white/10"
                                          loading="lazy"
                                        />
                                      </a>
                                    ) : (
                                      <a
                                        href={att.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold text-white/90 ring-1 ring-white/10 hover:bg-white/10 transition"
                                      >
                                        📎 <span className="truncate max-w-[240px]">{att.name}</span>{" "}
                                        <span className="text-white/50">↗</span>
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="mt-2 text-[11px] opacity-60">{timeLabel(m.createdAt)}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="shrink-0 border-t border-white/10 bg-slate-900/50 p-4 md:p-5">
              {selectedFile && (
                <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl bg-white/5 border border-white/10 p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {filePreview ? (
                      <img src={filePreview} alt="preview" className="h-10 w-10 rounded-xl object-cover shrink-0" />
                    ) : (
                      <div className="text-xl shrink-0">📎</div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{selectedFile.name}</p>
                      <p className="text-xs text-white/50">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • max {MAX_FILE_MB}MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={clearFile}
                    className="p-2 hover:bg-white/10 rounded-xl transition shrink-0"
                    type="button"
                    title="Remove file"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="flex gap-3 items-end">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.txt,.xlsx"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-3 text-sm font-semibold text-white/90 transition shrink-0"
                  type="button"
                  disabled={!active || sending}
                  title="Attach"
                >
                  📎
                </button>

                <textarea
                  rows={1}
                  className="flex-1 resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-cyan-500/40 focus:bg-white/10 focus:ring-4 focus:ring-cyan-500/10 transition max-h-32"
                  placeholder={!active ? "Select a project..." : "Type your message..."}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={!active || sending}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      onSend();
                    }
                  }}
                />

                <button
                  className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition shrink-0"
                  onClick={onSend}
                  disabled={!active || sending || (!text.trim() && !selectedFile)}
                  type="button"
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
