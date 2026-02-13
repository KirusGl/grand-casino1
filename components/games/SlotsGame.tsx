import React, { useState } from 'react';
import BettingControls from '../shared/BettingControls';

interface Props { balance: number; onUpdateBalance: (d: number) => void; }

const SYMBOLS = ['🍒', '🍋', '🔔', '💎', '7️⃣', '👑'];
const PAYOUTS = { '🍒': 2, '🍋': 3, '🔔': 5, '💎': 10, '7️⃣': 20, '👑': 50 };

const SlotsGame: React.FC<Props> = ({ balance, onUpdateBalance }) => {
    const [reels, setReels] = useState(['7️⃣', '7️⃣', '7️⃣']);
    const [spinning, setSpinning] = useState(false);
    const [bet, setBet] = useState(10);
    const [message, setMessage] = useState("SPIN TO WIN");

    const spin = () => {
        if (balance < bet) { setMessage("Low Balance"); return; }
        onUpdateBalance(-bet);
        setSpinning(true);
        setMessage("Spinning...");

        let interval = setInterval(() => {
            setReels([
                SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
                SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
                SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
            ]);
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            const finalReels = [
                SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
                SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
                SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
            ];
            
            setReels(finalReels);
            setSpinning(false);
            
            if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
                const win = bet * PAYOUTS[finalReels[0] as keyof typeof PAYOUTS];
                onUpdateBalance(win);
                setMessage(`JACKPOT! Won ${win}`);
            } else if (finalReels[0] === finalReels[1] || finalReels[1] === finalReels[2] || finalReels[0] === finalReels[2]) {
                const win = Math.floor(bet * 1.5);
                onUpdateBalance(win);
                setMessage(`Small Win: ${win}`);
            } else {
                setMessage("Try Again");
            }
        }, 2000);
    };

    return (
        <div className="flex flex-col h-full items-center justify-between w-full bg-royal-bg overflow-hidden relative">
            <div className="flex-1 flex flex-col items-center justify-center p-4 w-full">
                <div className="bg-royal-wood p-6 rounded-xl border-4 border-royal-gold shadow-2xl relative w-full max-w-md">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-royal-gold text-black px-4 py-1 rounded font-bold font-playfair tracking-widest uppercase text-sm border-2 border-white shadow-lg whitespace-nowrap z-10">
                    {message}
                    </div>
                    
                    <div className="flex gap-2 mb-2 bg-black p-4 rounded-lg border border-royal-gold/50 shadow-inner justify-between">
                        {reels.map((s, i) => (
                            <div key={i} className="flex-1 aspect-[2/3] bg-white rounded flex items-center justify-center text-[clamp(2rem,8vw,3.5rem)] border-2 border-gray-300 shadow-inner">
                                {s}
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-4 text-center text-royal-gold/50 text-[10px] font-lora">
                        <p>MATCH 3 TO WIN BIG</p>
                        <p>👑 = 50x • 7️⃣ = 20x • 💎 = 10x</p>
                    </div>
                </div>
            </div>
            
            <BettingControls 
                balance={balance}
                currentBet={bet}
                onBetChange={setBet}
                onAction={spin}
                actionLabel="SPIN"
                isGameActive={spinning}
            />
        </div>
    );
};

export default SlotsGame;