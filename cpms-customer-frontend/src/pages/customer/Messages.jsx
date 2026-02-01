import { useState, useEffect, useRef } from "react";
import { FiImage, FiSend, FiFileText } from "react-icons/fi";
import { BsCheck, BsCheckAll } from "react-icons/bs";

const Messages = ({ role = "customer" }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const chatEndRef = useRef(null);

  /* auto scroll */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* mark received messages as seen */
  useEffect(() => {
    setMessages((prev) =>
      prev.map((m) =>
        m.sender !== role && m.status !== "seen"
          ? { ...m, status: "seen", seenTime: timeNow() }
          : m,
      ),
    );
  }, []);

  const timeNow = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleSend = () => {
    if (!text && !file) return;

    const newMessage = {
      id: Date.now(),
      sender: role,
      text,
      file,
      time: timeNow(),
      status: "sent",
    };

    setMessages((prev) => [...prev, newMessage]);

    /* simulate delivered */
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === newMessage.id ? { ...m, status: "delivered" } : m,
        ),
      );
    }, 600);

    setText("");
    setFile(null);
  };

  const Tick = ({ status }) => {
    if (status === "sent") return <BsCheck className="inline ml-1" />;
    if (status === "delivered") return <BsCheckAll className="inline ml-1" />;
    if (status === "seen")
      return <BsCheckAll className="inline ml-1 text-blue-400" />;
    return null;
  };

  const renderFile = (file) => {
    if (!file) return null;

    if (file.type.startsWith("image/")) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt="img"
          className="max-w-[200px] rounded-lg mt-1"
        />
      );
    }

    return (
      <p className="flex items-center gap-1 mt-1 text-sm">
        <FiFileText /> {file.name}
      </p>
    );
  };

  return (
    <div className="bg-[#6b625c] rounded-xl p-6 h-full flex flex-col">
      <h2 className="mb-4 text-xl font-semibold text-white">Messages</h2>

      {/* CHAT AREA */}
      <div className="flex-1 bg-[#5a514c] rounded-lg p-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-md ${
              msg.sender === role ? "ml-auto text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg text-white relative ${
                msg.sender === role ? "bg-orange-500" : "bg-[#4a403a]"
              }`}
            >
              {msg.text && <p>{msg.text}</p>}
              {renderFile(msg.file)}

              {/* time + ticks */}
              <div className="mt-1 text-[11px] flex items-center justify-end gap-1 opacity-80">
                <span>{msg.time}</span>
                {msg.sender === role && <Tick status={msg.status} />}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* SEND BAR */}
      <div className="flex items-center gap-2 mt-4">
        {/* Image */}
        <label className="text-white cursor-pointer hover:text-orange-400">
          <FiImage size={20} />
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        {/* Report / File */}
        <label className="text-white cursor-pointer hover:text-orange-400">
          <FiFileText size={20} />
          <input
            type="file"
            hidden
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        {/* Text */}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-lg outline-none"
        />

        {/* Send */}
        <button
          onClick={handleSend}
          className="p-3 text-white bg-orange-500 rounded-lg"
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default Messages;
