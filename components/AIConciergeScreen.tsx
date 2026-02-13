
import React, { useState } from 'react';
import { Send, User, Bot, Search } from 'lucide-react';
import { getAIConciergeResponse } from '../utils/gemini';
import { VIPRank } from '../types';

interface AIConciergeScreenProps {
  userName: string;
  rank: VIPRank;
}

const AIConciergeScreen: React.FC<AIConciergeScreenProps> = ({ userName, rank }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string, sources?: any[] }[]>([
    { role: 'bot', text: `Welcome back to The Residency, My Lord ${userName}. How may I assist your estate today? Perhaps the latest luxury market news or some strategic advice on the Roulette wheel?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await getAIConciergeResponse(userMsg, userName, rank);
      setMessages(prev => [...prev, { role: 'bot', text: response.text || "I apologize, My Lord, I seem to have lost my train of thought.", sources: response.sources }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "Forgive me, My Lord, but the concierge service is temporarily occupied. Please try again shortly." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-md rounded-t-3xl border-x border-t border-royal-gold/20 animate-fade-in overflow-hidden">
      <div className="p-4 border-b border-royal-gold/10 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-om-matte-green flex items-center justify-center border border-royal-gold/30">
               <Bot className="text-royal-gold" size={20} />
            </div>
            <div>
               <div className="font-cinzel text-royal-gold font-bold text-sm">Royal Butler</div>
               <div className="text-[8px] text-white/40 uppercase tracking-[0.2em]">Concierge AI Service</div>
            </div>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-hide">
         {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[80%] p-3 rounded-lg text-sm font-cormorant tracking-wide leading-relaxed ${
                 m.role === 'user' ? 'bg-royal-gold/10 text-royal-gold-light border border-royal-gold/20' : 'bg-om-matte-green/20 text-om-cream border border-white/5'
               }`}>
                  {m.text}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/10 flex flex-wrap gap-2">
                       {m.sources.map((s: any, j: number) => (
                         <a key={j} href={s.web?.uri} target="_blank" className="text-[8px] bg-royal-gold/20 px-1.5 py-0.5 rounded text-royal-gold flex items-center gap-1">
                            <Search size={8} /> {s.web?.title || 'Source'}
                         </a>
                       ))}
                    </div>
                  )}
               </div>
            </div>
         ))}
         {loading && <div className="text-[10px] text-royal-gold animate-pulse italic">Thinking, My Lord...</div>}
      </div>

      <div className="p-4 border-t border-royal-gold/10 bg-black/40">
         <div className="flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'ENTER' && handleSend()}
              placeholder="Ask the Butler..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm font-cormorant text-om-cream outline-none focus:border-royal-gold/40"
            />
            <button 
              onClick={handleSend}
              className="w-10 h-10 rounded-full bg-royal-gold flex items-center justify-center text-black active:scale-90 transition-all"
            >
               <Send size={18} />
            </button>
         </div>
      </div>
    </div>
  );
};

export default AIConciergeScreen;
