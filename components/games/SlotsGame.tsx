import React, { useState, useEffect, useCallback } from 'react';
import BettingControls from '../shared/BettingControls';
import { Sparkles, Crown, Zap } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

interface Props { balance: number; onUpdateBalance: (d: number) => void; onWin?: (amount: number) => void; }

const SYMBOLS = ['🍒', '🍋', '🔔', '💎', '7️⃣', '👑'];
const SYMBOL_NAMES = { '🍒': 'Cherry', '🍋': 'Lemon', '🔔': 'Bell', '💎': 'Diamond', '7️⃣': 'Seven', '👑': 'Crown' };
const PAYOUTS = { '🍒': 2, '🍋': 3, '🔔': 5, '💎': 10, '7️⃣': 20, '👑': 50 };
const WILD_SYMBOL = '🌟';

interface ReelProps {
  symbol: string;
  spinning: boolean;
  delay: number;
  isWinner: boolean;
}

const Reel: React.FC<ReelProps> = ({ symbol, spinning, delay, isWinner }) => {
  const [displaySymbol, setDisplaySymbol] = useState(symbol);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (spinning) {
      const timeout = setTimeout(() => {
        setIsAnimating(true);
        const interval = setInterval(() => {
          setDisplaySymbol(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
        }, 80);
        
        setTimeout(() => {
          clearInterval(interval);
          setIsAnimating(false);
          setDisplaySymbol(symbol);
        }, 1500 + delay);
      }, delay);
      
      return () => clearTimeout(timeout);
    } else {
      setDisplaySymbol(symbol);
      setIsAnimating(false);
    }
  }, [spinning, symbol, delay]);

  return (
    <div className={`flex-1 aspect-[2/3] bg-gradient-to-b from-white to-gray-100 rounded-lg flex items-center justify-center text-[clamp(2rem,8vw,4rem)] border-4 transition-all duration-300 relative overflow-hidden ${
      isWinner ? 'border-royal-gold shadow-[0_0_30px_#d4af37] scale-105 z-10' : 'border-gray-300 shadow-inner'
    }`}>
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.3)_1px,_transparent_1px)] bg-[length:8px_8px]"></div>
      
      {/* Symbol container with animation */}
      <div className={`relative z-10 transition-all duration-200 ${isAnimating ? 'blur-sm scale-90' : 'blur-0 scale-100'} ${isWinner ? 'animate-bounce' : ''}`}>
        {displaySymbol}
      </div>
      
      {/* Shine effect on winner */}
      {isWinner && (
        <div className="absolute inset-0 bg-gradient-to-t from-royal-gold/20 to-transparent animate-pulse"></div>
      )}
    </div>
  );
};

const SlotsGame: React.FC<Props> = ({ balance, onUpdateBalance, onWin }) => {
    const [reels, setReels] = useState(['7️⃣', '7️⃣', '7️⃣']);
    const [spinning, setSpinning] = useState(false);
    const [bet, setBet] = useState(10);
    const [message, setMessage] = useState("SPIN TO WIN");
    const [autoPlay, setAutoPlay] = useState(false);
    const [winningLines, setWinningLines] = useState<number[]>([]);
    const [totalWins, setTotalWins] = useState(0);
    const [bigWin, setBigWin] = useState(false);

    const generateResult = useCallback(() => {
      // Weighted random for more exciting results
      const weights = [30, 25, 20, 15, 8, 2]; // Cherry most common, Crown rarest
      const totalWeight = weights.reduce((a, b) => a + b, 0);
      let random = Math.random() * totalWeight;
      let symbolIndex = 0;
      
      for (let i = 0; i < weights.length; i++) {
        random -= weights[i];
        if (random <= 0) {
          symbolIndex = i;
          break;
        }
      }
      
      return SYMBOLS[symbolIndex];
    }, []);

    const spin = useCallback(() => {
        if (balance < bet) { 
          setMessage("Low Balance"); 
          triggerHaptic('error');
          return; 
        }
        
        onUpdateBalance(-bet);
        setSpinning(true);
        setMessage("Good Luck!");
        setWinningLines([]);
        setBigWin(false);
        triggerHaptic('light');

        // Generate final results
        const finalReels = [generateResult(), generateResult(), generateResult()];
        setReels(finalReels);
        
        // Stop reels one by one for suspense
        setTimeout(() => {
            setSpinning(false);
            
            const [r1, r2, r3] = finalReels;
            let winAmount = 0;
            let winMessage = "";
            const newWinningLines: number[] = [];

            // Check for 3 of a kind (jackpot)
            if (r1 === r2 && r2 === r3) {
                winAmount = bet * PAYOUTS[r1 as keyof typeof PAYOUTS];
                newWinningLines.push(0, 1, 2);
                
                if (r1 === '👑') {
                  winMessage = "ROYAL JACKPOT!";
                  setBigWin(true);
                  triggerHaptic('success');
                } else if (r1 === '7️⃣') {
                  winMessage = "LUCKY 7s JACKPOT!";
                  setBigWin(true);
                  triggerHaptic('success');
                } else {
                  winMessage = `JACKPOT!`;
                  triggerHaptic('success');
                }
                
                onWin?.(winAmount);
            } 
            // Check for 2 of a kind (small win)
            else if (r1 === r2 || r2 === r3 || r1 === r3) {
                winAmount = Math.floor(bet * 1.5);
                if (r1 === r2) newWinningLines.push(0, 1);
                if (r2 === r3) newWinningLines.push(1, 2);
                if (r1 === r3) newWinningLines.push(0, 2);
                winMessage = "NICE MATCH!";
                triggerHaptic('light');
            } 
            // Check for near miss (encouragement)
            else {
              const uniqueSymbols = new Set([r1, r2, r3]);
              if (uniqueSymbols.size === 2) {
                setMessage("SO CLOSE! Try Again");
              } else {
                setMessage("Try Again");
              }
            }

            if (winAmount > 0) {
                onUpdateBalance(winAmount);
                setTotalWins(prev => prev + winAmount);
                setMessage(`${winMessage} +${winAmount}`);
            }
            
            // Auto-play logic
            if (autoPlay && balance >= bet) {
              setTimeout(spin, 1500);
            }
        }, 2000);
    }, [balance, bet, autoPlay, generateResult, onUpdateBalance, onWin]);

    // Auto-stop when balance too low
    useEffect(() => {
      if (autoPlay && balance < bet) {
        setAutoPlay(false);
        setMessage("Auto-stop: Low Balance");
      }
    }, [autoPlay, balance, bet]);

    return (
        <div className="flex flex-col h-full items-center justify-between w-full bg-gradient-to-b from-royal-bg via-royal-wood to-black overflow-hidden relative">
            {/* Ambient background effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.1)_0%,_transparent_50%)] pointer-events-none"></div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-royal-gold to-transparent opacity-50"></div>
            
            {/* Header with stats */}
            <div className="w-full px-4 py-2 flex justify-between items-center bg-black/30 backdrop-blur-sm border-b border-royal-gold/20">
              <div className="text-xs text-royal-gold/60">
                <span className="font-bold text-royal-gold">{totalWins}</span> total wins
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setAutoPlay(!autoPlay)}
                  disabled={spinning}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${autoPlay ? 'bg-royal-green text-white animate-pulse' : 'bg-royal-gold/20 text-royal-gold hover:bg-royal-gold/30'}`}
                >
                  AUTO
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 w-full relative z-10">
                {/* Main slot machine frame */}
                <div className="bg-gradient-to-b from-royal-wood via-[#4a2c1a] to-[#2d1409] p-1 rounded-2xl border-4 border-royal-gold shadow-[0_0_50px_rgba(212,175,55,0.3),inset_0_0_30px_rgba(0,0,0,0.5)] relative w-full max-w-md">
                    {/* Decorative top crown */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-6xl filter drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                      👑
                    </div>
                    
                    {/* Message banner */}
                    <div className={`mt-8 mb-2 mx-4 p-3 rounded-lg text-center font-bold tracking-widest uppercase text-sm border-2 transition-all duration-300 ${
                      bigWin 
                        ? 'bg-gradient-to-r from-royal-gold via-yellow-300 to-royal-gold text-black shadow-[0_0_30px_#d4af37] animate-pulse border-white' 
                        : 'bg-gradient-to-r from-royal-gold to-[#8a6e2f] text-black border-white/50'
                    }`}>
                      {bigWin && <Sparkles className="inline w-4 h-4 mr-1 animate-spin" />}
                      {message}
                      {bigWin && <Sparkles className="inline w-4 h-4 ml-1 animate-spin" />}
                    </div>
                    
                    {/* Reels area */}
                    <div className="flex gap-3 mb-4 mx-4 p-4 bg-gradient-to-b from-black via-gray-900 to-black rounded-xl border-2 border-royal-gold/50 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] justify-between">
                        {reels.map((s, i) => (
                            <Reel 
                              key={i} 
                              symbol={s} 
                              spinning={spinning} 
                              delay={i * 300}
                              isWinner={winningLines.includes(i)}
                            />
                        ))}
                    </div>
                    
                    {/* Paytable info */}
                    <div className="mx-4 mb-4 text-center text-[9px] md:text-[10px] text-royal-gold/60 font-lora leading-relaxed bg-black/40 p-2 rounded-lg border border-royal-gold/20">
                        <p className="font-bold text-royal-gold/80 mb-1 tracking-wider">PAYTABLE</p>
                        <div className="grid grid-cols-3 gap-1">
                          <span>👑 = 50x</span>
                          <span>7️⃣ = 20x</span>
                          <span>💎 = 10x</span>
                          <span>🔔 = 5x</span>
                          <span>🍋 = 3x</span>
                          <span>🍒 = 2x</span>
                        </div>
                        <p className="mt-1 text-[8px] text-royal-gold/40">Match 2 = 1.5x • Match 3 = Jackpot</p>
                    </div>
                </div>
                
                {/* Big Win Animation Overlay */}
                {bigWin && (
                  <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute text-2xl animate-ping"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 0.5}s`,
                          animationDuration: `${1 + Math.random()}s`
                        }}
                      >
                        {['⭐', '✨', '💎', '👑'][Math.floor(Math.random() * 4)]}
                      </div>
                    ))}
                  </div>
                )}
            </div>
            
            <BettingControls 
                balance={balance}
                currentBet={bet}
                onBetChange={setBet}
                onAction={spin}
                actionLabel={autoPlay ? "AUTO SPIN" : "SPIN"}
                isGameActive={spinning}
            />
        </div>
    );
};

export default SlotsGame;