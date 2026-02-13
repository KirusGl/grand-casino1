import React, { useState } from 'react';
import { createDeck, Card } from '../../utils/cardUtils';
import PlayingCard from '../shared/PlayingCard';
import BettingControls from '../shared/BettingControls';

interface Props { balance: number; onUpdateBalance: (d: number) => void; }

const BaccaratGame: React.FC<Props> = ({ balance, onUpdateBalance }) => {
    const [pHand, setPHand] = useState<Card[]>([]);
    const [bHand, setBHand] = useState<Card[]>([]);
    const [betType, setBetType] = useState<'PLAYER' | 'BANKER' | 'TIE' | null>(null);
    const [selectedChip, setSelectedChip] = useState(10);
    const [currentBetAmount, setCurrentBetAmount] = useState(0);
    const [message, setMessage] = useState("Choose Player, Banker, or Tie");
    const [gameActive, setGameActive] = useState(false);

    const getScore = (hand: Card[]) => {
        let score = hand.reduce((acc, c) => {
            if (['10', 'J', 'Q', 'K'].includes(c.rank)) return acc;
            if (c.rank === 'A') return acc + 1;
            return acc + parseInt(c.rank);
        }, 0);
        return score % 10;
    };

    const handleBetClick = (type: 'PLAYER' | 'BANKER' | 'TIE') => {
        if (gameActive || balance < selectedChip) return;
        
        // Reset if switching bet type
        if (betType !== type && currentBetAmount > 0) {
            onUpdateBalance(currentBetAmount);
            setCurrentBetAmount(0);
        }

        onUpdateBalance(-selectedChip);
        setCurrentBetAmount(prev => prev + selectedChip);
        setBetType(type);
        setMessage(`Bet on ${type}: ${currentBetAmount + selectedChip}`);
    };

    const deal = () => {
        if (currentBetAmount === 0 || !betType) return;
        setGameActive(true);
        const deck = createDeck();
        const p = [deck.pop()!, deck.pop()!];
        const b = [deck.pop()!, deck.pop()!];
        
        let pScore = getScore(p);
        let bScore = getScore(b);
        
        if (pScore < 8 && bScore < 8) {
            if (pScore <= 5) p.push(deck.pop()!);
            if (bScore <= 5) b.push(deck.pop()!); 
        }

        setPHand(p);
        setBHand(b);
        
        const finalP = getScore(p);
        const finalB = getScore(b);
        
        let win = false;
        let payout = 0;

        if (finalP > finalB && betType === 'PLAYER') { win = true; payout = currentBetAmount * 2; }
        else if (finalB > finalP && betType === 'BANKER') { win = true; payout = Math.floor(currentBetAmount * 1.95); } 
        else if (finalP === finalB && betType === 'TIE') { win = true; payout = currentBetAmount * 9; }
        else if (finalP === finalB && betType !== 'TIE') { payout = currentBetAmount; setMessage("Push"); } 
        
        if (win) {
            onUpdateBalance(payout);
            setMessage("You Win!");
        } else if (payout === currentBetAmount) {
             onUpdateBalance(payout); // Push
        } else {
            setMessage("House Wins");
        }
        
        // Reset for next round
        setTimeout(() => {
            setGameActive(false);
            setCurrentBetAmount(0);
            setBetType(null);
            setPHand([]);
            setBHand([]);
        }, 3000);
    };

    return (
        <div className="flex flex-col h-full w-full bg-royal-bg overflow-hidden items-center justify-between">
            <div className="text-royal-gold font-cormorant text-xl mt-4">{message}</div>
            
            <div className="flex-1 w-full flex items-center justify-center gap-2 px-2">
                <div className="flex flex-col items-center">
                    <span className="text-royal-gold mb-2 text-xs font-bold tracking-widest">PLAYER ({pHand.length > 0 ? getScore(pHand) : 0})</span>
                    <div className="flex -space-x-[5vw]">
                        {pHand.length === 0 ? <div className="w-[14vw] h-[20vw] bg-white/5 border border-white/10 rounded-md"></div> : pHand.map((c, i) => <PlayingCard key={i} card={c} />)}
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-royal-gold mb-2 text-xs font-bold tracking-widest">BANKER ({bHand.length > 0 ? getScore(bHand) : 0})</span>
                    <div className="flex -space-x-[5vw]">
                        {bHand.length === 0 ? <div className="w-[14vw] h-[20vw] bg-white/5 border border-white/10 rounded-md"></div> : bHand.map((c, i) => <PlayingCard key={i} card={c} />)}
                    </div>
                </div>
            </div>

            <div className="w-full px-4 mb-2">
                <div className="flex justify-center gap-2 w-full max-w-md mx-auto h-20">
                    {['PLAYER', 'TIE', 'BANKER'].map(t => (
                        <button 
                            key={t} 
                            onClick={() => handleBetClick(t as any)} 
                            disabled={gameActive}
                            className={`
                                flex-1 rounded-xl border-2 transition-all flex flex-col items-center justify-center active:scale-95
                                ${betType === t 
                                    ? 'bg-royal-gold text-black border-white shadow-gold-glow' 
                                    : 'bg-royal-wood/50 text-royal-gold border-royal-gold/30 hover:bg-royal-gold/10'}
                            `}
                        >
                            <div className="font-black text-xs md:text-sm">{t}</div>
                            {betType === t && <div className="text-xs font-bold mt-1 bg-black/20 px-2 rounded-full">{currentBetAmount}</div>}
                        </button>
                    ))}
                </div>
            </div>
            
            <BettingControls 
                balance={balance}
                currentBet={selectedChip}
                onBetChange={setSelectedChip}
                onAction={deal}
                actionLabel="DEAL"
                isGameActive={gameActive}
                chipMode={true}
            />
        </div>
    );
};

export default BaccaratGame;