
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Rocket as RocketIcon, AlertTriangle } from 'lucide-react';
import BettingControls from '../shared/BettingControls';

interface Props {
  balance: number;
  onUpdateBalance: (delta: number) => void;
}

type GameState = 'IDLE' | 'COUNTDOWN' | 'FLYING' | 'CRASHED' | 'CASHED_OUT';

const RocketGame: React.FC<Props> = ({ balance, onUpdateBalance }) => {
  const [status, setStatus] = useState<GameState>('IDLE');
  const [multiplier, setMultiplier] = useState(1);
  const [bet, setBet] = useState(10);
  const [crashPoint, setCrashPoint] = useState(0);
  const [countDown, setCountDown] = useState(3);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const updateCanvasSize = useCallback(() => {
    if (containerRef.current && canvasRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvasRef.current.width = width * dpr;
      canvasRef.current.height = height * dpr;
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
      canvasRef.current.style.width = `${width}px`;
      canvasRef.current.style.height = `${height}px`;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [updateCanvasSize]);

  const placeBet = () => {
    if (balance < bet || bet <= 0) return;
    onUpdateBalance(-bet);
    // Crash points follow a power law distribution for a real "crash" feel
    const random = Math.random();
    const cp = 0.99 / (1 - random);
    setCrashPoint(Math.max(1.01, Math.min(cp, 50))); 
    
    setMultiplier(1);
    setCountDown(3);
    setStatus('COUNTDOWN');
    if (canvasRef.current && containerRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        const { width, height } = containerRef.current.getBoundingClientRect();
        ctx?.clearRect(0, 0, width, height);
    }
  };

  const cashOut = () => {
    if (status !== 'FLYING') return;
    cancelAnimationFrame(requestRef.current);
    const win = Math.floor(bet * multiplier);
    onUpdateBalance(win);
    setStatus('CASHED_OUT');
  };

  useEffect(() => {
    if (status === 'COUNTDOWN') {
      if (countDown > 0) {
        const t = setTimeout(() => setCountDown(c => c - 1), 1000);
        return () => clearTimeout(t);
      } else {
        setStatus('FLYING');
        startTimeRef.current = performance.now();
        startAnimation();
      }
    }
  }, [status, countDown]);

  const startAnimation = () => {
    const animate = (time: number) => {
      const elapsed = (time - startTimeRef.current) / 1000;
      // Multiplier increases exponentially
      const nextMult = 1 * Math.pow(Math.E, 0.06 * elapsed);

      if (nextMult >= crashPoint) {
        setMultiplier(crashPoint);
        setStatus('CRASHED');
        cancelAnimationFrame(requestRef.current);
        return;
      }

      setMultiplier(nextMult);
      drawScene(nextMult, elapsed);
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
  };

  const drawScene = (currentMult: number, elapsed: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width: w, height: h } = containerRef.current.getBoundingClientRect();
    ctx.clearRect(0, 0, w, h);

    const paddingX = w * 0.1;
    const paddingY = h * 0.15;
    
    const x = Math.min(w - paddingX, elapsed * (w * 0.12));
    const y = h - Math.min(h - paddingY, (currentMult - 1) * (h * 0.5));

    // Grid
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < w; i += w/10) { ctx.moveTo(i, 0); ctx.lineTo(i, h); }
    for (let i = 0; i < h; i += h/8) { ctx.moveTo(0, i); ctx.lineTo(w, i); }
    ctx.stroke();

    // Trajectory Path
    const gradient = ctx.createLinearGradient(x, y, 0, h);
    gradient.addColorStop(0, 'rgba(212, 175, 55, 0.3)');
    gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
    
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.quadraticCurveTo(x / 2, h, x, y);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.lineTo(x, h);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Rocket Exhaust (Fire)
    const fireSize = 10 + Math.random() * 10;
    ctx.beginPath();
    const fireGrad = ctx.createRadialGradient(x, y, 0, x, y, fireSize);
    fireGrad.addColorStop(0, '#ff4500');
    fireGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = fireGrad;
    ctx.arc(x, y, fireSize, 0, Math.PI * 2);
    ctx.fill();

    // Rocket Icon
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.atan2(- (h - y), x) + Math.PI / 4);
    
    // Draw a stylized rocket shape
    ctx.fillStyle = '#fdfbf7';
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(8, 5);
    ctx.lineTo(-8, 5);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(-8, 5, 16, 4);
    
    ctx.restore();
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-royal-bg text-royal-ivory">
      <div ref={containerRef} className="flex-1 relative flex items-center justify-center overflow-hidden w-full bg-[#050505]">
        <canvas ref={canvasRef} className="absolute inset-0 block" />
        
        <div className="z-10 text-center pointer-events-none select-none">
            {status === 'COUNTDOWN' && (
               <div className="font-cinzel font-black text-royal-gold animate-pulse text-[clamp(4rem,20vw,10rem)] drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                   {countDown}
               </div>
            )}
            {(status === 'FLYING' || status === 'CASHED_OUT') && (
               <div className={`font-black tracking-tight text-[clamp(4rem,15vw,8rem)] leading-none tabular-nums ${
                 status === 'CASHED_OUT' ? 'text-green-500' : 'text-royal-gold'
               }`}>
                 {multiplier.toFixed(2)}x
               </div>
            )}
             {status === 'CRASHED' && (
               <div className="flex flex-col items-center animate-fade-in">
                  <AlertTriangle className="text-red-600 w-16 h-16 mb-4" />
                  <div className="font-cinzel font-black text-red-600 text-[clamp(2.5rem,10vw,5rem)]">CRASHED</div>
                  <div className="text-royal-gold text-2xl font-bold">FINAL: {multiplier.toFixed(2)}x</div>
               </div>
            )}
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 opacity-30">
           <RocketIcon size={16} className="text-royal-gold" />
           <span className="text-[10px] font-bold uppercase tracking-widest">Orbital Trajectory Engaged</span>
        </div>
      </div>

      {status === 'IDLE' || status === 'CRASHED' || status === 'CASHED_OUT' ? (
          <BettingControls 
            balance={balance}
            currentBet={bet}
            onBetChange={setBet}
            onAction={placeBet}
            actionLabel="LAUNCH ROCKET"
          />
      ) : (
         <div className="w-full bg-black/90 border-t border-royal-gold/20 p-4 pb-safe z-40 shadow-[0_-20px_40px_rgba(0,0,0,1)]">
            <button 
                onClick={cashOut} 
                className="w-full py-5 bg-gradient-to-r from-green-700 to-green-500 text-white font-black text-xl rounded-sm shadow-gold-glow active:scale-95 transition-all border border-white/20 uppercase tracking-widest"
            >
                CASH OUT ${(bet * multiplier).toFixed(0)}
            </button>
         </div>
      )}
    </div>
  );
};

export default RocketGame;
