import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setChatLog((prev) => [...prev, { role: 'user', content: message }]);
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    setChatLog((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    setMessage('');
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Groq Chatbot</h1>

      <div className="space-y-2 mb-4 max-h-[70vh] overflow-y-auto">
        {chatLog.map((msg, idx) => (
          <div key={idx} className={`p-2 rounded ${msg.role === 'user' ? 'bg-blue-700' : 'bg-green-700'}`}>
            <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> {msg.content}
          </div>
        ))}
        {loading && <div className="text-gray-400">Typing...</div>}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 text-black rounded"
          placeholder="Type your message..."
        />
        <button type="submit" className="bg-blue-600 px-4 py-2 rounded">Send</button>
      </form>
    </main>
  );
}
