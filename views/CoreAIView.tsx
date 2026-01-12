
import React, { useState, useRef, useEffect } from 'react';
import { UserData } from '../types';
import { GoogleGenAI } from "@google/genai";
import { Cpu, Send, Loader2, Terminal, Bot } from 'lucide-react';

const CoreAIView: React.FC<{ user: UserData }> = ({ user }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: "NEURAL_CORE_INITIALIZED. Greetings, Poper. I am the Baloon Poper Protocol analyst. How can I assist in optimizing your harvest?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `User stats: ${user.credits} credits, level ${user.multiTap} tapping, ${user.energyRate} recharge rate. User says: ${userMessage}`,
        config: {
          systemInstruction: "You are the Baloon Poper Neural Core. You are a technical, futuristic, and helpful AI that guides users in a cyber-mining clicker game based on popping balloons/data-packets. Use technical jargon like 'pop rate', 'hash rate', 'neural links', 'packet injection', 'matrix', and 'core flux'. Be encouraging but stay in character as a high-performance terminal. Keep responses concise and focused on game strategy.",
          temperature: 0.7,
        },
      });

      const aiResponse = response.text || "PROTOCOL_ERROR: DATA_CORRUPTED. Please retry connection.";
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', content: "CONNECTION_FAILURE: NEURAL_LINK_TIMEOUT. Ensure your matrix connection is stable." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
           <Bot className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
           <h2 className="text-2xl font-black font-orbitron neon-emerald tracking-tight uppercase">Neural Core</h2>
           <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">AI Matrix Analyst • Online</p>
        </div>
      </div>

      <div className="flex-1 glass rounded-[2rem] border border-white/5 flex flex-col overflow-hidden relative">
        {/* Messages Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-mono leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-emerald-600/20 text-emerald-100 border border-emerald-500/30' 
                  : 'bg-slate-900/60 text-slate-300 border border-white/5'
              }`}>
                {m.role === 'ai' && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5 opacity-50">
                    <Terminal className="w-3 h-3" />
                    <span className="text-[9px] font-black tracking-widest uppercase">Response Stream</span>
                  </div>
                )}
                {m.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5">
                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-950/40 border-t border-white/5">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Inject command into the Core..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-emerald-500 outline-none transition-all placeholder:text-slate-700"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-12 h-12 bg-emerald-500 text-slate-950 rounded-xl flex items-center justify-center hover:bg-emerald-400 transition-all disabled:opacity-50 active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 glass rounded-2xl border border-white/5 flex items-center gap-3">
         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
         <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol Tip: Upgrade Flux Speed to increase recharge rate per unit of time.</span>
      </div>
    </div>
  );
};

export default CoreAIView;
