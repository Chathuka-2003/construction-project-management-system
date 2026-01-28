import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "../components/store/AppStore.jsx";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "project", label: "Projects" },
  { key: "customer", label: "Customers" },
];

function timeLabel(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Messages() {
  const { data, sendMessage, markConversationRead } = useStore();

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [activeId, setActiveId] = useState(data.conversations?.[0]?.id || null);
  const [text, setText] = useState("");

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let arr = [...(data.conversations || [])];

    if (filter !== "all") arr = arr.filter((c) => c.kind === filter);

    if (needle) {
      arr = arr.filter((c) => (c.title || "").toLowerCase().includes(needle));
    }

    arr.sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0));
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
    // mark read when switching
    if (activeId != null) markConversationRead(activeId);
  }, [activeId,]);

  useEffect(() => {
    // auto scroll bottom
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [msgs.length, activeId]);

  const openConversation = (id) => {
    setActiveId(id);
  };

  const onSend = () => {
    const t = text.trim();
    if (!t || !activeId) return;
    sendMessage(activeId, t);
    setText("");
  };

  return (
    <div className="msg-shell">
      {/* LEFT */}
      <aside className="msg-left">
        <div className="msg-left-head">
          <h3 className="msg-title">Messages</h3>

          <div className="msg-search">
            <span className="msg-search-icon">⌕</span>
            <input
              className="msg-search-input"
              placeholder="Search conversations..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="msg-filters">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className={`msg-filter ${filter === f.key ? "active" : ""}`}
                onClick={() => setFilter(f.key)}
                type="button"
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="msg-list">
          {list.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => openConversation(c.id)}
              className={`msg-item ${c.id === activeId ? "active" : ""}`}
            >
              <div className={`msg-avatar ${c.kind}`}>
                {c.kind === "project" ? "🏗️" : c.kind === "customer" ? "👤" : "🛡️"}
              </div>

              <div className="msg-item-mid">
                <div className="msg-item-top">
                  <b className="msg-item-title">{c.title}</b>
                  <span className="msg-item-time">{timeLabel(c.lastMessageAt)}</span>
                </div>
                <div className="msg-item-sub">{c.subtitle}</div>
              </div>

              {c.unread > 0 ? <div className="msg-badge">{c.unread}</div> : null}
            </button>
          ))}

          {list.length === 0 ? (
            <div className="msg-empty">No conversations found.</div>
          ) : null}
        </div>
      </aside>

      {/* RIGHT */}
      <section className="msg-right">
        {!active ? (
          <div className="msg-blank">Select a conversation</div>
        ) : (
          <>
            <div className="msg-right-head">
              <div className={`msg-avatar big ${active.kind}`}>
                {active.kind === "project" ? "🏗️" : active.kind === "customer" ? "👤" : "🛡️"}
              </div>
              <div>
                <div className="msg-chat-title">{active.title}</div>
                <div className="msg-chat-sub">{active.subtitle}</div>
              </div>
              <div className="msg-pill">{active.kind === "project" ? "Project" : active.kind === "customer" ? "Customer" : "Admin"}</div>
            </div>

            <div className="msg-chat" ref={scrollerRef}>
              {msgs.map((m) => (
                <div key={m.id} className={`bubble-row ${m.sender === "me" ? "me" : "them"}`}>
                  <div className={`bubble ${m.sender === "me" ? "me" : "them"}`}>
                    <div className="bubble-label">{m.senderLabel}</div>
                    <div className="bubble-text">{m.text}</div>
                    <div className="bubble-time">{timeLabel(m.createdAt)}</div>
                  </div>
                </div>
              ))}

              {msgs.length === 0 ? (
                <div className="msg-empty-chat">No messages yet. Say hi 👋</div>
              ) : null}
            </div>

            <div className="msg-input">
              <input
                className="msg-textbox"
                placeholder="Type your message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSend();
                }}
              />
              <button className="msg-send" onClick={onSend} type="button">
                Send
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
