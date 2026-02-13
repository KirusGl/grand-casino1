import React, { useEffect, useState } from 'react';
import { CHIP_VALUES } from '../../constants';
import { Plus, Minus } from 'lucide-react';

interface BettingControlsProps {
  balance: number;
  currentBet: number;
  onBetChange: (amount: number) => void;
  onAction?: () => void;
  actionLabel?: string; 
  isGameActive?: boolean;
  minBet?: number;
  maxBet?: number;
  chipMode?: boolean; 
  children?: React.ReactNode; 
}

const BettingControls: React.FC<BettingControlsProps> = ({
  balance,
  currentBet,
  onBetChange,
  onAction,
  actionLabel = "PLAY",
  isGameActive = false,
  minBet = 10,
  maxBet = balance,
  chipMode = false,
  children
}) => {
  const [inputValue, setInputValue] = useState(currentBet.toString());

  useEffect(() => {
    setInputValue(currentBet.toString());
  }, [currentBet]);

  const handleValidation = (val: number) => {
    if (isNaN(val)) return;
    let newBet = Math.max(minBet, val);
    if (!chipMode) {
        newBet = Math.min(newBet, balance);
    }
    onBetChange(newBet);
  };

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, ''); 
    setInputValue(raw);
    const val = parseInt(raw);
    if (!isNaN(val)) {
        onBetChange(Math.min(val, balance));
    }
  };

  const handleBlur = () => handleValidation(parseInt(inputValue));
  const adjustBet = (delta: number) => handleValidation(currentBet + delta);
  const setExactBet = (amount: number) => handleValidation(amount);
  const handleMax = () => handleValidation(balance);

  return (
    <div className="w-full bg-[#0a1410] border-t border-royal-gold/20 p-3 pb-safe shrink-0 z-40 relative shadow-[0_-10px_40px_rgba(0,0,0,1)]">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-royal-gold/50 to-transparent"></div>
      
      <div className="max-w-md mx-auto w-full flex flex-col gap-3">
        {children && <div>{children}</div>}

        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {CHIP_VALUES.map((val) => (
            <button
              key={val}
              disabled={isGameActive}
              onClick={() => setExactBet(val)}
              className={`
                flex-1 min-w-[3.2rem] h-10 rounded-sm font-bold font-playfair text-xs transition-all
                flex items-center justify-center border
                ${currentBet === val 
                  ? 'bg-om-matte-green text-royal-gold border-royal-gold shadow-lg scale-105' 
                  : 'bg-black/60 text-white/30 border-white/5 hover:border-royal-gold/30'}
              `}
            >
              {val}
            </button>
          ))}
          {!chipMode && (
             <button onClick={handleMax} disabled={isGameActive} className="px-3 h-10 rounded-sm bg-black/40 border border-white/5 text-[9px] text-royal-gold/40 tracking-widest uppercase">MAX</button>
          )}
        </div>

        <div className="flex gap-2 h-12">
            <div className="flex-1 flex bg-black/80 rounded-sm border border-white/5">
                <button onClick={() => adjustBet(-10)} disabled={isGameActive} className="w-10 flex items-center justify-center text-white/20 active:bg-white/5 border-r border-white/5"><Minus size={14} /></button>
                <div className="flex-1 relative flex items-center justify-center">
                    <input type="text" inputMode="numeric" value={inputValue} onChange={handleManualInput} onBlur={handleBlur} disabled={isGameActive} className="w-full h-full bg-transparent text-center text-om-cream font-bold text-lg outline-none" />
                </div>
                <button onClick={() => adjustBet(10)} disabled={isGameActive} className="w-10 flex items-center justify-center text-white/20 active:bg-white/5 border-l border-white/5"><Plus size={14} /></button>
            </div>

            {onAction && (
                <button
                    onClick={onAction}
                    disabled={isGameActive}
                    className={`flex-[1.5] rounded-sm font-cinzel font-bold text-sm tracking-widest uppercase shadow-xl transition-all active:scale-[0.98] border border-royal-gold/40 ${
                        isGameActive ? 'bg-white/5 text-white/10' : 'bg-om-matte-green text-royal-gold-light'
                    }`}
                >
                    {actionLabel}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default BettingControls;