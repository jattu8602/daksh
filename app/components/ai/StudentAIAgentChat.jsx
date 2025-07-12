import { useRef, useState } from 'react';

export default function StudentAIAgentChat({ onClose }) {
  const [messages, setMessages] = useState([]); // {role: 'user'|'ai', content: string}
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  const sendMessage = async (e) => {
    e.preventDefault();
    setError('');
    if (!input && !file) {
      setError('Please enter a question or upload a file.');
      return;
    }
    setLoading(true);
    let formData = new FormData();
    if (input) formData.append('query', input);
    if (file) formData.append('file', file);
    setMessages((msgs) => [...msgs, { role: 'user', content: input || file.name }]);
    setInput('');
    setFile(null);
    try {
      const res = await fetch('/api/ai-agent', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages((msgs) => [...msgs, { role: 'ai', content: data.answer }]);
    } catch (err) {
      setMessages((msgs) => [...msgs, { role: 'ai', content: 'Sorry, there was an error processing your request.' }]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-2">
          <img src="/web-app-manifest-512x512.png" alt="Daksh AI Agent" className="w-10 h-10" />
          <span className="font-bold text-lg">Daksh AI Agent</span>
        </div>
        <button onClick={onClose} className="text-2xl font-bold text-gray-700 hover:text-red-500">×</button>
      </div>
      {/* Chat history */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-400">Ask your study question or upload a photo/PDF!</div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg px-4 py-2 max-w-[80%] whitespace-pre-line ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white border text-gray-800'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg px-4 py-2 bg-white border text-gray-400 animate-pulse">Thinking...</div>
          </div>
        )}
      </div>
      {/* Input area */}
      <form onSubmit={sendMessage} className="p-4 border-t bg-white flex flex-col gap-2">
        {error && <div className="text-red-500 text-sm mb-1">{error}</div>}
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2 focus:outline-none"
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <input
            type="file"
            accept="image/*,application/pdf"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            disabled={loading}
          />
          <button
            type="button"
            className="border rounded px-3 py-2 bg-gray-100 hover:bg-gray-200"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            disabled={loading}
          >
            {file ? file.name : 'Upload'}
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            Send
          </button>
        </div>
        {file && (
          <div className="text-xs text-gray-500">Selected: {file.name}</div>
        )}
      </form>
    </div>
  );
}