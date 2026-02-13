import React, { useState } from 'react';
import { WHEEL_NUMBERS, RED_NUMBERS, MULTIPLIERS } from '../../constants';
import { BetType } from '../../types';
import RouletteWheel from '../RouletteWheel';
import { RotateCw, X } from 'lucide-react';
import BettingControls from '../shared/BettingControls';

interface RouletteGameProps {
  balance: number;
  onUpdateBalance: (delta: number) => void;
}

const RouletteGame: React.FC<RouletteGameProps> = ({ balance, onUpdateBalance }) => {
  const [currentBetType, setCurrentBetType] = useState<BetType | null>(null);
  const [currentBetAmount, setCurrentBetAmount] = useState<number>(0);
  const [selectedChip, setSelectedChip] = useState<number>(10);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [message, setMessage] = useState("Place your bets");

  const handlePlaceBet = (type: BetType) => {
    if (isSpinning || balance < selectedChip) return;
    
    if (currentBetType !== type && currentBetAmount > 0) {
        onUpdateBalance(currentBetAmount);
        setCurrentBetAmount(0);
    }
    
    onUpdateBalance(-selectedChip);
    setCurrentBetAmount(prev => prev + selectedChip);
    setCurrentBetType(type);
    setMessage(`${type}: ${currentBetAmount + selectedChip}`);
  };

  const clearBet = () => {
      if (isSpinning || currentBetAmount === 0) return;
      onUpdateBalance(currentBetAmount);
      setCurrentBetAmount(0);
      setCurrentBetType(null);
      setMessage("Bets Cleared");
  };

  const spinWheel = () => {
    if (isSpinning || currentBetAmount === 0) return;
    setIsSpinning(true);
    const randomIndex = Math.floor(Math.random() * WHEEL_NUMBERS.length);
    const winningNumber = WHEEL_NUMBERS[randomIndex];
    const sectorAngle = 360 / 37;
    // АДАПТИВ: Добавляем randomize для визуальной вариативности
    const extraSpins = 5; 
    const targetRotation = 360 * extraSpins - (randomIndex * sectorAngle); 
    const nextRotation = rotation + targetRotation + ((Math.random() * 8) - 4);
    setRotation(nextRotation);

    setTimeout(() => {
        setIsSpinning(false);
        const isRed = RED_NUMBERS.includes(winningNumber);
        const isZero = winningNumber === 0;
        let won = false;
        if (currentBetType === 'RED' && isRed) won = true;
        if (currentBetType === 'BLACK' && !isRed && !isZero) won = true;
        if (currentBetType === 'GREEN' && isZero) won = true;
        
        if (won) {
            const mult = currentBetType === 'GREEN' ? MULTIPLIERS.GREEN : 2;
            const win = currentBetAmount * mult;
            onUpdateBalance(win);
            setMessage(`WIN ${winningNumber}! +${win}`);
        } else {
            setMessage(`LOSE ${winningNumber}`);
        }
        setCurrentBetAmount(0);
        setCurrentBetType(null);
    }, 4500);
  };

  return (
    // АДАПТИВ: Flex-col h-full для распределения пространства
    <div className="flex flex-col h-full w-full bg-royal-bg overflow-hidden relative">
      
      {/* Wheel Area */}
      {/* АДАПТИВ: min-h-0 позволяет колесу сжиматься на горизонтальных экранах */}
      <div className="flex-1 flex items-center justify-center p-4 min-h-0 w-full relative">
         {/* АДАПТИВ: clamp() ограничивает размер колеса. min(85vw, 45vh) гарантирует вписывание */}
         <div className="relative w-[min(85vw,45vh)] aspect-square max-w-[500px]">
            <div style={{containerType: 'size'}} className="w-full h-full">
                <RouletteWheel rotation={rotation} isSpinning={isSpinning} />
            </div>
            {/* АДАПТИВ: Абсолютное позиционирование сообщения поверх колеса */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40">
                <span className="bg-black/80 px-4 py-1.5 rounded-full border border-royal-gold/50 text-royal-gold text-[clamp(12px,4vw,16px)] whitespace-nowrap backdrop-blur-md shadow-[0_0_15px_black]">
                    {message}
                </span>
            </div>
         </div>
      </div>

      {/* Betting Board */}
      <div className="w-full max-w-lg mx-auto px-4 pb-2 z-10 shrink-0">
          {/* АДАПТИВ: Высота кнопок через clamp/vh для удобного нажатия */}
          <div className="grid grid-cols-4 gap-2 h-[clamp(50px,8vh,70px)]">
                 <button 
                    onClick={() => handlePlaceBet('GREEN')} 
                    className={`col-span-1 rounded-l-lg border border-white/10 font-black text-white active:scale-95 transition-transform ${currentBetType === 'GREEN' ? 'bg-green-600 ring-2 ring-white shadow-[0_0_15px_green]' : 'bg-gradient-to-br from-green-900 to-green-950'}`}
                 >
                    0
                 </button>
                 <button 
                    onClick={() => handlePlaceBet('RED')} 
                    className={`col-span-1 border border-white/10 font-bold text-white active:scale-95 transition-transform ${currentBetType === 'RED' ? 'bg-red-600 ring-2 ring-white shadow-[0_0_15px_red]' : 'bg-gradient-to-br from-red-900 to-red-950'}`}
                 >
                    Red
                 </button>
                 <button 
                    onClick={() => handlePlaceBet('BLACK')} 
                    className={`col-span-1 border border-white/10 font-bold text-white active:scale-95 transition-transform ${currentBetType === 'BLACK' ? 'bg-gray-700 ring-2 ring-white shadow-[0_0_15px_gray]' : 'bg-gradient-to-br from-gray-900 to-black'}`}
                 >
                    Black
                 </button>
                 <button 
                    onClick={spinWheel} 
                    disabled={isSpinning || currentBetAmount === 0} 
                    className="col-span-1 bg-gradient-to-br from-royal-gold to-yellow-700 rounded-r-lg text-black font-black flex items-center justify-center shadow-gold-glow disabled:opacity-50 disabled:shadow-none hover:brightness-110 active:scale-95 transition-all"
                 >
                    <RotateCw size={24} className={isSpinning ? 'animate-spin' : ''} />
                 </button>
          </div>
      </div>

      <BettingControls 
          balance={balance}
          currentBet={selectedChip}
          onBetChange={setSelectedChip}
          chipMode={true}
          isGameActive={isSpinning}
      >
          <div className="flex justify-between items-center px-1 mb-2">
              <span className="text-[10px] md:text-xs text-royal-gold/70 uppercase font-bold tracking-widest">Total Bet: {currentBetAmount}</span>
              <button 
                onClick={clearBet} 
                disabled={isSpinning || currentBetAmount === 0} 
                className="flex items-center gap-1 text-[10px] bg-red-900/30 text-red-200 px-3 py-1.5 rounded border border-red-500/30 hover:bg-red-900/50 active:scale-95 transition-all"
              >
                  <X size={12} /> CLEAR
              </button>
          </div>
      </BettingControls>
    </div>
  );
};

export default RouletteGame;