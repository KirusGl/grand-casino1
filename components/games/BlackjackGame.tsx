import React, { useState, useEffect, useCallback } from 'react';
import { createDeck, Card, getBlackjackScore } from '../../utils/cardUtils';
import PlayingCard from '../shared/PlayingCard';
import BettingControls from '../shared/BettingControls';
import { Crown, Trophy, TrendingUp } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

interface Props {
  balance: number;
  onUpdateBalance: (delta: number) => void;
  onWin?: (amount: number) => void;
}

const BlackjackGame: React.FC<Props> = ({ balance, onUpdateBalance, onWin }) => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<'BETTING' | 'PLAYING' | 'DEALER_TURN' | 'ENDED'>('BETTING');
  const [bet, setBet] = useState(10);
  const [message, setMessage] = useState("Place your bet");
  const [winAmount, setWinAmount] = useState(0);
  const [isBlackjack, setIsBlackjack] = useState(false);
  const [handStats, setHandStats] = useState({ wins: 0, losses: 0, blackjacks: 0 });

  useEffect(() => {
    setDeck(createDeck());
  }, []);

  const deal = () => {
    if (balance < bet) { 
      setMessage("Insufficient Funds"); 
      triggerHaptic('error');
      return; 
    }
    
    triggerHaptic('light');
    onUpdateBalance(-bet);
    
    const newDeck = [...deck];
    if (newDeck.length < 10) { 
      const freshDeck = createDeck();
      setDeck(freshDeck);
      return; 
    }
    
    const pHand = [newDeck.pop()!, newDeck.pop()!];
    const dHand = [newDeck.pop()!, newDeck.pop()!];
    
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setDeck(newDeck);
    setGameState('PLAYING');
    setMessage("Hit or Stand?");
    setWinAmount(0);
    setIsBlackjack(false);

    const pScore = getBlackjackScore(pHand);
    if (pScore === 21) {
       handleEnd(pHand, dHand, true);
    }
  };

  const hit = () => {
    triggerHaptic('light');
    const newDeck = [...deck];
    const card = newDeck.pop()!;
    const newHand = [...playerHand, card];
    setPlayerHand(newHand);
    setDeck(newDeck);
    
    const score = getBlackjackScore(newHand);
    if (score > 21) {
        triggerHaptic('error');
        setGameState('ENDED');
        setMessage("Bust! House Wins.");
        setHandStats(prev => ({ ...prev, losses: prev.losses + 1 }));
    }
  };

  const stand = () => {
    setGameState('DEALER_TURN');
    let dHand = [...dealerHand];
    let dDeck = [...deck];
    
    // Dealer hits on soft 17
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

    let payout = 0;
    let resultMessage = "";

    if (pScore > 21) {
        resultMessage = "Bust! House Wins.";
    } else if (instantBj) {
        payout = Math.floor(bet * 2.5);
        resultMessage = "BLACKJACK!";
        setIsBlackjack(true);
        triggerHaptic('success');
        setHandStats(prev => ({ ...prev, wins: prev.wins + 1, blackjacks: prev.blackjacks + 1 }));
    } else if (dScore > 21) {
        payout = bet * 2;
        resultMessage = "Dealer Busts! You Win!";
        triggerHaptic('success');
        setHandStats(prev => ({ ...prev, wins: prev.wins + 1 }));
    } else if (pScore > dScore) {
        payout = bet * 2;
        resultMessage = "You Win!";
        triggerHaptic('success');
        setHandStats(prev => ({ ...prev, wins: prev.wins + 1 }));
    } else if (pScore === dScore) {
        payout = bet;
        resultMessage = "Push";
        triggerHaptic('light');
    } else {
        resultMessage = "House Wins";
        triggerHaptic('error');
        setHandStats(prev => ({ ...prev, losses: prev.losses + 1 }));
    }
    
    if (payout > 0) {
      onUpdateBalance(payout);
      setWinAmount(payout - bet);
      onWin?.(payout - bet);
    }
    setMessage(resultMessage);
  };

  const reset = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setGameState('BETTING');
    setMessage("Place your bet");
    setWinAmount(0);
    setIsBlackjack(false);
    if (deck.length < 15) setDeck(createDeck());
  };

  const getPlayerScore = () => getBlackjackScore(playerHand);
  const getDealerScore = () => gameState === 'PLAYING' ? '?' : getBlackjackScore(dealerHand);

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-royal-bg via-green-900/20 to-black overflow-hidden items-center justify-between">
      {/* Table felt texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(34,139,34,0.1)_0%,_transparent_70%)] pointer-events-none"></div>
      
      {/* Stats Bar */}
      <div className="w-full px-4 py-2 flex justify-between items-center bg-black/30 backdrop-blur-sm border-b border-royal-gold/20 z-10">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 text-royal-green">
            <Trophy size={12} />
            <span>{handStats.wins}</span>
          </div>
          <div className="flex items-center gap-1 text-red-400">
            <span>{handStats.losses}</span>
          </div>
          <div className="flex items-center gap-1 text-royal-gold">
            <Crown size={12} />
            <span>{handStats.blackjacks}</span>
          </div>
        </div>
        {winAmount > 0 && (
          <div className="flex items-center gap-1 text-royal-green font-bold animate-pulse">
            <TrendingUp size={14} />
            <span>+{winAmount}</span>
          </div>
        )}
      </div>
      
      {/* Message Display */}
      <div className={`w-full text-center py-4 px-6 z-10 transition-all duration-300 ${
        isBlackjack 
          ? 'bg-gradient-to-r from-royal-gold via-yellow-300 to-royal-gold text-black animate-pulse' 
          : 'bg-black/20 text-royal-gold'
      }`}>
        <h2 className={`font-playfair font-bold text-[clamp(1.2rem,4vw,1.8rem)] ${isBlackjack ? 'tracking-wider' : ''}`}>
          {isBlackjack && <Crown className="inline w-5 h-5 mr-2 animate-bounce" />}
          {message}
          {isBlackjack && <Crown className="inline w-5 h-5 ml-2 animate-bounce" />}
        </h2>
      </div>
      
      {/* Game Area */}
      <div className="flex-1 w-full flex flex-col justify-center items-center gap-[clamp(20px,5vh,40px)] px-4 relative z-10">
          
          {/* DEALER AREA */}
          <div className="flex flex-col items-center">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xs text-royal-gold/50 uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full">
                  Dealer
                </span>
                {dealerHand.length > 0 && (
                  <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                    gameState === 'ENDED' && getBlackjackScore(dealerHand) > 21 
                      ? 'bg-red-500/30 text-red-300' 
                      : 'bg-royal-gold/20 text-royal-gold'
                  }`}>
                    {getDealerScore()}
                  </span>
                )}
              </div>
              <div className="flex -space-x-[clamp(30px,10vw,60px)] items-center justify-center min-h-[clamp(70px,22.4vw,140px)]">
                 {dealerHand.map((c, i) => (
                    <div key={i} className="transform transition-all duration-300 hover:-translate-y-2 hover:scale-105">
                        <PlayingCard card={c} hidden={gameState === 'PLAYING' && i === 1} />
                    </div>
                 ))}
                 {dealerHand.length === 0 && (
                    <div className="w-[clamp(50px,16vw,100px)] h-[clamp(70px,22.4vw,140px)] rounded-lg border-2 border-dashed border-royal-gold/20 bg-white/5 flex items-center justify-center">
                      <span className="text-2xl opacity-30">🂠</span>
                    </div>
                 )}
              </div>
          </div>

          {/* PLAYER AREA */}
          <div className="flex flex-col items-center">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xs text-royal-gold/50 uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full">
                  Your Hand
                </span>
                {playerHand.length > 0 && (
                  <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                    getPlayerScore() > 21 
                      ? 'bg-red-500/30 text-red-300' 
                      : getPlayerScore() === 21
                      ? 'bg-royal-gold/30 text-royal-gold animate-pulse'
                      : 'bg-royal-green/20 text-royal-green'
                  }`}>
                    {getPlayerScore()}
                  </span>
                )}
              </div>
              <div className="flex -space-x-[clamp(30px,10vw,60px)] items-center justify-center min-h-[clamp(70px,22.4vw,140px)]">
                 {playerHand.map((c, i) => (
                    <div key={i} className="transform transition-all duration-300 hover:-translate-y-2 hover:scale-105">
                        <PlayingCard card={c} />
                    </div>
                 ))}
                 {playerHand.length === 0 && (
                     <div className="w-[clamp(50px,16vw,100px)] h-[clamp(70px,22.4vw,140px)] rounded-lg border-2 border-dashed border-royal-gold/20 bg-white/5 flex items-center justify-center">
                       <span className="text-2xl opacity-30">🂠</span>
                     </div>
                 )}
              </div>
          </div>
      </div>

      {/* Controls */}
      {gameState === 'BETTING' ? (
          <BettingControls 
            balance={balance}
            currentBet={bet}
            onBetChange={setBet}
            onAction={deal}
            actionLabel="DEAL"
          />
      ) : gameState === 'PLAYING' ? (
          <div className="w-full bg-gradient-to-t from-royal-wood/95 to-royal-wood/80 border-t border-royal-gold/30 p-4 pb-safe flex gap-4 justify-center shadow-[0_-5px_20px_black] z-20">
                <button 
                    onClick={stand} 
                    className="flex-1 py-4 bg-gradient-to-br from-royal-red to-red-900 text-white font-black text-[clamp(1rem,4vw,1.5rem)] rounded-sm shadow-embossed active:scale-95 transition-all border border-white/10 hover:brightness-110"
                >
                    STAND
                </button>
                <button 
                    onClick={hit} 
                    className="flex-1 py-4 bg-gradient-to-br from-royal-gold to-[#8a6e2f] text-black font-black text-[clamp(1rem,4vw,1.5rem)] rounded-sm shadow-embossed active:scale-95 transition-all border border-white/10 hover:brightness-110"
                >
                    HIT
                </button>
          </div>
      ) : (
          <div className="w-full bg-gradient-to-t from-royal-wood/95 to-royal-wood/80 border-t border-royal-gold/30 p-4 pb-safe shadow-[0_-5px_20px_black] z-20">
                <button 
                    onClick={reset} 
                    className="w-full py-4 bg-gradient-to-br from-royal-gold to-[#8a6e2f] text-black font-black text-[clamp(1rem,4vw,1.5rem)] rounded-sm shadow-embossed active:scale-95 transition-all border border-white/10 hover:brightness-110"
                >
                    {winAmount > 0 ? `COLLECT +${winAmount} • PLAY AGAIN` : 'PLAY AGAIN'}
                </button>
          </div>
      )}
    </div>
  );
};

export default BlackjackGame;