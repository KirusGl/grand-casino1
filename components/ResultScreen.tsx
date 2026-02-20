
import React, { useEffect, useState } from 'react';
import { RefreshCw, Crown, Sparkles, Trophy, ArrowRight, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { hapticNotification } from '../utils/haptics';
import { Language } from '../types';
import { TEXTS } from '../utils/translations';

interface ResultScreenProps {
  finalBalance: number;
  totalWon: number;
  onRestart: () => void;
  lang: Language;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ finalBalance, totalWon, onRestart, lang }) => {
  const t = TEXTS[lang].result;
  const isProfit = totalWon > 0;
  const isBigWin = totalWon >= 1000;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    if (isProfit) {
      hapticNotification('success');
    } else {
      hapticNotification('warning');
    }
  }, [isProfit]);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-om-black relative p-6 text-center overflow-hidden">
      <div className="absolute inset-0 bg-vip-leather opacity-20 pointer-events-none" />
      
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className={`absolute inset-0 bg-gradient-to-t ${isProfit ? 'from-om-emerald/15' : 'from-om-burgundy/10'} via-transparent to-transparent opacity-60`}></div>
        {isBigWin && Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute animate-bounce opacity-25"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <Sparkles className="text-om-gold" size={Math.random() * 20 + 15} />
          </div>
        ))}
      </div>

      <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'} z-10 w-full max-w-sm`}>
        <div className="flex justify-center mb-6">
           {isProfit ? (
             <div className="relative">
                <div className="absolute inset-0 bg-om-gold/20 blur-2xl rounded-full"></div>
                <Trophy size={80} className="text-om-gold relative drop-shadow-[0_0_15px_rgba(197,160,89,0.6)]" />
                <Sparkles size={24} className="absolute -top-2 -right-4 text-white animate-pulse" />
             </div>
           ) : (
             <Crown size={80} className="text-om-gold/10" />
           )}
        </div>

        <h2 className="text-4xl font-cinzel font-bold text-transparent bg-clip-text bg-gold-gradient mb-3 tracking-[0.15em] uppercase drop-shadow-lg">
          {isBigWin ? t.magnificent : isProfit ? t.accrued : t.concluded}
        </h2>
        <p className="font-sans text-om-brass/60 italic text-base tracking-widest mb-10">
          {isProfit ? t.wealthFlows : t.patience}
        </p>

        <div className="w-full bg-black/80 backdrop-blur-3xl border border-royal-gold/20 p-8 rounded-sm shadow-[0_25px_60px_rgba(0,0,0,0.7)] relative overflow-hidden mb-10">
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gold-gradient"></div>
          
          <div className="flex flex-col gap-8">
            <div className="text-center">
              <p className="text-om-gold/40 text-[9px] uppercase tracking-[0.4em] mb-2 font-cinzel">{t.currentValue}</p>
              <div className="flex items-center justify-center gap-3">
                <Wallet size={20} className="text-om-gold/50" />
                <p className="text-5xl font-playfair font-bold text-om-cream drop-shadow-xl tracking-tight">${finalBalance.toLocaleString()}</p>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-royal-gold/30 to-transparent w-full"></div>

            <div className="flex justify-around items-center">
              <div className="text-center">
                <p className="text-om-gold/30 text-[8px] uppercase tracking-[0.3em] mb-1 font-cinzel">{t.netResult}</p>
                <div className="flex items-center gap-1">
                   {isProfit ? <TrendingUp size={14} className="text-green-500" /> : <TrendingDown size={14} className="text-red-500/70" />}
                   <p className={`text-2xl font-bold font-mono tracking-tighter ${isProfit ? 'text-green-500' : 'text-red-500/70'}`}>
                    {isProfit ? '+' : ''}{totalWon.toLocaleString()}
                   </p>
                </div>
              </div>
              <div className="w-px h-10 bg-white/5"></div>
              <div className="text-center">
                <p className="text-om-gold/30 text-[8px] uppercase tracking-[0.3em] mb-1 font-cinzel">{t.performance}</p>
                <p className="text-xl font-bold text-white/40 font-mono italic">
                  {Math.abs(Math.round((totalWon / (finalBalance - totalWon || 1)) * 100))}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full px-4">
          <button
            onClick={onRestart}
            className="group relative w-full py-5 bg-om-mahogany overflow-hidden rounded-sm transition-all duration-500 active:scale-95 border border-royal-gold/30 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.9)]"
          >
            <div className="absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <span className="relative z-10 font-cinzel text-lg font-bold text-om-gold tracking-[0.3em] flex items-center justify-center gap-3">
              {t.reenter} <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
            </span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 opacity-20 flex flex-col items-center">
        <div className="h-px w-32 bg-royal-gold/30 mb-2"></div>
        <p className="font-cinzel text-[9px] text-om-cream uppercase tracking-[0.5em]">The Residency • Est. 1924</p>
      </div>
    </div>
  );
};

export default ResultScreen;
