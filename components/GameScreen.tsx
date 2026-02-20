import React from 'react';
import { GameType } from '../types';
import { ArrowLeft } from 'lucide-react';
import RouletteGame from './games/RouletteGame';
import BlackjackGame from './games/BlackjackGame';
import SlotsGame from './games/SlotsGame';
import PokerGame from './games/PokerGame';
import DiceGame from './games/DiceGame';
import RocketGame from './games/RocketGame';
import MinesGame from './games/MinesGame';
import DurakGame from './games/DurakGame';

interface GameScreenProps {
  gameType: GameType;
  balance: number;
  onUpdateBalance: (delta: number) => void;
  onBackToLobby: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ gameType, balance, onUpdateBalance, onBackToLobby }) => {
  const renderGame = () => {
    const props = {
      balance,
      onUpdateBalance,
    };

    switch (gameType) {
      case GameType.ROULETTE: return <RouletteGame {...props} />;
      case GameType.BLACKJACK: return <BlackjackGame {...props} />;
      case GameType.SLOTS: return <SlotsGame {...props} />;
      case GameType.POKER: return <PokerGame {...props} />;
      case GameType.DICE: return <DiceGame {...props} />;
      case GameType.ROCKET: return <RocketGame {...props} />;
      case GameType.MINES: return <MinesGame {...props} />;
      case GameType.DURAK: return <DurakGame {...props} />;
      default: return <div className="p-10 text-center text-white/40 font-sans">Game Under Construction</div>;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden relative shadow-inner">
      <div className="relative z-30 pt-safe px-4 pb-2 bg-black/90 backdrop-blur-xl border-b border-royal-gold/10 shadow-2xl">
        <div className="flex justify-between items-center h-12">
            <button onClick={onBackToLobby} className="p-2 -ml-2 text-white/30 active:text-white transition-all">
                <ArrowLeft size={20} />
            </button>
            
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                 <span className="font-black text-om-gold text-[10px] tracking-[0.2em] uppercase leading-none">
                    {gameType.replace('_', ' ')}
                 </span>
            </div>

            <div className="flex items-center gap-3">
               <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                   <span className="block font-black text-om-cream text-base leading-none tracking-tight">${balance.toLocaleString()}</span>
               </div>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative bg-[#050505]">
         <div className="relative z-0 h-full w-full">
            {renderGame()}
         </div>
      </div>
    </div>
  );
};

export default GameScreen;