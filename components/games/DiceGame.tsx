
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

  const diceSize = "min(60px, 15vw)";

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
        .dice-wrapper { position: relative; perspective: 1000px; }
        .dice-cube { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1.2); }
        .face { position: absolute; width: 100%; height: 100%; background: #fdfbf7; border: 1px solid #d4af3733; border-radius: 8px; display: grid; padding: 15%; gap: 5%; box-shadow: inset 0 0 10px rgba(0,0,0,0.1); }
        .face span { display: block; width: 100%; height: 100%; max-width: 10px; max-height: 10px; background: #1a1a1a; border-radius: 50%; align-self: center; justify-self: center; }
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
        .left { grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, 1fr); }
        .bottom { grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); }
        .bottom span:nth-child(1) { grid-column: 1; grid-row: 1; }
        .bottom span:nth-child(2) { grid-column: 3; grid-row: 1; }
        .bottom span:nth-child(3) { grid-column: 2; grid-row: 2; }
        .bottom span:nth-child(4) { grid-column: 1; grid-row: 3; }
        .bottom span:nth-child(5) { grid-column: 3; grid-row: 3; }
        .back { grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(3, 1fr); }

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
        .dice-shadow { position: absolute; bottom: -15px; left: 10%; width: 80%; height: 6px; background: rgba(0,0,0,0.5); border-radius: 50%; filter: blur(3px); }
        @keyframes shadow-pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(0.6); opacity: 0.2; }
        }
        .shadow-pulse { animation: shadow-pulse 0.6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

const DiceGame: React.FC<Props> = ({ balance, onUpdateBalance }) => {
  const [point, setPoint] = useState<number | null>(null);
  const [bet, setBet] = useState(100);
  const [dice, setDice] = useState([1, 1]);
  const [rolling, setRolling] = useState(false);
  const [message, setMessage] = useState("Place your bet");

  const roll = useCallback(() => {
    if (rolling) return;
    if (balance < bet) {
      setMessage("Low Balance");
      return;
    }
    
    // Deduct bet if new round
    if (point === null) onUpdateBalance(-bet);
    
    setRolling(true);
    setMessage("The bones are cast...");

    setTimeout(() => {
      const d1 = Math.ceil(Math.random() * 6);
      const d2 = Math.ceil(Math.random() * 6);
      setDice([d1, d2]);
      setRolling(false);
      const total = d1 + d2;
      
      if (point === null) {
        if (total === 7 || total === 11) {
          onUpdateBalance(bet * 2);
          setMessage(`NATURAL ${total}! You Win!`);
        } else if (total === 2 || total === 3 || total === 12) {
          setMessage(`CRAPS ${total}. House Wins.`);
        } else {
          setPoint(total);
          setMessage(`Point is ${total}. Roll again!`);
        }
      } else {
        if (total === point) {
          onUpdateBalance(bet * 2);
          setMessage(`MATCHED ${total}! You Win!`);
          setPoint(null);
        } else if (total === 7) {
          setMessage("SEVEN OUT. House Wins.");
          setPoint(null);
        } else {
          setMessage(`Rolled ${total}. Target is ${point}.`);
        }
      }
    }, 1800);
  }, [rolling, balance, bet, point, onUpdateBalance]);

  return (
    <div className="flex flex-col h-full w-full bg-om-chocolate overflow-hidden relative">
      <div className="absolute inset-0 bg-felt-texture opacity-10 pointer-events-none" />
      
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center w-full px-4 relative">
        <div className="w-full max-w-sm h-[40vh] bg-om-emerald/30 border-[12px] border-om-mahogany rounded-[40px] shadow-[inset_0_0_40px_rgba(0,0,0,0.8),0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.6)_100%)]"></div>
          <div className="flex gap-12 sm:gap-20 relative z-10">
            <Dice3D value={dice[0]} rolling={rolling} />
            <Dice3D value={dice[1]} rolling={rolling} />
          </div>
        </div>

        <div className="mt-8 text-center z-20">
          <h2 className="text-2xl font-cinzel text-royal-gold uppercase tracking-widest drop-shadow-md">{message}</h2>
          {point !== null && (
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-om-cream bg-black/60 px-6 py-2 rounded-full border border-royal-gold/30 shadow-xl">
              <span className="text-royal-gold/60 uppercase tracking-widest text-[10px]">Target</span>
              <span className="text-lg font-cinzel">{point}</span>
            </div>
          )}
        </div>
      </div>

      <BettingControls 
        balance={balance}
        currentBet={bet}
        onBetChange={setBet}
        onAction={roll}
        actionLabel={rolling ? "ROLLING..." : "ROLL DICE"}
        isGameActive={rolling} 
      />
    </div>
  );
};

export default DiceGame;
