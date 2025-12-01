import { useEffect, useRef, useState, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { AuthContext } from "../context/AuthContext";

const Chat = () => {
  const { token, user } = useContext(AuthContext);
  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);
  const params = useParams();
  const location = useLocation();

  useEffect(() => {
    const s = io("http://localhost:5000", { transports: ["websocket"] });
    socketRef.current = s;
    s.on("message", (msg) => setMessages((m) => [...m, msg]));
    return () => { s.disconnect(); };
  }, []);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get("roomId");
    const fromRoute = params.roomId;
    const nextId = fromRoute || q || "";
    if (nextId && nextId !== roomId) setRoomId(nextId);
  }, [location.search, params.roomId, roomId]);

  const join = async () => {
    if (!roomId) return;
    socketRef.current.emit("join", roomId);
    const res = await fetch(`http://localhost:5000/api/messages/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => {
    const run = async () => {
      if (!socketRef.current || !roomId) return;
      socketRef.current.emit("join", roomId);
      const res = await fetch(`http://localhost:5000/api/messages/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessages(data);
    };
    run();
  }, [roomId, token]);

  const send = () => {
    if (!text.trim() || !roomId) return;
    socketRef.current.emit("message", { roomId, text, sender: user.id });
    setText("");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Messages</h2>
      <div className="flex gap-2 mb-4">
        <input className="border p-2 rounded w-full" placeholder="Enter room id" value={roomId} onChange={e=>setRoomId(e.target.value)} />
        <button onClick={join} className="bg-blue-600 text-white px-4 rounded">Join</button>
      </div>
      <div className="bg-white h-64 overflow-y-auto p-4 rounded shadow mb-3">
        {messages.map(m => (
          <div key={m._id || Math.random()} className="mb-2">
            <div className="text-sm text-gray-500">{new Date(m.createdAt).toLocaleTimeString()} • {m.sender}</div>
            <div>{m.text}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="border p-2 rounded w-full" placeholder="Type a message" value={text} onChange={e=>setText(e.target.value)} />
        <button onClick={send} className="bg-green-600 text-white px-4 rounded">Send</button>
      </div>
    </div>
  );
};

export default Chat;
