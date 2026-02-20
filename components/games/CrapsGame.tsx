import React, { useState, useCallback } from 'react';
import BettingControls from '../shared/BettingControls';

interface Props { balance: number; onUpdateBalance: (d: number) => void; }

const Dice3D: React.FC<{ value: number; rolling: boolean }> = ({ value, rolling }) => {
  const rotations: Record<number, string> = {
    1: 'rotateX(0deg) rotateY(0deg)',
    2: 'rotateX(-90deg) rotateY(0deg)',
    3: 'rotateX(0deg) rotateY(-90deg)',
    4: 'rotateX(0deg) rotateY(90deg)',
    5: 'rotateX(90deg) rotateY(0deg)',
    6: 'rotateX(180deg) rotateY(0deg)',
  };

  // Адаптивный размер кубика: 10vmin ограничивает размер относительно меньшей стороны экрана
  const diceSize = "min(50px, 12vw)";

  return (
    <div className={`dice-wrapper ${rolling ? 'dice-jumping' : ''}`} style={{ width: diceSize, height: diceSize }}>
      <div 
        className={`dice-cube ${rolling ? 'dice-rolling' : ''}`}
        style={{ transform: !rolling ? rotations[value] : undefined }}
      >
        <div className="face front"><span></span></div>
        <div className="face back"><span></span><span></span><span></span><span></span><span></span><span></span></div>
        <div className="face right"><span></span><span></span><span></span></div>
        <div className="face left"><span></span><span></span><span></span><span></span></div>
        <div className="face top"><span></span><span></span></div>
        <div className="face bottom"><span></span><span></span><span></span><span></span><span></span></div>
      </div>
      <div className={`dice-shadow ${rolling ? 'shadow-pulse' : ''}`}></div>
      <style>{`
        .dice-wrapper {
          position: relative;
          perspective: 1000px;
        }
        .dice-cube {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1.2);
        }
        .face {
          position: absolute;
          width: 100%;
          height: 100%;
          background: #fdfbf7;
          border: 1px solid #d4af3733;
          border-radius: 4px;
          display: grid;
          padding: 15%;
          gap: 5%;
          box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
        }
        .face span {
          display: block;
          width: 100%;
          height: 100%;
          max-width: 8px;
          max-height: 8px;
          background: #1a1a1a;
          border-radius: 50%;
          align-self: center;
          justify-self: center;
        }
        /* Translate based on diceSize */
        .front  { transform: rotateY(0deg) translateZ(calc(${diceSize} / 2)); }
        .back   { transform: rotateY(180deg) translateZ(calc(${diceSize} / 2)); }
        .right  { transform: rotateY(90deg) translateZ(calc(${diceSize} / 2)); }
        .left   { transform: rotateY(-90deg) translateZ(calc(${diceSize} / 2)); }
        .top    { transform: rotateX(90deg) translateZ(calc(${diceSize} / 2)); }
        .bottom { transform: rotateX(-90deg) translateZ(calc(${diceSize} / 2)); }

        .front { grid-template-areas: ". . ." ". a ." ". . ."; }
        .front span { grid-area: a; }
        .top { grid-template-columns: repeat(3, 1fr); }
        .top span:nth-child(1) { grid-column: 1; grid-row: 1; }
        .top span:nth-child(2) { grid-column: 3; grid-row: 3; }
        .right { grid-template-columns: repeat(3, 1fr); }
        .right span:nth-child(1) { grid-column: 1; grid-row: 1; }
        .right span:nth-child(2) { grid-column: 2; grid-row: 2; }
        .right span:nth-child(3) { grid-column: 3; grid-row: 3; }
        .left { grid-template-columns: repeat(2, 1fr); }
        .bottom { grid-template-columns: repeat(3, 1fr); }
        .back { grid-template-columns: repeat(2, 1fr); }

        @keyframes rolling {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(720deg) rotateY(1080deg) rotateZ(360deg); }
        }
        .dice-rolling { animation: rolling 0.5s linear infinite; }
        @keyframes jump {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-40px) scale(1.1); }
        }
        .dice-jumping { animation: jump 0.6s ease-in-out infinite; }
        .dice-shadow {
          position: absolute;
          bottom: -10px;
          left: 10%;
          width: 80%;
          height: 4px;
          background: rgba(0,0,0,0.4);
          border-radius: 50%;
          filter: blur(2px);
        }
        @keyframes shadow-pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(0.6); opacity: 0.1; }
        }
        .shadow-pulse { animation: shadow-pulse 0.6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

const CrapsGame: React.FC<Props> = ({ balance, onUpdateBalance }) => {
    const [point, setPoint] = useState<number | null>(null);
    const [bet, setBet] = useState(10);
    const [dice, setDice] = useState([1, 1]);
    const [rolling, setRolling] = useState(false);
    const [message, setMessage] = useState("Place your bet");

    const roll = useCallback(() => {
        if (rolling) return;
        if (balance < bet) { setMessage("Low Balance"); return; }
        if (point === null) onUpdateBalance(-bet);
        
        setRolling(true);
        setMessage("Rolling...");

        setTimeout(() => {
            const d1 = Math.ceil(Math.random() * 6);
            const d2 = Math.ceil(Math.random() * 6);
            setDice([d1, d2]);
            setRolling(false);
            const total = d1 + d2;
            
            if (point === null) {
                if (total === 7 || total === 11) { onUpdateBalance(bet * 2); setMessage(`NATURAL ${total}!`); }
                else if (total === 2 || total === 3 || total === 12) { setMessage(`CRAPS ${total}`); }
                else { setPoint(total); setMessage(`Point is ${total}`); }
            } else {
                if (total === point) { onUpdateBalance(bet * 2); setMessage(`WIN ${total}!`); setPoint(null); }
                else if (total === 7) { setMessage("SEVEN OUT"); setPoint(null); }
                else { setMessage(`Rolled ${total}`); }
            }
        }, 1800);
    }, [rolling, balance, bet, point, onUpdateBalance]);

    return (
        <div className="flex flex-col h-full w-full bg-om-chocolate overflow-hidden relative">
             <div className="absolute inset-0 bg-felt-texture opacity-10 pointer-events-none" />
             
             {/* Dynamic Layout Area */}
             <div className="flex-1 min-h-0 flex flex-col items-center justify-center w-full px-4 relative">
                
                {/* Board Tray - Using vh for vertical safety */}
                <div className="w-full max-w-sm h-[35vh] bg-om-emerald/20 border-8 border-om-mahogany rounded-3xl shadow-inner flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.5)_100%)]"></div>
                    <div className="flex gap-8 sm:gap-16 relative z-10">
                        <Dice3D value={dice[0]} rolling={rolling} />
                        <Dice3D value={dice[1]} rolling={rolling} />
                    </div>
                </div>

                <div className="mt-6 text-center z-20">
                    <h2 className="text-xl font-cinzel text-royal-gold uppercase tracking-widest">{message}</h2>
                    {point !== null && (
                        <div className="mt-2 text-sm font-bold text-om-cream bg-black/40 px-4 py-1 rounded-full border border-royal-gold/20">
                            TARGET: {point}
                        </div>
                    )}
                </div>
             </div>

             <BettingControls 
                balance={balance}
                currentBet={bet}
                onBetChange={setBet}
                onAction={roll}
                actionLabel={rolling ? "ROLLING..." : "ROLL"}
                isGameActive={rolling} 
             />
        </div>
    );
};

export default CrapsGame;