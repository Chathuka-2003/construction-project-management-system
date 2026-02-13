// src/pages/customer/Messages.jsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import SockJS from "sockjs-client/dist/sockjs";
import { Client as StompClient } from "@stomp/stompjs";
import {
  Bell,
  Search,
  Paperclip,
  Send,
  Image as ImageIcon,
  FileText,
  Download,
  X,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

import { getCustomerIdFromStorage } from "../../util/auth";
import { getCustomerProjects, getProjectMessages, sendMessage } from "../../api/customerChatApi";
import {
  uploadChatFile,
  downloadWithAuth,
  openInNewTabWithAuth,
  getBlobUrlWithAuth,
  normalizeUrl,
} from "../../api/fileApi";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const MAX_FILE_MB = 20;
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

function uid() {
  try {
    if (crypto?.randomUUID) return crypto.randomUUID();
  } catch (_) {}
  return `m_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function timeLabel(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function isImageName(name = "", url = "") {
  const n = String(name).toLowerCase();
  const u = String(url).toLowerCase();
  const exts = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
  return exts.some((e) => n.endsWith(e) || u.endsWith(e));
}

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Messages() {
  const customerId = useMemo(() => getCustomerIdFromStorage(), []);
  const token = useMemo(() => localStorage.getItem("token"), []);

  const meEmail = useMemo(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      return String(u?.email || "").toLowerCase();
    } catch {
      return "";
    }
  }, []);

  // projects
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [q, setQ] = useState("");
  const [activeId, setActiveId] = useState(null);

  // chat
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [fileToSend, setFileToSend] = useState(null);
  const [uploading, setUploading] = useState(false);

  // unread local (per project)
  const [unreadByProject, setUnreadByProject] = useState({});
  const totalUnread = useMemo(
    () => Object.values(unreadByProject).reduce((a, b) => a + b, 0),
    [unreadByProject]
  );

  // preview modal
  const [previewImg, setPreviewImg] = useState(null); // {url,name}
  const [blobCache, setBlobCache] = useState({}); // fileUrl -> blobUrl

  // ws refs
  const stompRef = useRef(null);
  const subRef = useRef(null);
  const activeIdRef = useRef(activeId);

  // scroll refs
  const scrollerRef = useRef(null);
  const bottomRef = useRef(null);
  const nearBottomRef = useRef(true);

  // jump UI
  const [showJump, setShowJump] = useState(false);
  const [newCount, setNewCount] = useState(0);

  // keep activeId in ref (used inside ws callbacks)
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let arr = [...projects];
    if (needle) {
      arr = arr.filter((p) => {
        const title = String(p.name || p.title || "").toLowerCase();
        const sub = String(p.location || p.description || "").toLowerCase();
        return title.includes(needle) || sub.includes(needle);
      });
    }
    return arr;
  }, [projects, q]);

  const active = useMemo(
    () => projects.find((p) => String(p.id) === String(activeId)) || null,
    [projects, activeId]
  );

  const senderEmailOf = (m) => {
    const email = m?.senderEmail || m?.sender?.email || m?.sender || m?.email || "";
    return String(email).toLowerCase();
  };

  const isMine = useCallback(
    (m) => {
      const se = senderEmailOf(m);
      return !!se && !!meEmail && se === meEmail;
    },
    [meEmail]
  );

  const scrollToBottom = useCallback((smooth = false) => {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  }, []);

  const markProjectRead = useCallback((projectId) => {
    if (!projectId) return;
    setUnreadByProject((prev) => {
      if (!prev[projectId]) return prev;
      const copy = { ...prev };
      delete copy[projectId];
      return copy;
    });
  }, []);

  const onChatScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const threshold = 160;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    nearBottomRef.current = near;

    if (near) {
      setShowJump(false);
      setNewCount(0);
      // if user scrolled to bottom => mark read for active project
      const pid = activeIdRef.current;
      if (pid) markProjectRead(pid);
    } else {
      setShowJump(true);
    }
  }, [markProjectRead]);

  // load projects
  useEffect(() => {
    if (!customerId) {
      toast.error("Customer id not found. Please login again.");
      return;
    }

    const load = async () => {
      setLoadingProjects(true);
      try {
        const data = await getCustomerProjects(customerId);
        const arr = Array.isArray(data) ? data : [];
        setProjects(arr);
        if (arr.length) setActiveId((prev) => prev ?? arr[0].id);
      } catch {
        toast.error("Failed to load projects");
      } finally {
        setLoadingProjects(false);
      }
    };

    load();
  }, [customerId]);

  // load messages for a project
  const loadMessages = useCallback(
    async (projectId) => {
      if (!projectId) return;
      setLoadingMsgs(true);
      try {
        const data = await getProjectMessages(projectId);
        setMessages(Array.isArray(data) ? data : []);
        markProjectRead(projectId);

        requestAnimationFrame(() => {
          scrollToBottom(false);
          setShowJump(false);
          setNewCount(0);
        });
      } catch {
        toast.error("Failed to load messages");
      } finally {
        setLoadingMsgs(false);
      }
    },
    [scrollToBottom, markProjectRead]
  );

  // --- WebSocket connect (one client) ---
  const ensureWsClient = useCallback(() => {
    if (stompRef.current) return stompRef.current;

    const sock = new SockJS(`${BASE_URL}/ws`);
    const client = new StompClient({
      webSocketFactory: () => sock,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 3000,
      debug: () => {},
    });

    stompRef.current = client;
    client.activate();
    return client;
  }, [token]);

  const unsubscribe = useCallback(() => {
    try {
      subRef.current?.unsubscribe?.();
    } catch (_) {}
    subRef.current = null;
  }, []);

  const subscribeToProject = useCallback(
    (projectId) => {
      if (!projectId) return;

      const client = ensureWsClient();

      // wait until connected then subscribe
      const doSub = () => {
        unsubscribe();

        subRef.current = client.subscribe(`/topic/project/${projectId}`, (frame) => {
          try {
            const body = JSON.parse(frame.body);

            // dedupe
            setMessages((prev) => {
              const exists = prev.some(
                (x) =>
                  (x.id && body.id && String(x.id) === String(body.id)) ||
                  (x.clientMessageId &&
                    body.clientMessageId &&
                    x.clientMessageId === body.clientMessageId)
              );
              if (exists) return prev;

              return [...prev, body];
            });

            const mine = isMine(body);
            const activeNow = String(activeIdRef.current) === String(projectId);

            if (activeNow) {
              if (mine || nearBottomRef.current) {
                requestAnimationFrame(() => scrollToBottom(true));
                // if we are at bottom, mark read
                markProjectRead(projectId);
              } else {
                setNewCount((c) => c + 1);
                setShowJump(true);
              }
            } else {
              // message belongs to a different project (rare if backend broadcasts to others)
              setUnreadByProject((prev) => ({
                ...prev,
                [projectId]: (prev[projectId] || 0) + 1,
              }));
            }

            // ✅ Realtime badge update for current project too (when user not at bottom)
            if (!mine && activeNow && !nearBottomRef.current) {
              setUnreadByProject((prev) => ({
                ...prev,
                [projectId]: (prev[projectId] || 0) + 1,
              }));
            }
          } catch (_) {}
        });
      };

      // connected?
      if (client.connected) doSub();
      else {
        const oldOnConnect = client.onConnect;
        client.onConnect = (frame) => {
          try {
            oldOnConnect?.(frame);
          } catch (_) {}
          doSub();
        };
      }
    },
    [ensureWsClient, unsubscribe, isMine, scrollToBottom, markProjectRead]
  );

  // when active project changes: load messages + subscribe
  useEffect(() => {
    if (!activeId) return;

    setMessages([]);
    setText("");
    setFileToSend(null);
    setNewCount(0);
    setShowJump(false);

    loadMessages(activeId);
    subscribeToProject(activeId);

    return () => {
      // keep client alive but unsubscribe from topic
      unsubscribe();
    };
  }, [activeId, loadMessages, subscribeToProject, unsubscribe]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      unsubscribe();
      try {
        stompRef.current?.deactivate?.();
      } catch (_) {}
      stompRef.current = null;

      // revoke blob urls
      Object.values(blobCache).forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {}
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // create blob previews for recent images
  useEffect(() => {
    const run = async () => {
      const last = messages.slice(-6);
      for (const m of last) {
        const fileUrl = normalizeUrl(m?.fileUrl || m?.file?.fileUrl || "");
        const fileName = m?.fileName || m?.file?.fileName || "";
        if (!fileUrl) continue;
        if (!isImageName(fileName, fileUrl)) continue;
        if (blobCache[fileUrl]) continue;

        try {
          const blobUrl = await getBlobUrlWithAuth(fileUrl);
          setBlobCache((prev) => ({ ...prev, [fileUrl]: blobUrl }));
        } catch {}
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // pick file
  const onPickFile = (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;

    if (f.size > MAX_FILE_BYTES) {
      toast.error(`File too large (max ${MAX_FILE_MB}MB)`);
      return;
    }
    setFileToSend(f);
  };

  // send message (optimistic)
  const onSend = async () => {
    const t = text.trim();
    if (!t && !fileToSend) return;
    if (!activeId) return;

    const now = new Date().toISOString();
    const clientMessageId = uid();

    try {
      let uploaded = null;

      if (fileToSend) {
        setUploading(true);
        uploaded = await uploadChatFile(activeId, fileToSend);
      }

      const optimistic = {
        id: `tmp_${clientMessageId}`,
        content: t || "",
        timestamp: now,
        clientMessageId,
        senderEmail: meEmail,
        file: uploaded
          ? { id: uploaded.id, fileUrl: uploaded.fileUrl, fileName: uploaded.fileName }
          : null,
      };

      setMessages((prev) => [...prev, optimistic]);
      requestAnimationFrame(() => scrollToBottom(true));

      await sendMessage({
        projectId: activeId,
        content: t || "",
        clientMessageId,
        fileId: uploaded?.id || null,
      });

      setText("");
      setFileToSend(null);
    } catch {
      toast.error("Send failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className="flex-1 min-h-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
        <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-12">
          {/* LEFT */}
          <aside className="min-h-0 border-b lg:col-span-4 lg:border-b-0 lg:border-r">
            <div className="h-full min-h-0 flex flex-col p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Messages</h3>

                <button
                  type="button"
                  onClick={() => toast(`Unread messages: ${totalUnread}`)}
                  className="relative inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                >
                  <Bell className="h-4 w-4 text-gray-700" />
                  {totalUnread > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[22px] px-1.5 py-0.5 text-xs rounded-full bg-red-600 text-white text-center">
                      {totalUnread}
                    </span>
                  )}
                </button>
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-100">
                  <Search className="h-4 w-4 text-gray-400" />
                  <input
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="Search projects..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-4 flex-1 min-h-0 overflow-y-auto pr-1 space-y-3">
                {loadingProjects ? (
                  <div className="mt-6 text-center text-sm text-gray-500">Loading…</div>
                ) : list.length === 0 ? (
                  <div className="mt-6 text-center text-sm text-gray-500">No projects found.</div>
                ) : (
                  list.map((p) => {
                    const isActive = String(p.id) === String(activeId);
                    const unread = unreadByProject[p.id] || 0;

                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setActiveId(p.id);
                          markProjectRead(p.id);
                        }}
                        className={cx(
                          "w-full rounded-2xl border p-3 text-left transition",
                          isActive
                            ? "border-orange-200 bg-orange-50"
                            : "border-gray-200 hover:bg-gray-50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gray-100 text-lg">
                            🏗️
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold text-gray-900">
                              {p.name || p.title || `Project #${p.id}`}
                            </div>
                            <div className="mt-1 truncate text-xs text-gray-500">
                              {p.location || p.description || "Project chat"}
                            </div>
                          </div>

                          {unread > 0 ? (
                            <div className="grid h-6 min-w-6 place-items-center rounded-full bg-red-600 px-2 text-xs font-bold text-white">
                              {unread}
                            </div>
                          ) : null}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </aside>

          {/* RIGHT */}
          <section className="min-h-0 lg:col-span-8">
            <div className="h-full min-h-0 flex flex-col">
              {!active ? (
                <div className="grid flex-1 place-items-center p-10 text-sm text-gray-500">
                  Select a project
                </div>
              ) : (
                <>
                  {/* header */}
                  <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gray-100 text-lg">
                        🏗️
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-gray-900">
                          {active.name || active.title || `Project #${active.id}`}
                        </div>
                        <div className="truncate text-xs text-gray-500">
                          {active.location || active.description || "Chat with company"}
                        </div>
                      </div>
                    </div>

                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                      Project
                    </span>
                  </div>

                  {/* messages */}
                  <div className="relative flex-1 min-h-0">
                    <div
                      ref={scrollerRef}
                      onScroll={onChatScroll}
                      className="h-full min-h-0 overflow-y-auto bg-gray-50 px-4 py-4"
                    >
                      {loadingMsgs ? (
                        <div className="grid place-items-center py-12 text-sm text-gray-500">
                          Loading…
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="grid place-items-center py-12 text-sm text-gray-500">
                          No messages yet. Say hi 👋
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {messages.map((m, idx) => {
                            const mine = isMine(m);

                            const fileUrlRaw = m?.fileUrl || m?.file?.fileUrl || "";
                            const fileUrl = normalizeUrl(fileUrlRaw);
                            const fileName = m?.fileName || m?.file?.fileName || "";

                            const img = fileUrl && isImageName(fileName, fileUrl);
                            const imgSrc = blobCache[fileUrl] || null;

                            return (
                              <div
                                key={m.id ?? m.clientMessageId ?? idx}
                                className={cx("flex w-full", mine ? "justify-end" : "justify-start")}
                              >
                                <div
                                  className={cx(
                                    "max-w-[560px] w-full rounded-2xl px-4 py-3 shadow-sm",
                                    mine
                                      ? "bg-orange-500 text-white"
                                      : "bg-white text-gray-900 ring-1 ring-gray-200"
                                  )}
                                >
                                  <div className="text-[11px] font-semibold opacity-80">
                                    {mine ? "You" : "Company"}
                                  </div>

                                  {!!m.content && (
                                    <div className="mt-1 text-sm whitespace-pre-wrap break-words leading-relaxed">
                                      {m.content}
                                    </div>
                                  )}

                                  {fileUrl && (
                                    <div className="mt-2">
                                      {img ? (
                                        <div className="space-y-2">
                                          {imgSrc ? (
                                            <button
                                              type="button"
                                              onClick={() => setPreviewImg({ url: imgSrc, name: fileName })}
                                              className="block"
                                            >
                                              <img
                                                src={imgSrc}
                                                alt={fileName || "image"}
                                                className={cx(
                                                  "max-h-56 w-auto rounded-xl border object-cover",
                                                  mine ? "border-white/30" : "border-gray-200"
                                                )}
                                              />
                                            </button>
                                          ) : (
                                            <button
                                              type="button"
                                              className="text-xs underline opacity-90"
                                              onClick={async () => {
                                                try {
                                                  const blobUrl = await getBlobUrlWithAuth(fileUrl);
                                                  setBlobCache((prev) => ({ ...prev, [fileUrl]: blobUrl }));
                                                  setPreviewImg({ url: blobUrl, name: fileName });
                                                } catch {
                                                  toast.error("Cannot preview image");
                                                }
                                              }}
                                            >
                                              Open image
                                            </button>
                                          )}

                                          <div className="flex flex-wrap gap-2">
                                            <button
                                              type="button"
                                              onClick={() => openInNewTabWithAuth(fileUrl)}
                                              className={cx(
                                                "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs",
                                                mine ? "border-white/30 bg-white/10" : "border-gray-200 bg-white"
                                              )}
                                            >
                                              <ExternalLink className="h-4 w-4" />
                                              Open
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => downloadWithAuth(fileUrl, fileName || "image")}
                                              className={cx(
                                                "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs",
                                                mine ? "border-white/30 bg-white/10" : "border-gray-200 bg-white"
                                              )}
                                            >
                                              <Download className="h-4 w-4" />
                                              Download
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="flex flex-wrap gap-2">
                                          <button
                                            type="button"
                                            onClick={() => openInNewTabWithAuth(fileUrl)}
                                            className={cx(
                                              "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs",
                                              mine ? "border-white/30" : "border-gray-200"
                                            )}
                                          >
                                            <FileText className="h-4 w-4" />
                                            <span className="truncate max-w-[260px]">
                                              {fileName || "Attachment"}
                                            </span>
                                            <ExternalLink className="h-4 w-4" />
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => downloadWithAuth(fileUrl, fileName || "file")}
                                            className={cx(
                                              "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs",
                                              mine ? "border-white/30" : "border-gray-200"
                                            )}
                                          >
                                            <Download className="h-4 w-4" />
                                            Download
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  <div className="mt-2 text-[11px] opacity-70">{timeLabel(m.timestamp)}</div>
                                </div>
                              </div>
                            );
                          })}
                          <div ref={bottomRef} />
                        </div>
                      )}
                    </div>

                    {showJump && (
                      <div className="absolute bottom-4 right-4">
                        <button
                          type="button"
                          onClick={() => {
                            scrollToBottom(true);
                            setShowJump(false);
                            setNewCount(0);
                            markProjectRead(activeIdRef.current);
                          }}
                          className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow-lg hover:bg-gray-800"
                        >
                          <ChevronDown className="h-4 w-4" />
                          {newCount > 0 ? `${newCount} new` : "Jump to latest"}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* composer */}
                  <div className="border-t bg-white p-4">
                    {fileToSend && (
                      <div className="mb-3 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {String(fileToSend.type || "").startsWith("image/") ? (
                            <ImageIcon className="h-4 w-4 text-gray-600" />
                          ) : (
                            <FileText className="h-4 w-4 text-gray-600" />
                          )}
                          <div className="text-xs text-gray-700 truncate">
                            Attached: <span className="font-medium">{fileToSend.name}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setFileToSend(null)}
                          className="text-xs text-red-600 hover:underline"
                          type="button"
                        >
                          remove
                        </button>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <label className="cursor-pointer rounded-xl border border-gray-200 bg-white px-3 py-3 hover:bg-gray-50">
                        <input type="file" className="hidden" onChange={onPickFile} />
                        <Paperclip className="h-4 w-4 text-gray-700" />
                      </label>

                      <input
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                        placeholder="Type your message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            onSend();
                          }
                        }}
                      />

                      <button
                        className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
                        onClick={onSend}
                        disabled={uploading || !activeId}
                        type="button"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          {uploading ? "Sending…" : "Send"}
                        </span>
                      </button>
                    </div>

                    <div className="mt-2 text-[11px] text-gray-500">
                      Enter = send • Shift+Enter = new line • Max file {MAX_FILE_MB}MB
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* image modal */}
      {previewImg?.url && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl rounded-2xl bg-white overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="text-sm font-medium text-gray-900 truncate">
                {previewImg.name || "Image"}
              </div>
              <button
                className="rounded-lg border px-2 py-1 hover:bg-gray-50"
                onClick={() => setPreviewImg(null)}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="bg-black flex items-center justify-center">
              <img
                src={previewImg.url}
                alt={previewImg.name || "image"}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
