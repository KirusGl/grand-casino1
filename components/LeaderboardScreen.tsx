import React from 'react';
import { Crown, Trophy, Medal } from 'lucide-react';
import { Language } from '../types';
import { TEXTS } from '../utils/translations';

interface LeaderboardScreenProps {
  userBalance: number;
  userName: string;
  lang: Language;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ userBalance, userName, lang }) => {
  const t = TEXTS[lang].leaderboard;

  // Mock VIP Data mixed with user
  const generateLeaderboard = () => {
    const vips = [
      { name: "Sheikh Al-Maktoum", balance: 54000000, isUser: false },
      { name: "Baron Rothschild", balance: 12500000, isUser: false },
      { name: "Mr. Musk", balance: 8900000, isUser: false },
      { name: "Prince Harry", balance: 4500000, isUser: false },
      { name: "Lady Gaga", balance: 3200000, isUser: false },
      { name: "007 Bond", balance: 1500000, isUser: false },
      { name: "Gatsby", balance: 900000, isUser: false },
      { name: "Tony Stark", balance: 750000, isUser: false },
      { name: "Bruce Wayne", balance: 500000, isUser: false },
    ];
    
    const userEntry = { name: `${userName} (${t.you})`, balance: userBalance, isUser: true };
    const all = [...vips, userEntry].sort((a, b) => b.balance - a.balance);
    return all;
  };

  const list = generateLeaderboard();

  return (
    <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
      <div className="text-center mb-8 relative">
          <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-royal-gold/30 to-transparent"></div>
          <div className="relative inline-block bg-om-wine px-6">
             <h2 className="text-3xl font-cinzel text-royal-gold font-bold tracking-widest">{t.title}</h2>
             <p className="text-xs font-playfair text-white/40 uppercase tracking-[0.3em] mt-2">{t.subtitle}</p>
          </div>
      </div>

      <div className="flex flex-col gap-2 max-w-2xl mx-auto">
         {/* Headers */}
         <div className="flex justify-between px-4 text-[10px] text-royal-gold/40 uppercase tracking-widest mb-2 font-cinzel">
             <span>{t.rank}</span>
             <span className="flex-1 ml-8">{t.player}</span>
             <span>{t.wealth}</span>
         </div>

         {list.map((entry, index) => {
             const rank = index + 1;
             const isTop3 = rank <= 3;
             return (
                 <div 
                    key={index}
                    className={`
                        relative flex items-center justify-between p-4 rounded-md border transition-all duration-300
                        ${entry.isUser 
                            ? 'bg-royal-gold/10 border-royal-gold shadow-[0_0_20px_rgba(212,175,55,0.2)] scale-[1.02] z-10' 
                            : 'bg-[#0a0a0a] border-white/5 hover:border-white/10'}
                    `}
                 >
                    <div className="flex items-center gap-4 w-12 shrink-0">
                        {rank === 1 && <Crown className="text-yellow-400 fill-yellow-400" size={20} />}
                        {rank === 2 && <Trophy className="text-gray-300 fill-gray-300" size={18} />}
                        {rank === 3 && <Medal className="text-amber-700 fill-amber-700" size={18} />}
                        {rank > 3 && <span className="text-white/30 font-mono font-bold w-6 text-center">{rank}</span>}
                    </div>

                    <div className="flex-1 flex flex-col">
                        <span className={`font-playfair font-bold text-lg ${entry.isUser ? 'text-royal-gold' : 'text-om-cream'}`}>
                            {entry.name}
                        </span>
                    </div>

                    <div className="text-right">
                        <span className={`font-cinzel font-bold text-lg ${entry.isUser ? 'text-green-400' : 'text-royal-gold/80'}`}>
                            ${entry.balance.toLocaleString()}
                        </span>
                    </div>
                 </div>
             );
         })}
      </div>
      
      {/* Decorative Footer */}
      <div className="mt-12 text-center opacity-30">
          <Crown className="mx-auto text-royal-gold mb-2" size={16} />
          <p className="text-[10px] uppercase tracking-widest text-om-cream">Updated Real-Time</p>
      </div>
    </div>
  );
};

export default LeaderboardScreen;