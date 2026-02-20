import React, { useState } from 'react';
import { createDeck, Card, evaluatePokerHand } from '../../utils/cardUtils';
import PlayingCard from '../shared/PlayingCard';
import BettingControls from '../shared/BettingControls';

interface Props { balance: number; onUpdateBalance: (d: number) => void; }

const VideoPokerGame: React.FC<Props> = ({ balance, onUpdateBalance }) => {
    const [hand, setHand] = useState<Card[]>([]);
    const [held, setHeld] = useState<boolean[]>([false, false, false, false, false]);
    const [deck, setDeck] = useState<Card[]>([]);
    const [phase, setPhase] = useState<'BET' | 'DRAW'>('BET');
    const [bet, setBet] = useState(10);
    const [message, setMessage] = useState("Jacks or Better");
    const [winHand, setWinHand] = useState<string | null>(null);

    const deal = () => {
        if (balance < bet) { setMessage("Insufficient funds"); return; }
        onUpdateBalance(-bet);
        const d = createDeck();
        setHand(d.splice(0, 5));
        setDeck(d);
        setPhase('DRAW');
        setMessage("Hold cards and Draw");
        setHeld([false, false, false, false, false]);
        setWinHand(null);
    };

    const toggleHold = (index: number) => {
        if (phase !== 'DRAW') return;
        const newHeld = [...held];
        newHeld[index] = !newHeld[index];
        setHeld(newHeld);
    };

    const draw = () => {
        const newHand = hand.map((c, i) => held[i] ? c : deck.pop()!);
        setHand(newHand);
        const result = evaluatePokerHand(newHand);
        
        // Simple Jacks or Better Payout Table
        const pays: {[key: number]: number} = {
            9: 250, 8: 50, 7: 25, 6: 9, 5: 6, 4: 4, 3: 3, 2: 2, 1: 1, 0: 0
        };
        
        const mult = pays[result.rank] || 0;
        const win = bet * mult;
        
        if (win > 0) {
            onUpdateBalance(win);
            setMessage(`WON ${win}`);
            setWinHand(result.name);
        } else {
            setMessage("Game Over");
            setWinHand(null);
        }
        setPhase('BET');
    };

    return (
        <div className="flex flex-col h-full items-center justify-between w-full bg-royal-bg overflow-hidden relative">
             
             {/* Info / Paytable Hint */}
             <div className="w-full text-center py-4 z-10">
                 <h2 className="text-2xl font-playfair text-royal-gold gold-text-gradient">{winHand || message}</h2>
                 <div className="text-[10px] text-royal-gold/50 uppercase tracking-widest mt-1">
                     RF: 250x • 4K: 25x • FH: 9x • FL: 6x • ST: 4x
                 </div>
             </div>
             
             {/* Cards Area */}
             <div className="flex-1 flex items-center justify-center w-full px-4">
                 <div className="flex justify-center gap-2 md:gap-4 w-full max-w-2xl">
                     {hand.length === 0 ? [1,2,3,4,5].map(i => (
                         <div key={i} className="w-[16vw] h-[22vw] max-w-[5rem] max-h-[7rem] bg-royal-wood border border-royal-gold/20 rounded-lg shadow-inner"></div>
                     )) :
                      hand.map((c, i) => (
                          <div key={i} className="relative cursor-pointer group" onClick={() => toggleHold(i)}>
                              <PlayingCard 
                                card={c} 
                                className={`transition-all duration-200 ${held[i] ? 'ring-4 ring-royal-gold -translate-y-4 shadow-gold-glow' : 'hover:-translate-y-1'}`} 
                              />
                              {held[i] && phase === 'DRAW' && (
                                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-royal-gold text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider animate-bounce">
                                      HELD
                                  </div>
                              )}
                          </div>
                      ))
                     }
                 </div>
             </div>

             {/* Controls */}
             <BettingControls 
                balance={balance}
                currentBet={bet}
                onBetChange={setBet}
                onAction={phase === 'BET' ? deal : draw}
                actionLabel={phase === 'BET' ? "DEAL" : "DRAW"}
                isGameActive={phase === 'DRAW' && false} // Keep controls enabled to allow logic inside onAction, but disabled logic is handled by BettingControls
                // We actually want to DISABLE the bet amount changing during DRAW
             >
                {/* During DRAW phase, we overlay a simple instruction or lock */}
                {phase === 'DRAW' && (
                    <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-[1px] rounded-t-xl">
                         <button onClick={draw} className="w-[90%] py-4 bg-royal-gold text-black font-black text-xl rounded-xl shadow-gold-glow uppercase tracking-widest">
                             DRAW CARDS
                         </button>
                    </div>
                )}
             </BettingControls>
        </div>
    );
};

export default VideoPokerGame;