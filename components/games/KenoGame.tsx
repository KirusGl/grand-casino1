import React, { useState } from 'react';
import BettingControls from '../shared/BettingControls';

interface Props { balance: number; onUpdateBalance: (d: number) => void; }

const KenoGame: React.FC<Props> = ({ balance, onUpdateBalance }) => {
    const [selected, setSelected] = useState<number[]>([]);
    const [drawn, setDrawn] = useState<number[]>([]);
    const [playing, setPlaying] = useState(false);
    const [bet, setBet] = useState(10);
    const [message, setMessage] = useState("Pick up to 10 numbers");

    const toggleNum = (n: number) => {
        if (playing) return;
        if (selected.includes(n)) setSelected(selected.filter(x => x !== n));
        else if (selected.length < 10) setSelected([...selected, n]);
    };

    const play = () => {
        if (selected.length === 0) { setMessage("Pick numbers first"); return; }
        if (balance < bet) { setMessage("Low Balance"); return; }
        onUpdateBalance(-bet);
        setPlaying(true);
        setDrawn([]);
        setMessage("Drawing...");

        const drawSequence: number[] = [];
        const pool = Array.from({length: 80}, (_, i) => i + 1);
        
        for(let i=0; i<20; i++) {
            const idx = Math.floor(Math.random() * pool.length);
            drawSequence.push(pool.splice(idx, 1)[0]);
        }

        let i = 0;
        const interval = setInterval(() => {
            setDrawn(prev => [...prev, drawSequence[i]]);
            i++;
            if (i >= 20) {
                clearInterval(interval);
                finish(drawSequence);
            }
        }, 100);
    };

    const finish = (finalDrawn: number[]) => {
        const matches = selected.filter(s => finalDrawn.includes(s)).length;
        let mult = 0;
        // Simple simplified payout for demo
        if (matches >= 3) mult = 1;
        if (matches >= 5) mult = 5;
        if (matches >= 8) mult = 50;
        if (matches === 10) mult = 500;
        
        const win = bet * mult;
        setPlaying(false);
        if (win > 0) {
            onUpdateBalance(win);
            setMessage(`Matched ${matches}! Won ${win}`);
        } else {
            setMessage(`Matched ${matches}. Try again.`);
        }
    };

    return (
        <div className="flex flex-col h-full items-center justify-between w-full bg-royal-bg overflow-hidden relative">
            <div className="w-full text-center py-2 z-10">
                 <h2 className="text-xl font-playfair text-royal-gold">{message}</h2>
                 <div className="text-[10px] text-royal-gold/50 font-mono">Selected: {selected.length}/10</div>
            </div>
            
            <div className="flex-1 w-full p-2 flex items-center justify-center">
                <div className="grid grid-cols-10 gap-1 w-full max-w-md aspect-[4/5]">
                    {Array.from({length: 80}, (_, i) => i + 1).map(n => {
                        const isSelected = selected.includes(n);
                        const isDrawn = drawn.includes(n);
                        const isHit = isSelected && isDrawn;
                        
                        return (
                            <button 
                                key={n} 
                                onClick={() => toggleNum(n)}
                                disabled={playing}
                                className={`
                                    rounded-sm flex items-center justify-center text-[10px] md:text-xs font-bold transition-all
                                    ${isHit ? 'bg-royal-gold text-black shadow-[0_0_10px_#d4af37] z-10 scale-110' : 
                                      isDrawn ? 'bg-royal-red/40 text-royal-ivory/50' : 
                                      isSelected ? 'bg-royal-green text-white border border-white/50' : 
                                      'bg-royal-wood/50 text-royal-ivory/30 hover:bg-royal-wood'}
                                `}
                            >
                                {n}
                            </button>
                        );
                    })}
                </div>
            </div>

            <BettingControls 
                balance={balance}
                currentBet={bet}
                onBetChange={setBet}
                onAction={play}
                actionLabel="PLAY KENO"
                isGameActive={playing}
            >
                 <div className="flex justify-between px-2 text-[10px] text-royal-gold/50 uppercase tracking-widest mb-1">
                     <span>Match 3: 1x</span>
                     <span>Match 5: 5x</span>
                     <span>Match 8: 50x</span>
                     <span>Match 10: 500x</span>
                 </div>
            </BettingControls>
        </div>
    );
};

export default KenoGame;