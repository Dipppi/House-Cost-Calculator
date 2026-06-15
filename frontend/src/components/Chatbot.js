import React, { useState } from "react";
import "./Chatbot.css";

const Chatbot = ({ area, bedrooms, washrooms, quality, location, totalCost }) => {
  const [isOpen, setIsOpen] = useState(false); // 🔥 NEW
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input) return;

    try {
      const res = await fetch("http://localhost:5000/api/ai-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          area,
          bedrooms,
          washrooms,
          quality,
          location,
          totalCost,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { user: input, bot: data.suggestion },
      ]);

      setInput("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      
      {!isOpen && (
        <div className="chat-toggle" onClick={() => setIsOpen(true)}>
          💬
        </div>
      )}

      {isOpen && (
        <div className="chatbot-container">

          <div className="chat-header">
            🤖 AI Assistant
            <span className="close-btn" onClick={() => setIsOpen(false)}>✖</span>
          </div>

          <div className="chat-box">
            {messages.map((msg, i) => (
              <div key={i}>
                <div className="message user">{msg.user}</div>
                <div className="message ai">{msg.bot}</div>
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your house..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button onClick={sendMessage}>Send</button>
          </div>

        </div>
      )}
    </>
  );
};

export default Chatbot;