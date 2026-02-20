import React, { useEffect, useState } from 'react';
import { GameType, Language, GameState, VIPRank } from '../types';
import { 
  CircleDollarSign, Rocket, Bomb, Newspaper, History, Briefcase, 
  MessageCircle, LayoutDashboard, Trophy, Settings, Star,
  Dices, Spade, Coins, Crown
} from 'lucide-react';
import { TEXTS } from '../utils/translations';
import { getNewsTickerData } from '../utils/gemini';
import { hapticSelection } from '../utils/haptics';

interface LobbyScreenProps {
  onSelectGame: (game: GameType) => void;
  userName: string;
  balance: number;
  jackpot: number;
  currentTab: GameState;
  onTabChange: (tab: GameState) => void;
  lang: Language;
  rank: VIPRank;
  children?: React.ReactNode;
}

const LobbyScreen: React.FC<LobbyScreenProps> = ({ 
  onSelectGame, userName, balance, jackpot, currentTab, onTabChange, lang, rank, children 
}) => {
  const t = TEXTS[lang].lobby;
  const [news, setNews] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      const newsData = await getNewsTickerData();
      setNews(newsData);
    };
    fetchNews();
  }, []);

  const handleGameSelect = (game: GameType) => {
    hapticSelection();
    onSelectGame(game);
  };

  const games = [
    { type: GameType.ROULETTE, icon: <Coins size={28} />, color: 'from-om-burgundy to-black' },
    { type: GameType.BLACKJACK, icon: <Spade size={28} />, color: 'from-blue-950 to-black' },
    { type: GameType.ROCKET, icon: <Rocket size={28} />, color: 'from-orange-900 to-black' },
    { type: GameType.MINES, icon: <Bomb size={28} />, color: 'from-om-emerald to-black' },
    { type: GameType.DICE, icon: <Dices size={28} />, color: 'from-purple-950 to-black' },
    { type: GameType.SLOTS, icon: <LayoutDashboard size={28} />, color: 'from-yellow-900 to-black' },
    { type: GameType.POKER, icon: <Spade size={28} />, color: 'from-om-mahogany to-black' },
    { type: GameType.DURAK, icon: <Trophy size={28} />, color: 'from-red-950 to-black' },
  ];

  // Fix: Cast currentTab to any for nav comparisons to prevent TypeScript from complaining 
  // about impossible overlaps caused by strict narrowing when comparing against GameState enum members.
  const currentTabAny = currentTab as any;

  if (currentTab !== GameState.LOBBY) {
    return (
      <div className="flex flex-col h-screen bg-om-black">
        <div className="pt-safe px-4 pb-2 bg-black/90 backdrop-blur-xl border-b border-royal-gold/10">
          <div className="flex justify-between items-center h-12">
            <button onClick={() => onTabChange(GameState.LOBBY)} className="p-2 -ml-2 text-white/30">
               <History size={20} className="rotate-180" />
            </button>
            <span className="font-cinzel text-om-gold font-bold text-sm tracking-widest">{currentTab}</span>
            <div className="w-10" />
          </div>
        </div>
        <div className="flex-1 overflow-hidden">{children}</div>
        <div className="h-20 shrink-0" />
        {/* Navigation Bar Fixed at Bottom */}
        <div className="fixed bottom-0 left-0 w-full bg-black/95 backdrop-blur-2xl border-t border-royal-gold/20 flex justify-around items-center h-20 px-2 z-50">
            <NavButton active={currentTabAny === GameState.LOBBY} icon={<LayoutDashboard size={20} />} label={t.salon} onClick={() => onTabChange(GameState.LOBBY)} />
            <NavButton active={currentTabAny === GameState.VAULT} icon={<Briefcase size={20} />} label={t.vault} onClick={() => onTabChange(GameState.VAULT)} />
            <NavButton active={currentTabAny === GameState.LEADERBOARD} icon={<Trophy size={20} />} label={t.forbes} onClick={() => onTabChange(GameState.LEADERBOARD)} />
            <NavButton active={currentTabAny === GameState.CONCIERGE} icon={<MessageCircle size={20} />} label={t.butler} onClick={() => onTabChange(GameState.CONCIERGE)} />
            <NavButton active={currentTabAny === GameState.SETTINGS} icon={<Settings size={20} />} label={t.cabinet} onClick={() => onTabChange(GameState.SETTINGS)} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-om-black overflow-hidden relative">
      <div className="absolute inset-0 bg-herringbone opacity-5 pointer-events-none" />
      
      {/* Header */}
      <div className="pt-safe px-6 pb-6 bg-gradient-to-b from-om-burgundy/20 to-transparent">
        <div className="flex justify-between items-start pt-4 mb-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <Crown size={12} className="text-om-gold" />
              <span className="text-[10px] text-om-gold font-bold tracking-[0.3em] uppercase">{rank}</span>
            </div>
            <h1 className="text-2xl font-cinzel font-black tracking-tight text-om-cream">{userName}</h1>
          </div>
          <button onClick={() => onTabChange(GameState.WHEEL)} className="group relative w-12 h-12 rounded-full bg-gold-gradient p-0.5 shadow-gold-glow active:scale-95 transition-all">
             <div className="w-full h-full rounded-full bg-om-black flex items-center justify-center">
                <Star size={20} className="text-om-gold group-hover:rotate-180 transition-transform duration-700" />
             </div>
          </button>
        </div>

        <div className="bg-black/60 border border-royal-gold/20 p-5 rounded-sm shadow-2xl backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10">
             <Coins size={64} className="text-om-gold" />
          </div>
          <span className="block text-[9px] text-om-brass uppercase tracking-[0.4em] font-bold mb-1">{t.estateValue}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-playfair font-black text-om-cream">$</span>
            <span className="text-4xl font-playfair font-black text-om-cream tracking-tighter tabular-nums">
                {balance.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* News Ticker */}
      <div className="w-full bg-om-burgundy/10 border-y border-om-brass/10 py-2 overflow-hidden whitespace-nowrap">
        <div className="flex animate-slow-pan">
          <span className="text-[10px] text-om-brass font-bold uppercase tracking-[0.2em] px-8">
            {news || t.news}
          </span>
          <span className="text-[10px] text-om-brass font-bold uppercase tracking-[0.2em] px-8">
            {news || t.news}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide pb-32">
        <div className="mb-6">
           <div className="flex items-center gap-4 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-royal-gold/20"></div>
              <span className="text-[10px] font-cinzel font-bold text-om-gold tracking-[0.4em] uppercase">{t.salon}</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-royal-gold/20"></div>
           </div>

           <div className="grid grid-cols-2 gap-3">
              {games.map((game) => (
                <button
                  key={game.type}
                  onClick={() => handleGameSelect(game.type)}
                  className={`relative overflow-hidden aspect-[1.1/1] rounded-sm border border-royal-gold/10 bg-gradient-to-br ${game.color} p-4 flex flex-col justify-between group active:scale-[0.98] transition-all`}
                >
                  <div className="text-om-gold/40 group-hover:text-om-gold transition-colors">{game.icon}</div>
                  <div className="text-left">
                    <span className="block text-xs font-cinzel font-black text-om-gold tracking-widest uppercase mb-0.5">
                      {TEXTS[lang].games[game.type.toLowerCase() as keyof typeof TEXTS.EN.games]?.name}
                    </span>
                    <span className="block text-[8px] text-om-cream/40 uppercase tracking-tighter">
                      {TEXTS[lang].games[game.type.toLowerCase() as keyof typeof TEXTS.EN.games]?.desc}
                    </span>
                  </div>
                </button>
              ))}
           </div>
        </div>

        {/* Jackpot Banner */}
        <div className="relative rounded-sm overflow-hidden bg-om-mahogany border border-om-gold/30 p-6 mb-6">
            <div className="absolute inset-0 bg-gold-gradient opacity-5 animate-pulse"></div>
            <span className="block text-center text-[9px] text-om-gold font-bold uppercase tracking-[0.5em] mb-2">{t.jackpot}</span>
            <div className="text-center font-playfair font-black text-3xl text-om-cream tabular-nums">
                ${jackpot.toLocaleString()}
            </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 w-full bg-black/95 backdrop-blur-2xl border-t border-royal-gold/20 flex justify-around items-center h-20 px-2 z-50">
          <NavButton active={currentTabAny === GameState.LOBBY} icon={<LayoutDashboard size={20} />} label={t.salon} onClick={() => onTabChange(GameState.LOBBY)} />
          <NavButton active={currentTabAny === GameState.VAULT} icon={<Briefcase size={20} />} label={t.vault} onClick={() => onTabChange(GameState.VAULT)} />
          <NavButton active={currentTabAny === GameState.LEADERBOARD} icon={<Trophy size={20} />} label={t.forbes} onClick={() => onTabChange(GameState.LEADERBOARD)} />
          <NavButton active={currentTabAny === GameState.CONCIERGE} icon={<MessageCircle size={20} />} label={t.butler} onClick={() => onTabChange(GameState.CONCIERGE)} />
          <NavButton active={currentTabAny === GameState.SETTINGS} icon={<Settings size={20} />} label={t.cabinet} onClick={() => onTabChange(GameState.SETTINGS)} />
      </div>
    </div>
  );
};

const NavButton = ({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-all ${active ? 'text-om-gold' : 'text-white/20 hover:text-white/40'}`}>
    <div className={`transition-transform duration-300 ${active ? 'scale-110 -translate-y-1' : ''}`}>{icon}</div>
    <span className={`text-[8px] font-bold uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-40'}`}>{label}</span>
    {active && <div className="absolute bottom-1 w-1 h-1 bg-om-gold rounded-full" />}
  </button>
);

export default LobbyScreen;