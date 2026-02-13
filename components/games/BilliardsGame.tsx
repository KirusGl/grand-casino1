
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Target, Trophy, Info, RotateCcw } from 'lucide-react';
import { hapticImpact, hapticNotification } from '../../utils/haptics';

// --- Old Money VIP Constants ---
const COLORS = {
  mahogany: '#2c1e14',
  emerald: '#062d1f', 
  burgundy: '#4a0e1c',
  gold: '#d4af37',
  brass: '#b38728',
  ivory: '#fdfbf7',
  black: '#0a0a0a',
};

const BALL_RADIUS = 10;
const FRICTION = 0.985;
const WALL_BOUNCE = 0.7;
const MIN_SPEED = 0.1;

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  id: number;
  potted: boolean;
}

interface Props {
  balance: number;
  onUpdateBalance: (delta: number) => void;
}

const BilliardsGame: React.FC<Props> = ({ balance, onUpdateBalance }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [cueBall, setCueBall] = useState<Ball | null>(null);
  const [isAiming, setIsAiming] = useState(false);
  const [aimPoint, setAimPoint] = useState({ x: 0, y: 0 });
  const [power, setPower] = useState(0);
  const [score, setScore] = useState(0);
  const [bet, setBet] = useState(50);
  const [isMoving, setIsMoving] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize balls
  const initTable = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const { width, height } = container.getBoundingClientRect();

    const newBalls: Ball[] = [];
    const centerX = width * 0.7;
    const centerY = height / 2;
    const spacing = BALL_RADIUS * 2.1;

    // Triangle formation (15 balls)
    let idCounter = 1;
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col <= row; col++) {
        newBalls.push({
          id: idCounter++,
          x: centerX + row * spacing * 0.86,
          y: centerY - (row * spacing) / 2 + col * spacing,
          vx: 0,
          vy: 0,
          color: idCounter === 8 ? COLORS.black : (idCounter % 2 === 0 ? COLORS.burgundy : COLORS.gold),
          potted: false,
        });
      }
    }

    const cue: Ball = {
      id: 0,
      x: width * 0.25,
      y: height / 2,
      vx: 0,
      vy: 0,
      color: COLORS.ivory,
      potted: false,
    };

    setBalls(newBalls);
    setCueBall(cue);
    setIsMoving(false);
    setScore(0);
    setGameStarted(true);
  }, []);

  useEffect(() => {
    initTable();
  }, [initTable]);

  // Physics Loop
  useEffect(() => {
    let animationId: number;

    const update = () => {
      if (!gameStarted || !cueBall) return;

      const container = containerRef.current;
      if (!container) return;
      const { width, height } = container.getBoundingClientRect();
      const pockets = [
        { x: 0, y: 0 }, { x: width / 2, y: 0 }, { x: width, y: 0 },
        { x: 0, y: height }, { x: width / 2, y: height }, { x: width, y: height }
      ];

      let moving = false;
      const allBalls = [cueBall, ...balls].filter(b => !b.potted);

      // Move & Friction
      allBalls.forEach(b => {
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= FRICTION;
        b.vy *= FRICTION;

        if (Math.abs(b.vx) < MIN_SPEED) b.vx = 0;
        if (Math.abs(b.vy) < MIN_SPEED) b.vy = 0;
        if (b.vx !== 0 || b.vy !== 0) moving = true;

        // Wall collisions
        if (b.x - BALL_RADIUS < 0 || b.x + BALL_RADIUS > width) {
          b.vx *= -WALL_BOUNCE;
          b.x = b.x < BALL_RADIUS ? BALL_RADIUS : width - BALL_RADIUS;
          hapticImpact('light');
        }
        if (b.y - BALL_RADIUS < 0 || b.y + BALL_RADIUS > height) {
          b.vy *= -WALL_BOUNCE;
          b.y = b.y < BALL_RADIUS ? BALL_RADIUS : height - BALL_RADIUS;
          hapticImpact('light');
        }

        // Pocket check
        pockets.forEach(p => {
          const dist = Math.sqrt((b.x - p.x) ** 2 + (b.y - p.y) ** 2);
          if (dist < BALL_RADIUS * 2) {
            b.potted = true;
            b.vx = 0;
            b.vy = 0;
            if (b.id !== 0) {
              setScore(s => s + 1);
              onUpdateBalance(bet * 0.5); // Reward per ball
              hapticNotification('success');
            } else {
              // Scratch
              b.x = width * 0.25;
              b.y = height / 2;
              b.potted = false;
              onUpdateBalance(-bet * 0.2);
              hapticNotification('warning');
            }
          }
        });
      });

      // Ball-Ball Collisions
      for (let i = 0; i < allBalls.length; i++) {
        for (let j = i + 1; j < allBalls.length; j++) {
          const b1 = allBalls[i];
          const b2 = allBalls[j];
          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < BALL_RADIUS * 2) {
            hapticImpact('medium');
            // Elastic collision simplified
            const angle = Math.atan2(dy, dx);
            const targetX = b1.x + Math.cos(angle) * BALL_RADIUS * 2;
            const targetY = b1.y + Math.sin(angle) * BALL_RADIUS * 2;
            const ax = (targetX - b2.x) * 0.5;
            const ay = (targetY - b2.y) * 0.5;

            b1.vx -= ax;
            b1.vy -= ay;
            b2.vx += ax;
            b2.vy += ay;
          }
        }
      }

      setIsMoving(moving);
      draw();
      animationId = requestAnimationFrame(update);
    };

    const draw = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container || !cueBall) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height } = container.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      // Draw Pockets
      ctx.fillStyle = COLORS.black;
      [
        { x: 0, y: 0 }, { x: width / 2, y: 0 }, { x: width, y: 0 },
        { x: 0, y: height }, { x: width / 2, y: height }, { x: width, y: height }
      ].forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, BALL_RADIUS * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = COLORS.brass;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw Aim Line
      if (isAiming && !isMoving) {
        ctx.beginPath();
        ctx.moveTo(cueBall.x, cueBall.y);
        ctx.lineTo(aimPoint.x, aimPoint.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Cue stick
        const dx = cueBall.x - aimPoint.x;
        const dy = cueBall.y - aimPoint.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const stickLength = 200;
        const stickOffset = 20 + power * 0.5;
        
        ctx.save();
        ctx.translate(cueBall.x, cueBall.y);
        ctx.rotate(Math.atan2(dy, dx));
        
        // Mahogany stick body
        ctx.fillStyle = COLORS.mahogany;
        ctx.fillRect(stickOffset, -3, stickLength, 6);
        // Brass tip
        ctx.fillStyle = COLORS.brass;
        ctx.fillRect(stickOffset, -3, 10, 6);
        // Gold inlay
        ctx.strokeStyle = COLORS.gold;
        ctx.lineWidth = 1;
        ctx.strokeRect(stickOffset + 20, -2, stickLength - 40, 4);
        
        ctx.restore();
      }

      // Draw Balls
      [cueBall, ...balls].filter(b => !b.potted).forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        
        // Shiny highlight
        const grad = ctx.createRadialGradient(b.x - 3, b.y - 3, 1, b.x, b.y, BALL_RADIUS);
        grad.addColorStop(0, 'white');
        grad.addColorStop(0.2, b.color);
        grad.addColorStop(1, 'rgba(0,0,0,0.5)');
        ctx.fillStyle = grad;
        
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.stroke();

        // Number for non-cue balls
        if (b.id !== 0) {
            ctx.fillStyle = b.color === COLORS.ivory || b.color === COLORS.gold ? 'black' : 'white';
            ctx.font = 'bold 8px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            // ctx.fillText(b.id.toString(), b.x, b.y);
        }
      });
    };

    animationId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationId);
  }, [gameStarted, balls, cueBall, isAiming, aimPoint, power, isMoving]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isMoving || !cueBall) return;
    setIsAiming(true);
    updateAim(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isAiming) updateAim(e);
  };

  const updateAim = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !cueBall) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setAimPoint({ x, y });
    
    const dist = Math.sqrt((x - cueBall.x) ** 2 + (y - cueBall.y) ** 2);
    setPower(Math.min(dist, 150));
  };

  const handlePointerUp = () => {
    if (!isAiming || !cueBall) return;
    setIsAiming(false);

    const dx = aimPoint.x - cueBall.x;
    const dy = aimPoint.y - cueBall.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > 5) {
        const strength = Math.min(dist, 150) / 10;
        cueBall.vx = -dx / dist * strength;
        cueBall.vy = -dy / dist * strength;
        hapticImpact('heavy');
        onUpdateBalance(-bet * 0.1); // Small cost per shot
    }
    setPower(0);
  };

  return (
    <div className="flex flex-col h-full w-full bg-om-chocolate overflow-hidden relative">
      <div className="absolute inset-0 bg-herringbone opacity-10 pointer-events-none" />
      
      {/* HUD */}
      <div className="z-10 px-6 py-4 flex justify-between items-center bg-black/40 border-b border-om-brass/20 backdrop-blur-md">
          <div className="flex items-center gap-3">
              <div className="p-2 bg-om-emerald/40 rounded-sm border border-om-brass/30">
                  <Target size={20} className="text-om-gold" />
              </div>
              <div>
                  <div className="text-[10px] font-cinzel text-om-brass tracking-widest uppercase">Pocketed</div>
                  <div className="font-playfair text-xl text-om-cream italic">{score} <span className="text-xs opacity-40">/ 15</span></div>
              </div>
          </div>
          
          <div className="flex flex-col items-end">
             <div className="text-[10px] font-cinzel text-om-brass tracking-widest uppercase">Member Stakes</div>
             <div className="font-playfair text-xl text-om-gold font-bold">${(score * bet * 0.5).toLocaleString()}</div>
          </div>
      </div>

      {/* Table Container */}
      <div 
        ref={containerRef}
        className="flex-1 m-4 rounded-xl relative border-[16px] border-om-mahogany shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_20px_black] bg-om-matte-green overflow-hidden cursor-crosshair touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="absolute inset-0 bg-felt-texture opacity-30 pointer-events-none" />
        <canvas 
          ref={canvasRef} 
          width={window.innerWidth} 
          height={window.innerHeight} 
          className="absolute inset-0 w-full h-full"
        />
        
        {/* Diamond markers */}
        {[0.25, 0.5, 0.75].map(p => (
            <React.Fragment key={p}>
                <div className="absolute top-[-10px] w-1 h-1 bg-om-gold/30 rounded-full" style={{ left: `${p * 100}%` }} />
                <div className="absolute bottom-[-10px] w-1 h-1 bg-om-gold/30 rounded-full" style={{ left: `${p * 100}%` }} />
            </React.Fragment>
        ))}
      </div>

      {/* Controls Overlay */}
      <div className="px-6 pb-safe mb-4 flex justify-between items-center z-20">
          <div className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/5 rounded-full text-[10px] text-om-cream/50 font-lora italic">
              <Info size={12} className="text-om-brass" />
              Pull cue to aim and shoot for profit
          </div>
          
          <button 
            onClick={() => { hapticImpact('medium'); initTable(); }}
            className="p-3 bg-om-mahogany/80 border border-om-brass/20 rounded-full text-om-gold hover:bg-om-brass/10 active:scale-90 transition-all shadow-xl"
          >
            <RotateCcw size={20} />
          </button>
      </div>

      {/* Win Modal (Mock) */}
      {score === 15 && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fade-in">
           <div className="text-center p-8 border border-om-gold/30 bg-om-mahogany rounded-sm shadow-soft-lamp">
              <Trophy size={60} className="text-om-gold mx-auto mb-4" />
              <h2 className="text-3xl font-cinzel text-om-gold mb-2">TABLE CLEARED</h2>
              <p className="font-cormorant text-om-cream/60 italic text-xl mb-8">An impeccable performance, My Lord.</p>
              <button 
                onClick={initTable}
                className="px-12 py-4 bg-om-matte-green border border-om-brass text-om-gold font-cinzel tracking-[0.3em] font-bold"
              >
                NEW TABLE
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default BilliardsGame;
