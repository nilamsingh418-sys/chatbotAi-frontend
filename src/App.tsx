import { useState } from "react";
import axios from "axios";

// ✅ define type
type ChatMessage = {
  type: "user" | "bot";
  text: string;
};

function App() {
  const [message, setMessage] = useState<string>("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!message) return;

    const userMsg = message;

    const newChat: ChatMessage[] = [
      ...chat,
      { type: "user", text: userMsg },
    ];

    setChat(newChat);
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/content",
        { message: userMsg },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setChat([
        ...newChat,
        { type: "bot", text: res.data.result },
      ]);
    } catch (err) {
      console.log(err);
      setChat([
        ...newChat,
        { type: "bot", text: "Error from server" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="p-4 text-xl font-bold border-b">
        🤖 AI Chat Using Gemini
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-lg ${
              msg.type === "user"
                ? "bg-blue-600 ml-auto"
                : "bg-gray-700"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && <div>Typing...</div>}
      </div>

      {/* Input */}
      <div className="p-4 flex gap-2 border-t">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 bg-gray-800 rounded"
          placeholder="Type..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;