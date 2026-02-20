import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Star, ArrowLeft, Trophy, Sparkles, Crown } from 'lucide-react';
import { hapticImpact, hapticNotification } from '../utils/haptics';

interface Prize {
  value: number;
  label: string;
  probability: number;
  isJackpot?: boolean;
}

interface WheelOfFortuneProps {
  onWin: (amount: number) => void;
  onWinJackpot: (amount: number) => void;
  onBack: () => void;
  jackpot: number;
}

const WheelOfFortune: React.FC<WheelOfFortuneProps> = ({ onWin, onWinJackpot, onBack, jackpot }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [message, setMessage] = useState("Fortune awaits, My Lord");
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [screenSize, setScreenSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  const rotationRef = useRef(0);

  const prizes: Prize[] = useMemo(() => [
    { value: 1000, label: '$1,000', probability: 0.15 },
    { value: 500, label: '$500', probability: 0.20 },
    { value: jackpot, label: 'JACKPOT', probability: 0.05, isJackpot: true },
    { value: 0, label: 'LOSE', probability: 0.22 },
    { value: 200, label: '$200', probability: 0.18 },
    { value: 10000, label: '$10,000', probability: 0.08 },
    { value: 2500, label: '$2,500', probability: 0.12 }
  ], [jackpot]);

  const sectorAngle = 360 / prizes.length;

  useEffect(() => {
    const handleResize = () => setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const spin = useCallback(() => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setLastWin(null);
    setMessage("Spinning the gears of destiny...");

    const stopIndex = (() => {
      const rand = Math.random();
      let cumulative = 0;
      for (let i = 0; i < prizes.length; i++) {
        cumulative += prizes[i].probability;
        if (rand <= cumulative) return i;
      }
      return prizes.length - 1;
    })();

    const extraSpins = 8 + Math.floor(Math.random() * 4);
    const targetRotation = (extraSpins * 360) - (stopIndex * sectorAngle);
    const finalRotation = rotationRef.current + targetRotation;
    
    // Simulate haptic ticks
    const tickInterval = setInterval(() => {
      hapticImpact('light');
    }, 150);

    setRotation(finalRotation);
    rotationRef.current = finalRotation;

    setTimeout(() => {
      clearInterval(tickInterval);
      const prize = prizes[stopIndex];
      const winAmount = prize.value;
      setIsSpinning(false);
      
      if (winAmount > 0) {
        setLastWin(winAmount);
        if (prize.isJackpot) {
          onWinJackpot(winAmount);
          setMessage(`👑 ROYAL JACKPOT! +$${winAmount.toLocaleString()} 👑`);
        } else {
          onWin(winAmount);
          setMessage(`VICTORY! +$${winAmount.toLocaleString()}`);
        }
        hapticNotification('success');
      } else {
        setMessage("Try again, Fortune is fickle.");
        hapticNotification('warning');
      }
    }, 5000);
  }, [isSpinning, prizes, onWin, onWinJackpot, sectorAngle]);

  const wheelSize = Math.min(screenSize.width * 0.85, screenSize.height * 0.45, 400);

  return (
    <div className="fixed inset-0 bg-om-black flex flex-col items-center justify-between p-6 z-[100] font-sans overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#3d0a14_0%,_transparent_70%)] opacity-30 pointer-events-none" />

      <div className="w-full flex justify-between items-center z-20 pt-safe">
        <button onClick={onBack} disabled={isSpinning} className="p-3 bg-white/5 rounded-full border border-white/10 text-om-gold disabled:opacity-20 active:scale-90">
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
             <span className="font-bold text-om-gold text-[10px] tracking-[0.4em] uppercase">The Vault</span>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full">
        <div className="text-center z-10">
            <h2 className="text-3xl font-black gold-text tracking-widest uppercase mb-1">Grand Wheel</h2>
            <div className="bg-om-gold/5 px-4 py-1 rounded-full border border-om-gold/20 inline-block mb-2">
                <span className="text-[10px] text-om-gold font-bold uppercase tracking-[0.3em]">Mega Prize: ${jackpot.toLocaleString()}</span>
            </div>
            <p className="text-om-cream/50 text-sm h-6 font-medium italic">{message}</p>
        </div>

        <div className="relative flex items-center justify-center" style={{ width: wheelSize, height: wheelSize }}>
          {/* Indicator */}
          <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 z-[60] drop-shadow-2xl">
             <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-transparent border-t-om-cream" />
          </div>

          {/* Main Wheel */}
          <div 
            className="w-full h-full rounded-full border-[12px] border-om-mahogany shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden transition-transform duration-[5s] ease-out"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <div 
              className="absolute inset-0"
              style={{ 
                background: `conic-gradient(${prizes.map((p, i) => {
                  let color = i % 2 === 0 ? '#1a0d10' : '#0d1a12';
                  if (p.isJackpot) color = '#c5a059'; // Golden for jackpot
                  return `${color} ${i * sectorAngle}deg ${(i + 1) * sectorAngle}deg`;
                }).join(', ')})`
              }} 
            />

            {prizes.map((p, i) => (
              <div 
                key={i}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full flex items-start pt-6 font-black tracking-widest ${p.isJackpot ? 'text-black' : 'text-om-gold'}`}
                style={{ transform: `translate(-50%, -50%) rotate(${i * sectorAngle + sectorAngle/2}deg)` }}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[9px] uppercase">{p.label}</span>
                  {p.isJackpot && <Crown size={12} />}
                </div>
              </div>
            ))}
            
            {/* Sector lines */}
            <div className="absolute inset-0 opacity-10" 
                 style={{ background: `repeating-conic-gradient(from 0deg, transparent 0deg ${sectorAngle - 0.5}deg, #fff ${sectorAngle - 0.5}deg ${sectorAngle}deg)` }} 
            />
          </div>

          {/* Spin Button */}
          <button 
            onClick={spin}
            disabled={isSpinning}
            className={`absolute inset-0 m-auto w-24 h-24 rounded-full z-[70] shadow-[0_0_30px_black] flex items-center justify-center border-4 border-om-gold transition-all active:scale-90 ${
              isSpinning ? 'bg-black/80 scale-95 opacity-50' : 'bg-om-mahogany animate-pulse'
            }`}
          >
            <div className="flex flex-col items-center">
                <Star className={`text-om-gold ${isSpinning ? 'animate-spin' : ''}`} size={32} />
                {!isSpinning && <span className="text-[10px] font-black text-om-gold mt-1 tracking-tighter">SPIN</span>}
            </div>
          </button>
        </div>

        <div className={`transition-all duration-700 h-16 flex items-center ${lastWin !== null ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
            {lastWin !== null && (
                <div className="bg-om-gold/10 border border-om-gold/30 px-8 py-3 rounded-sm flex items-center gap-4 shadow-gold-glow">
                    <Trophy className="text-om-gold" size={24} />
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] text-om-gold uppercase font-bold tracking-[0.2em]">Acquired Assets</span>
                      <span className="text-om-cream font-black text-xl tracking-tight">+$${lastWin.toLocaleString()}</span>
                    </div>
                </div>
            )}
        </div>
      </div>

      <div className="pb-safe shrink-0 text-center opacity-30">
          <p className="text-[9px] font-bold text-white uppercase tracking-[0.5em]">The Residency Private Access</p>
      </div>
    </div>
  );
};

export default WheelOfFortune;