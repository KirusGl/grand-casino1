
import React, { useState, useEffect } from 'react';
import { Card, Rank, createDeck, evaluatePokerHand, dealCards } from '../../utils/cardUtils';
import PlayingCard from '../shared/PlayingCard';
import BettingControls from '../shared/BettingControls';

// Fix: Import types and utilities, and define the PokerGame component as default export.
// This resolves the "no default export" error in GameScreen and missing name errors for Card/Rank.
interface PokerGameProps {
  balance: number;
  onUpdateBalance: (delta: number) => void;
}

const PokerGame: React.FC<PokerGameProps> = ({ balance, onUpdateBalance }) => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [communityCards, setCommunityCards] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<'BETTING' | 'FLOP' | 'TURN' | 'RIVER' | 'SHOWDOWN'>('BETTING');
  const [bet, setBet] = useState(100);
  const [message, setMessage] = useState("Place your bet for Texas Hold'em");

  useEffect(() => {
    setDeck(createDeck());
  }, []);

  const startHand = () => {
    if (balance < bet) {
      setMessage("Insufficient funds");
      return;
    }
    onUpdateBalance(-bet);
    
    const newDeck = createDeck();
    const { cards: pHand, remaining: d1 } = dealCards(newDeck, 2);
    const { cards: cCards, remaining: d2 } = dealCards(d1, 5);
    
    setPlayerHand(pHand);
    setCommunityCards(cCards);
    setDeck(d2);
    setGameState('FLOP');
    setMessage("Flop dealt. Continue?");
  };

  const nextStage = () => {
    switch (gameState) {
      case 'FLOP':
        setGameState('TURN');
        setMessage("Turn dealt. Continue?");
        break;
      case 'TURN':
        setGameState('RIVER');
        setMessage("River dealt. Showdown?");
        break;
      case 'RIVER':
        showdown();
        break;
      default:
        break;
    }
  };

  const showdown = () => {
    const fullHand = [...playerHand, ...communityCards];
    // Find best 5-card combination from the 7 cards (2 hole + 5 community)
    const bestResult = findBest5CardHand(fullHand);
    
    setGameState('SHOWDOWN');
    
    // Simplified payout logic: any pair or better wins based on combo rank
    let winMult = 0;
    if (bestResult.rank >= 1) winMult = 2 + (bestResult.rank * 0.5);
    
    const winAmount = Math.floor(bet * winMult);
    if (winAmount > 0) {
      onUpdateBalance(winAmount);
      setMessage(`You won with ${bestResult.name}! +$${winAmount}`);
    } else {
      setMessage(`High Card ${bestResult.highCard}. House wins.`);
    }
  };

  // Helper to find the best 5-card combination from a pool of cards
  const findBest5CardHand = (cards: Card[]) => {
    let best = { rank: -1, name: '', highCard: '' as Rank };
    // Basic implementation: test all 5-card combinations from 7 (21 combinations)
    for (let i = 0; i < 7; i++) {
      for (let j = i + 1; j < 7; j++) {
        const subHand = cards.filter((_, idx) => idx !== i && idx !== j);
        const result = evaluatePokerHand(subHand);
        if (result.rank > best.rank) {
          best = result as any;
        }
      }
    }
    return best;
  };

  const reset = () => {
    setGameState('BETTING');
    setPlayerHand([]);
    setCommunityCards([]);
    setMessage("Place your bet for Texas Hold'em");
  };

  const visibleCommunityCount = () => {
    if (gameState === 'FLOP') return 3;
    if (gameState === 'TURN') return 4;
    if (gameState === 'RIVER' || gameState === 'SHOWDOWN') return 5;
    return 0;
  };

  return (
    <div className="flex flex-col h-full w-full bg-royal-bg overflow-hidden items-center justify-between">
      <div className="w-full text-center py-4 bg-black/20 text-royal-gold font-playfair text-xl shadow-sm z-10">
        {message}
      </div>

      <div className="flex-1 w-full flex flex-col justify-center items-center gap-8 px-4">
        {/* Community Cards Area */}
        <div className="flex flex-col items-center">
          <div className="text-[10px] text-royal-gold/40 uppercase tracking-[0.3em] mb-4 font-cinzel">Community</div>
          <div className="flex gap-2">
            {communityCards.slice(0, 5).map((c, i) => (
              <PlayingCard key={i} card={c} hidden={i >= visibleCommunityCount()} />
            ))}
            {communityCards.length === 0 && Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-[clamp(50px,16vw,100px)] h-[clamp(70px,22.4vw,140px)] rounded-lg border border-royal-gold/10 bg-white/5" />
            ))}
          </div>
        </div>

        {/* Player Hand Area */}
        <div className="flex flex-col items-center">
          <div className="text-[10px] text-royal-gold/40 uppercase tracking-[0.3em] mb-4 font-cinzel">Your Hand</div>
          <div className="flex gap-4">
            {playerHand.length > 0 ? playerHand.map((c, i) => (
              <PlayingCard key={i} card={c} />
            )) : Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="w-[clamp(50px,16vw,100px)] h-[clamp(70px,22.4vw,140px)] rounded-lg border border-royal-gold/10 bg-white/5" />
            ))}
          </div>
        </div>
      </div>

      {gameState === 'BETTING' ? (
        <BettingControls 
          balance={balance}
          currentBet={bet}
          onBetChange={setBet}
          onAction={startHand}
          actionLabel="DEAL"
        />
      ) : gameState === 'SHOWDOWN' ? (
        <div className="w-full bg-royal-wood/95 border-t border-royal-gold/30 p-4 pb-safe shadow-[0_-5px_20px_black]">
          <button 
            onClick={reset}
            className="w-full py-4 bg-gradient-to-br from-royal-gold to-[#8a6e2f] text-black font-black text-xl rounded-sm shadow-embossed active:scale-95 transition-all border border-white/10"
          >
            PLAY AGAIN
          </button>
        </div>
      ) : (
        <div className="w-full bg-royal-wood/95 border-t border-royal-gold/30 p-4 pb-safe shadow-[0_-5px_20px_black]">
          <button 
            onClick={nextStage}
            className="w-full py-4 bg-gradient-to-br from-royal-gold to-[#8a6e2f] text-black font-black text-xl rounded-sm shadow-embossed active:scale-95 transition-all border border-white/10"
          >
            {gameState === 'RIVER' ? 'SHOWDOWN' : 'NEXT'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PokerGame;
