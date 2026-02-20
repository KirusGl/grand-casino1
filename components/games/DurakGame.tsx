import React, { useState, useRef, useEffect } from 'react';
import { Card, createDurakDeck, shuffle, SUITS } from '../../utils/cardUtils';
import PlayingCard from '../shared/PlayingCard';
import BettingControls from '../shared/BettingControls';
import { User, Shield, Swords, Search, Clock, Users } from 'lucide-react';

interface Props {
  balance: number;
  onUpdateBalance: (delta: number) => void;
}

interface TablePair {
  attack: Card;
  defense: Card | null;
}

// Mock real players
const MOCK_OPPONENTS = [
  "Alex_Vip", "CryptoKing", "LuckySerge", "OlegBet", "Winner777", "ElonMusk_Real", "Baron_X"
];

const DurakGame: React.FC<Props> = ({ balance, onUpdateBalance }) => {
  // Game State
  const [gameState, setGameState] = useState<'IDLE' | 'SEARCHING' | 'PLAYING' | 'RESULT'>('IDLE');
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [opponentHand, setOpponentHand] = useState<Card[]>([]); // Renamed from AI
  const [table, setTable] = useState<TablePair[]>([]);
  const [trump, setTrump] = useState<Card | null>(null);
  
  // Logic State
  const [isPlayerTurn, setIsPlayerTurn] = useState(false); // Attacker
  const [isPlayerDefending, setIsPlayerDefending] = useState(false); 
  const [message, setMessage] = useState('');
  const [bet, setBet] = useState(100);
  const [opponentName, setOpponentName] = useState("Unknown");
  
  const handContainerRef = useRef<HTMLDivElement>(null);

  // --- MATCHMAKING LOGIC ---
  const startSearch = () => {
    if (balance < bet) {
      setMessage("Insufficient Funds");
      return;
    }
    setGameState('SEARCHING');
    setMessage("Searching for opponent...");
    
    // Simulate finding a player (2-4 seconds)
    const delay = 2000 + Math.random() * 2000;
    setTimeout(() => {
        const randomOpponent = MOCK_OPPONENTS[Math.floor(Math.random() * MOCK_OPPONENTS.length)];
        setOpponentName(randomOpponent);
        startGame();
    }, delay);
  };

  const cancelSearch = () => {
      setGameState('IDLE');
      setMessage("");
  };

  // --- GAMEPLAY LOGIC ---
  const startGame = () => {
    onUpdateBalance(-bet);

    let newDeck = shuffle(createDurakDeck());
    const trumpCard = newDeck[newDeck.length - 1]; // Last card is trump
    // In real Durak, trump is placed at bottom, but visible.
    
    // Deal 6 cards
    const p = newDeck.splice(0, 6);
    const o = newDeck.splice(0, 6);
    
    setDeck(newDeck);
    setPlayerHand(p);
    setOpponentHand(o);
    setTrump(trumpCard);
    setTable([]);
    setGameState('PLAYING');

    // Determine who goes first (smallest trump)
    // Simplified: Player goes first 50/50
    const playerFirst = Math.random() > 0.5;
    setIsPlayerTurn(playerFirst);
    setIsPlayerDefending(!playerFirst);
    setMessage(playerFirst ? "Your Turn to Attack" : `${opponentName} is Attacking`);

    if (!playerFirst) {
        setTimeout(() => opponentAttack(o, p, trumpCard, []), 1500);
    }
  };

  // --- OPPONENT AI (Simulating Human) ---
  const opponentAttack = (currentOppHand: Card[], currentPlayerHand: Card[], currentTrump: Card, currentTable: TablePair[]) => {
     // Simple Logic: Play lowest non-trump card
     const hand = [...currentOppHand];
     // Sort: non-trumps first, then by value
     hand.sort((a, b) => {
         const aTrump = a.suit === currentTrump.suit;
         const bTrump = b.suit === currentTrump.suit;
         if (aTrump && !bTrump) return 1;
         if (!aTrump && bTrump) return -1;
         return a.value - b.value; // Assuming value logic exists or rank index
     });

     // Find valid card to attack (if table not empty, must match rank)
     let cardToPlay: Card | null = null;
     
     if (currentTable.length === 0) {
         cardToPlay = hand[0]; // Play lowest
     } else {
         // Can only add cards that match ranks on table
         const ranksOnTable = new Set(currentTable.flatMap(p => [p.attack.rank, p.defense?.rank].filter(Boolean)));
         cardToPlay = hand.find(c => ranksOnTable.has(c.rank)) || null;
     }

     if (cardToPlay) {
         // Attack
         const newHand = currentOppHand.filter(c => c !== cardToPlay);
         setOpponentHand(newHand);
         setTable(prev => [...prev, { attack: cardToPlay!, defense: null }]);
         setMessage(`${opponentName} attacks with ${cardToPlay.rank}`);
         setIsPlayerDefending(true);
         setIsPlayerTurn(true); // Player needs to act (defend)
     } else {
         // Pass / Done
         setMessage(`${opponentName} passes`);
         endTurn(false); // Opponent finished attacking
     }
  };

  const opponentDefend = (attackCard: Card) => {
      // Find card to beat attack
      const hand = [...opponentHand];
      // Logic: Higher card of same suit OR any trump (if attack not trump) OR higher trump
      const possibleDefenses = hand.filter(c => {
          if (c.suit === attackCard.suit) return getRankVal(c.rank) > getRankVal(attackCard.rank);
          if (c.suit === trump!.suit && attackCard.suit !== trump!.suit) return true;
          return false;
      }).sort((a, b) => getRankVal(a.rank) - getRankVal(b.rank)); // Use lowest effective card

      if (possibleDefenses.length > 0) {
          const defenseCard = possibleDefenses[0];
          
          setTimeout(() => {
              const newHand = opponentHand.filter(c => c !== defenseCard);
              setOpponentHand(newHand);
              setTable(prev => {
                  const newTable = [...prev];
                  newTable[newTable.length - 1].defense = defenseCard;
                  return newTable;
              });
              setMessage(`${opponentName} defends`);
              // Now player can throw more
              setIsPlayerTurn(true); 
              setIsPlayerDefending(false);
          }, 1500);
      } else {
          // Take
          setTimeout(() => {
              setMessage(`${opponentName} takes`);
              takeCards(false); // false = opponent takes
          }, 1500);
      }
  };

  // --- PLAYER ACTIONS ---
  const handleCardClick = (index: number) => {
      if (!isPlayerTurn) return;
      const card = playerHand[index];

      if (isPlayerDefending) {
          // Defending logic
          const tableCard = table[table.length - 1];
          if (tableCard.defense) return; // Already defended

          const canBeat = (card.suit === tableCard.attack.suit && getRankVal(card.rank) > getRankVal(tableCard.attack.rank)) ||
                          (card.suit === trump!.suit && tableCard.attack.suit !== trump!.suit) ||
                          (card.suit === trump!.suit && tableCard.attack.suit === trump!.suit && getRankVal(card.rank) > getRankVal(tableCard.attack.rank));

          if (canBeat) {
               const newHand = playerHand.filter((_, i) => i !== index);
               setPlayerHand(newHand);
               setTable(prev => {
                   const t = [...prev];
                   t[t.length - 1].defense = card;
                   return t;
               });
               setIsPlayerTurn(false); // Wait for opponent to throw more or pass
               setMessage("Waiting for opponent...");
               setTimeout(() => opponentAttack(opponentHand, newHand, trump!, table), 1500);
          } else {
               setMessage("Card too weak!");
          }

      } else {
          // Attacking logic
          if (table.length > 0) {
               // Must match rank
               const ranksOnTable = new Set(table.flatMap(p => [p.attack.rank, p.defense?.rank].filter(Boolean)));
               if (!ranksOnTable.has(card.rank)) {
                   setMessage("Must match rank on table");
                   return;
               }
          }
          
          const newHand = playerHand.filter((_, i) => i !== index);
          setPlayerHand(newHand);
          setTable(prev => [...prev, { attack: card, defense: null }]);
          setIsPlayerTurn(false);
          setMessage("Waiting for defense...");
          setTimeout(() => opponentDefend(card), 1500);
      }
  };

  const playerDone = () => {
      if (isPlayerDefending) {
          // Player takes
          takeCards(true);
      } else {
          // Player stops attacking
          endTurn(true);
      }
  };

  // --- SHARED UTILS ---
  const takeCards = (playerTakes: boolean) => {
      const cardsOnTable = table.flatMap(p => [p.attack, p.defense].filter((c): c is Card => c !== null));
      if (playerTakes) {
          setPlayerHand([...playerHand, ...cardsOnTable]);
          endTurn(false, true); // Turn ends, but attacker (opponent) attacks again? No, in Durak if you take, turn passes to next but you skip attack. 
          // Simplified: If you take, opponent attacks again next round.
      } else {
          setOpponentHand([...opponentHand, ...cardsOnTable]);
          endTurn(true, true); // Player attacks next
      }
  };

  const endTurn = (playerNext: boolean, skipRefill: boolean = false) => {
      // Clear table
      setTable([]);
      
      // Check win
      if (deck.length === 0 && playerHand.length === 0) {
           gameOver(true);
           return;
      }
      if (deck.length === 0 && opponentHand.length === 0) {
           gameOver(false);
           return;
      }

      // Refill hands
      let currentDeck = [...deck];
      let pHand = [...playerHand];
      let oHand = [...opponentHand];

      // Attacker fills first
      const first = playerNext ? pHand : oHand;
      const second = playerNext ? oHand : pHand;

      while (first.length < 6 && currentDeck.length > 0) first.push(currentDeck.pop()!);
      while (second.length < 6 && currentDeck.length > 0) second.push(currentDeck.pop()!);

      setDeck(currentDeck);
      setPlayerHand(pHand);
      setOpponentHand(oHand);

      setIsPlayerTurn(playerNext);
      setIsPlayerDefending(!playerNext);
      setMessage(playerNext ? "Your Turn" : `${opponentName}'s Turn`);

      if (!playerNext) {
          setTimeout(() => opponentAttack(oHand, pHand, trump!, []), 1500);
      }
  };

  const gameOver = (playerWon: boolean) => {
      setGameState('RESULT');
      if (playerWon) {
          onUpdateBalance(bet * 2);
          setMessage("VICTORY! Pot Won.");
      } else {
          setMessage("DEFEAT. Better luck next time.");
      }
  };

  const getRankVal = (rank: string) => {
      const order = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
      return order.indexOf(rank);
  };

  // --- RENDER ---

  if (gameState === 'SEARCHING') {
      return (
          <div className="flex flex-col items-center justify-center h-full bg-[#050505] relative overflow-hidden">
               {/* Radar Effect */}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div className="w-[60vw] h-[60vw] rounded-full border border-royal-gold/20 animate-ping absolute"></div>
                   <div className="w-[40vw] h-[40vw] rounded-full border border-royal-gold/40 animate-ping delay-75 absolute"></div>
                   <div className="w-[20vw] h-[20vw] rounded-full bg-royal-gold/10 animate-pulse absolute"></div>
               </div>

               <div className="z-10 flex flex-col items-center">
                   <Search className="text-royal-gold w-12 h-12 mb-4 animate-bounce" />
                   <h2 className="text-2xl font-cinzel text-royal-gold tracking-widest">SEARCHING</h2>
                   <p className="text-om-cream/50 font-mono mt-2 text-xs uppercase">Looking for opponent...</p>
                   <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                       <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                       <span className="text-xs text-white/60">Bet: ${bet}</span>
                   </div>
               </div>

               <button 
                  onClick={cancelSearch}
                  className="mt-12 text-white/30 text-xs hover:text-white uppercase tracking-widest z-20"
               >
                   Cancel
               </button>
          </div>
      );
  }

  return (
    <div className="flex flex-col h-full w-full bg-[#050a08] relative overflow-hidden">
        
        {gameState === 'IDLE' || gameState === 'RESULT' ? (
             <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                 {gameState === 'RESULT' && (
                     <div className="mb-12">
                         <h2 className={`text-4xl font-cinzel font-bold mb-2 ${message.includes('VICTORY') ? 'text-green-500' : 'text-red-500'}`}>
                             {message.includes('VICTORY') ? 'YOU WON' : 'YOU LOST'}
                         </h2>
                         <p className="text-royal-gold text-lg">${message.includes('VICTORY') ? bet * 2 : 0}</p>
                     </div>
                 )}
                 
                 <div className="bg-royal-wood/50 p-6 rounded-xl border border-royal-gold/20 w-full max-w-sm">
                     <Users className="text-royal-gold w-12 h-12 mx-auto mb-4" />
                     <h2 className="text-2xl font-playfair text-om-cream mb-2">Online PvP</h2>
                     <p className="text-white/40 text-sm mb-6">Play Durak with real players worldwide. Winner takes all.</p>
                     
                     <BettingControls 
                        balance={balance}
                        currentBet={bet}
                        onBetChange={setBet}
                        onAction={startSearch}
                        actionLabel="FIND MATCH"
                     />
                 </div>
             </div>
        ) : (
            <>
                {/* Top Info Bar */}
                <div className="flex justify-between items-center px-4 py-3 bg-black/60 border-b border-royal-gold/10 z-20 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-900 to-black border border-white/20 flex items-center justify-center">
                             <User size={14} className="text-white/70" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-royal-gold font-bold">{opponentName}</span>
                            <span className="text-[9px] text-white/40">{opponentHand.length} Cards</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                         <div className="flex items-center gap-1 text-green-400 font-mono text-xs font-bold">
                             ${bet * 2} <span className="text-[9px] text-white/30 uppercase">POT</span>
                         </div>
                         <div className="text-[9px] text-white/30">Deck: {deck.length}</div>
                    </div>
                </div>

                {/* Opponent Area */}
                <div className="h-[12vh] w-full flex justify-center items-start pt-2 -space-x-[clamp(10px,2vw,20px)]">
                    {opponentHand.map((_, i) => (
                        <div key={i} className="w-[clamp(40px,12vw,60px)] h-[clamp(56px,17vw,84px)] bg-vip-leather border border-white/10 rounded-md shadow-lg transform rotate-180" >
                             <div className="w-full h-full bg-royal-gold/5 flex items-center justify-center">
                                 <div className="w-6 h-6 rounded-full border border-royal-gold/20 flex items-center justify-center">
                                     <span className="text-royal-gold/20 font-serif font-bold text-xs">R</span>
                                 </div>
                             </div>
                        </div>
                    ))}
                </div>

                {/* Table Area */}
                <div className="flex-1 flex items-center justify-center w-full relative z-10 px-4">
                    {/* Trump Display */}
                    {trump && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 scale-75 origin-left opacity-60">
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[9px] uppercase tracking-widest text-royal-gold">Trump</span>
                                <PlayingCard card={trump} />
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4 flex-wrap justify-center content-center max-w-[80%] pl-12">
                        {table.map((pair, i) => (
                            <div key={i} className="relative w-[clamp(60px,18vw,90px)] h-[clamp(84px,25vw,126px)]">
                                <div className="absolute inset-0 transform -rotate-2 shadow-lg">
                                    <PlayingCard card={pair.attack} className="w-full h-full" />
                                </div>
                                {pair.defense && (
                                    <div className="absolute inset-0 transform translate-x-[20%] translate-y-[20%] rotate-6 z-20 shadow-[0_5px_20px_rgba(0,0,0,0.6)]">
                                        <PlayingCard card={pair.defense} className="w-full h-full" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Toast Message */}
                <div className="absolute top-[45%] left-1/2 -translate-x-1/2 pointer-events-none z-30 w-full flex justify-center">
                    {message && (
                        <span className="bg-black/80 px-6 py-2 rounded-full text-royal-gold border border-royal-gold/30 text-xs md:text-sm font-cinzel tracking-wider backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.2)] animate-fade-in">
                            {message}
                        </span>
                    )}
                </div>

                {/* Action Button for Player */}
                {isPlayerTurn && (
                    <div className="absolute bottom-[28vh] right-4 z-40">
                         <button 
                             onClick={playerDone}
                             className={`
                                px-6 py-3 rounded-full shadow-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 flex items-center gap-2
                                ${isPlayerDefending 
                                    ? 'bg-red-900/90 text-red-100 border border-red-500/50 hover:bg-red-800' 
                                    : 'bg-royal-gold text-black border border-white/20 hover:brightness-110'}
                             `}
                         >
                             {isPlayerDefending ? <Shield size={14} /> : <Swords size={14} />}
                             {isPlayerDefending ? "Take" : "Done"}
                         </button>
                    </div>
                )}

                {/* Player Hand */}
                <div 
                    ref={handContainerRef}
                    className="w-full h-[clamp(110px,30vh,240px)] flex items-end justify-center overflow-x-auto overflow-y-hidden px-4 pb-safe scrollbar-hide z-20 bg-gradient-to-t from-black via-black/80 to-transparent"
                >
                    <div className="flex items-end -space-x-[clamp(30px,9vw,60px)] min-w-min px-[5vw] pb-4">
                        {playerHand.map((c, i) => (
                            <div 
                                key={i} 
                                onClick={() => handleCardClick(i)}
                                className={`
                                    transition-all duration-200 origin-bottom z-auto hover:z-50 cursor-pointer
                                    ${isPlayerTurn ? 'hover:-translate-y-6' : 'opacity-80 grayscale-[0.3]'}
                                `}
                            >
                                <PlayingCard card={c} selected={false} className="shadow-[0_-5px_20px_rgba(0,0,0,0.6)]" />
                            </div>
                        ))}
                    </div>
                </div>
            </>
        )}
    </div>
  );
};

export default DurakGame;