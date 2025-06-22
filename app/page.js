'use client';

import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);

  // Custom SVG Icons
  const ZapIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
    </svg>
  );

  const BotIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M13 7H7v6h6V7z"/>
      <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd"/>
    </svg>
  );

  const UserIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  );

  const SendIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
  );

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message };
    setChatLog(prev => [...prev, userMessage]);
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setChatLog(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setChatLog(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 text-white">
      {/* Header */}
      <div className="border-b border-red-900/30 bg-black/40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-500 rounded-lg flex items-center justify-center">
              <ZapIcon />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
                Groq Chatbot
              </h1>
              <p className="text-sm text-gray-400">Powered by lightning-fast AI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto p-6 h-[calc(100vh-120px)] flex flex-col">
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-transparent">
          {chatLog.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600/20 to-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-600/30">
                <BotIcon />
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Start a conversation</h3>
              <p className="text-gray-500">Send a message to begin chatting with the AI</p>
            </div>
          ) : (
            chatLog.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <BotIcon />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] p-4 rounded-2xl shadow-lg ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white ml-12'
                      : 'bg-gray-800/60 border border-gray-700/50 text-gray-100 backdrop-blur-sm'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <UserIcon />
                  </div>
                )}
              </div>
            ))
          )}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex gap-3 justify-start animate-fadeIn">
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <BotIcon />
              </div>
              <div className="bg-gray-800/60 border border-gray-700/50 backdrop-blur-sm p-4 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        {/* Input Form */}
        <div className="relative">
          <div className="flex gap-3 p-4 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(e)}
              className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg"
              placeholder="Type your message..."
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !message.trim()}
              className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-red-500/25 disabled:cursor-not-allowed group"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thumb-red-600::-webkit-scrollbar-thumb {
          background-color: rgb(220 38 38);
          border-radius: 3px;
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}