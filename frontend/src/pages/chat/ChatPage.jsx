import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { openChat } from "../../api/chat";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import Avatar from "../../components/Avatar";
import Loader from "../../components/Loader";

export default function ChatPage() {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    openChat(conversationId)
      .then(res => { setConversation(res.conversation); setMessages(res.messages || []); })
      .catch((err) => setError(err?.response?.data?.message || "Could not load this conversation."))
      .finally(() => setLoading(false));
  }, [conversationId]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("joinConversation", { conversationId });

    const handler = (msg) => {
      const msgConvId = msg.conversationId?.toString?.() || msg.conversationId;
      if (msgConvId === conversationId) {
        setMessages(prev => [...prev, msg]);
      }
    };
    socket.on("receiveMessage", handler);
    return () => {
      socket.off("receiveMessage", handler);
    };
  }, [socket, conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const other = conversation?.participants?.find(p => p._id !== user?._id);

  const send = (e) => {
    e.preventDefault();
    if (!text.trim() || !socket) return;
    socket.emit("sendMessage", {
      conversationId,
      sender: user._id,
      text: text.trim(),
    });
    setText("");
  };

  if (loading) return <Loader />;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="chat-shell card">
      <div className="chat-head">
        <Link to={user?.role === "doctor" ? "/doctor/appointments" : "/patient/appointments"} className="muted back-link">←</Link>
        <Avatar src={other?.profilePic} name={other?.name} size={38} />
        <div>
          <strong>{other?.role === "doctor" ? `Dr. ${other?.name}` : other?.name}</strong>
        </div>
      </div>

      <div className="chat-body">
        {messages.length === 0 && <p className="muted" style={{ textAlign: "center", marginTop: 30 }}>Say hello 👋</p>}
        {messages.map((m) => {
          const mine = (m.sender?._id || m.sender) === user?._id;
          return (
            <div key={m._id} className={`bubble-row ${mine ? "mine" : ""}`}>
              <div className={`bubble ${mine ? "mine" : ""}`}>{m.text}</div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form className="chat-input" onSubmit={send}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." />
        <button className="btn btn-primary" disabled={!text.trim()}>Send</button>
      </form>

      <style>{`
        .chat-shell { max-width: 700px; margin: 0 auto; display: flex; flex-direction: column; height: calc(100dvh - 130px); overflow: hidden; }
        .chat-head { display: flex; align-items: center; gap: 12px; padding: 14px 18px; border-bottom: 1px solid var(--line); }
        .back-link { font-size: 18px; }
        .chat-body { flex: 1; overflow-y: auto; padding: 18px; display: flex; flex-direction: column; gap: 8px; }
        .bubble-row { display: flex; }
        .bubble-row.mine { justify-content: flex-end; }
        .bubble { max-width: 70%; padding: 10px 14px; border-radius: 14px; background: var(--teal-50); font-size: 14px; line-height: 1.4; }
        .bubble.mine { background: var(--teal-700); color: #fff; }
        .chat-input { display: flex; gap: 10px; padding: 14px 18px; border-top: 1px solid var(--line); }
        .chat-input input { flex: 1; padding: 10px 14px; border: 1px solid var(--line); border-radius: 999px; }
      `}</style>
    </div>
  );
}
