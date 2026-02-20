import React, { useState, useEffect } from 'react';
import { createDeck, Card, getBlackjackScore } from '../../utils/cardUtils';
import PlayingCard from '../shared/PlayingCard';
import BettingControls from '../shared/BettingControls';

interface Props {
  balance: number;
  onUpdateBalance: (delta: number) => void;
}

const BlackjackGame: React.FC<Props> = ({ balance, onUpdateBalance }) => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<'BETTING' | 'PLAYING' | 'DEALER_TURN' | 'ENDED'>('BETTING');
  const [bet, setBet] = useState(10);
  const [message, setMessage] = useState("Place your bet");

  useEffect(() => {
    setDeck(createDeck());
  }, []);

  const deal = () => {
    if (balance < bet) { setMessage("Insufficient Funds"); return; }
    onUpdateBalance(-bet);
    
    const newDeck = [...deck];
    if (newDeck.length < 10) { setDeck(createDeck()); return; }
    
    const pHand = [newDeck.pop()!, newDeck.pop()!];
    const dHand = [newDeck.pop()!, newDeck.pop()!];
    
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setDeck(newDeck);
    setGameState('PLAYING');
    setMessage("Hit or Stand?");

    if (getBlackjackScore(pHand) === 21) {
       handleEnd(pHand, dHand, true);
    }
  };

  const hit = () => {
    const newDeck = [...deck];
    const card = newDeck.pop()!;
    const newHand = [...playerHand, card];
    setPlayerHand(newHand);
    setDeck(newDeck);
    
    if (getBlackjackScore(newHand) > 21) {
        setGameState('ENDED');
        setMessage("Bust! House Wins.");
    }
  };

  const stand = () => {
    setGameState('DEALER_TURN');
    let dHand = [...dealerHand];
    let dDeck = [...deck];
    while (getBlackjackScore(dHand) < 17) {
        dHand.push(dDeck.pop()!);
    }
    setDealerHand(dHand);
    setDeck(dDeck);
    handleEnd(playerHand, dHand, false);
  };

  const handleEnd = (pHand: Card[], dHand: Card[], instantBj: boolean) => {
    const pScore = getBlackjackScore(pHand);
    const dScore = getBlackjackScore(dHand);
    setGameState('ENDED');

    let winAmount = 0;
    if (pScore > 21) {
        // Lose
    } else if (instantBj) {
        winAmount = Math.floor(bet * 2.5);
        setMessage("Blackjack! You win!");
    } else if (dScore > 21 || pScore > dScore) {
        winAmount = bet * 2;
        setMessage("You Win!");
    } else if (pScore === dScore) {
        winAmount = bet;
        setMessage("Push");
    } else {
        setMessage("House Wins");
    }
    
    if (winAmount > 0) onUpdateBalance(winAmount);
  };

  const reset = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setGameState('BETTING');
    setMessage("Place your bet");
    if (deck.length < 15) setDeck(createDeck());
  };

  return (
    <div className="flex flex-col h-full w-full bg-royal-bg overflow-hidden items-center justify-between">
       <div className="w-full text-center py-4 bg-black/20 text-royal-gold font-playfair text-[clamp(1.2rem,4vw,1.5rem)] shadow-sm z-10">
           {message}
       </div>
       
       {/* АДАПТИВ: Контейнер для игрового стола занимает доступное пространство */}
       <div className="flex-1 w-full flex flex-col justify-center items-center gap-[clamp(20px,5vh,40px)] px-4">
          
          {/* DEALER AREA */}
          <div className="flex flex-col items-center">
              {/* АДАПТИВ: Отрицательный отступ (-space-x) зависит от ширины карты */}
              <div className="flex -space-x-[clamp(30px,10vw,60px)] items-center justify-center">
                 {dealerHand.map((c, i) => (
                    <div key={i} className="transform transition-transform hover:-translate-y-2">
                        <PlayingCard card={c} hidden={gameState === 'PLAYING' && i === 1} />
                    </div>
                 ))}
                 {dealerHand.length === 0 && (
                    <div className="w-[clamp(50px,16vw,100px)] h-[clamp(70px,22.4vw,140px)] rounded-lg border border-royal-gold/20 bg-white/5 animate-pulse"></div>
                 )}
              </div>
              <div className="mt-2 text-xs text-royal-gold/50 uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full">
                  Dealer {gameState === 'ENDED' && `(${getBlackjackScore(dealerHand)})`}
              </div>
          </div>

          {/* PLAYER AREA */}
          <div className="flex flex-col items-center">
              <div className="mb-2 text-xs text-royal-gold/50 uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full">
                  Player {playerHand.length > 0 && `(${getBlackjackScore(playerHand)})`}
              </div>
              <div className="flex -space-x-[clamp(30px,10vw,60px)] items-center justify-center">
                 {playerHand.map((c, i) => (
                    <div key={i} className="transform transition-transform hover:-translate-y-2">
                        <PlayingCard card={c} />
                    </div>
                 ))}
                 {playerHand.length === 0 && (
                     <div className="w-[clamp(50px,16vw,100px)] h-[clamp(70px,22.4vw,140px)] rounded-lg border border-royal-gold/20 bg-white/5 animate-pulse"></div>
                 )}
              </div>
          </div>
       </div>

       {gameState === 'BETTING' ? (
           <BettingControls 
             balance={balance}
             currentBet={bet}
             onBetChange={setBet}
             onAction={deal}
             actionLabel="DEAL"
           />
       ) : gameState === 'PLAYING' ? (
           <div className="w-full bg-royal-wood/95 border-t border-royal-gold/30 p-4 pb-safe flex gap-4 justify-center shadow-[0_-5px_20px_black]">
                <button 
                    onClick={stand} 
                    className="flex-1 py-4 bg-gradient-to-br from-royal-red to-red-900 text-white font-black text-[clamp(1rem,4vw,1.5rem)] rounded-sm shadow-embossed active:scale-95 transition-all border border-white/10"
                >
                    STAND
                </button>
                <button 
                    onClick={hit} 
                    className="flex-1 py-4 bg-gradient-to-br from-royal-gold to-[#8a6e2f] text-black font-black text-[clamp(1rem,4vw,1.5rem)] rounded-sm shadow-embossed active:scale-95 transition-all border border-white/10"
                >
                    HIT
                </button>
           </div>
       ) : (
           <div className="w-full bg-royal-wood/95 border-t border-royal-gold/30 p-4 pb-safe shadow-[0_-5px_20px_black]">
                <button 
                    onClick={reset} 
                    className="w-full py-4 bg-gradient-to-br from-royal-gold to-[#8a6e2f] text-black font-black text-[clamp(1rem,4vw,1.5rem)] rounded-sm shadow-embossed active:scale-95 transition-all border border-white/10"
                >
                    PLAY AGAIN
                </button>
           </div>
       )}
    </div>
  );
};

export default BlackjackGame;