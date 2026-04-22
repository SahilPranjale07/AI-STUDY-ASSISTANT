import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Send, Bot, User, Loader2, Sparkles, ChevronLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

import ReactMarkdown from 'react-markdown';

export default function Chat() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I've analyzed your notes. What would you like to know about them? I can clarify complex concepts, summarize specific parts, or help you study!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [materialTitle, setMaterialTitle] = useState('Study Material');
  const [explanation, setExplanation] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (id === 'latest') {
        const savedResult = localStorage.getItem('last_ai_result');
        if (savedResult) {
          const data = JSON.parse(savedResult);
          setMaterialTitle(data.explanationContent?.title || 'Study Material');
          setExplanation(data.explanationContent);
        }
        return;
      }

      const { data } = await supabase
        .from('study_materials')
        .select('title, summary')
        .eq('id', id)
        .single();
      
      if (data) {
        setMaterialTitle(data.title);
        try {
          setExplanation(JSON.parse(data.summary));
        } catch (e) {
          console.error("Failed to parse summary:", e);
        }
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Get fallback context from localStorage if we are in 'latest' mode
      let fallback_context = "";
      if (id === 'latest') {
        const savedResult = localStorage.getItem('last_ai_result');
        if (savedResult) {
          const data = JSON.parse(savedResult);
          fallback_context = data.extracted_text;
        }
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          material_id: id,
          message: userMessage,
          fallback_context: fallback_context
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I'm sorry, I encountered an error: ${err.message}. Please try again.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg font-bold truncate max-w-md">{materialTitle}</h1>
              <div className="flex items-center gap-2 text-[10px] text-purple-400">
                <Sparkles size={10} />
                <span>AI Study Tutor & Assistant</span>
              </div>
            </div>
          </div>
        </header>

        {/* Split Screen Container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Side: Explanation */}
          <div className="w-[45%] border-r border-slate-800 overflow-y-auto bg-slate-900/20 p-8 custom-scrollbar">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-100 mb-8 pb-4 border-b border-slate-800">Study Notes</h2>
              {explanation?.sections ? (
                <div className="space-y-10">
                  {explanation.sections.map((section: any, index: number) => (
                    <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center text-sm">{index + 1}</span>
                        {section.heading}
                      </h3>
                      <ul className="space-y-3 mb-6 ml-10">
                        {section.points.map((point: string, i: number) => (
                          <li key={i} className="text-slate-300 leading-relaxed list-disc marker:text-purple-500">
                            {point}
                          </li>
                        ))}
                      </ul>
                      {section.example && (
                        <div className="ml-10 p-4 bg-blue-500/5 border-l-2 border-blue-500/30 rounded-r-xl">
                          <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">💡 Example</p>
                          <p className="text-slate-400 text-sm italic">{section.example}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 py-20">
                  <Loader2 className="animate-spin mb-4" size={40} />
                  <p>Loading your study notes...</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Chatbot */}
          <div className="flex-1 flex flex-col bg-slate-950/50">
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
            >
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg ${
                      msg.role === 'assistant' 
                        ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white' 
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    
                    <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                      msg.role === 'assistant'
                        ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                        : 'bg-purple-600/10 border border-purple-500/20 text-slate-100 rounded-tr-none'
                    }`}>
                      <div className="text-sm leading-relaxed prose prose-invert prose-p:leading-relaxed prose-pre:bg-slate-800 max-w-none">
                        {msg.role === 'assistant' ? (
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-4 animate-fade-in">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-lg">
                      <Bot size={16} />
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                      <Loader2 className="animate-spin text-purple-400" size={16} />
                      <span className="text-slate-400 text-xs">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-slate-800">
              <form 
                onSubmit={handleSend}
                className="max-w-3xl mx-auto relative"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about the notes on the left..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pr-12 text-slate-200 focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-slate-600"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
