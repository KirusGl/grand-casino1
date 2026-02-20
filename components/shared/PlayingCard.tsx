import React from 'react';
import { Card } from '../../utils/cardUtils';
import { Heart, Diamond, Club, Spade } from 'lucide-react';

interface PlayingCardProps {
  card?: Card;
  hidden?: boolean;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
}

const PlayingCard: React.FC<PlayingCardProps> = ({ card, hidden, className = '', selected, onClick }) => {
  const dimensions = "w-[clamp(50px,16vw,100px)] h-[clamp(70px,22.4vw,140px)]";
  const zIndex = selected ? 'z-50' : 'z-auto hover:z-40';
  
  const baseClasses = `
    relative rounded-lg shadow-xl select-none transition-all duration-300
    ${dimensions}
    flex items-center justify-center overflow-hidden border border-gray-200
    ${selected ? 'ring-2 ring-royal-gold -translate-y-4 shadow-[0_10px_20px_rgba(0,0,0,0.5)]' : 'hover:-translate-y-2'}
    ${onClick ? 'cursor-pointer active:scale-95' : ''}
    ${zIndex}
    ${className}
  `;

  // Elite Card Back Design
  if (hidden || !card) {
    return (
      <div className={`${baseClasses} bg-om-burgundy border-royal-gold/30 p-1.5`}>
        <div className="w-full h-full relative rounded-md overflow-hidden bg-gradient-to-br from-[#1a0505] to-[#3d0a14] border border-royal-gold/20 flex items-center justify-center">
          {/* Filigree Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #c5a059 1px, transparent 0)`, backgroundSize: '8px 8px' }}></div>
          
          {/* Ornate Inner Border */}
          <div className="absolute inset-2 border border-royal-gold/20 rounded pointer-events-none"></div>
          
          {/* Center Emblem */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-[clamp(24px,8vw,40px)] h-[clamp(24px,8vw,40px)] rounded-full bg-gold-gradient p-0.5 shadow-gold-glow">
              <div className="w-full h-full rounded-full bg-om-burgundy flex items-center justify-center">
                 <span className="font-cinzel font-black text-om-gold text-[clamp(0.6rem,2vw,1rem)]">R</span>
              </div>
            </div>
          </div>
          
          {/* Corner Decorations */}
          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-royal-gold/40"></div>
          <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-royal-gold/40"></div>
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-royal-gold/40"></div>
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-royal-gold/40"></div>
        </div>
      </div>
    );
  }

  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
  const Icon = card.suit === 'hearts' ? Heart : card.suit === 'diamonds' ? Diamond : card.suit === 'clubs' ? Club : Spade;

  return (
    <div onClick={onClick} className={`${baseClasses} bg-[#fdfbf7]`}>
      {/* Top Left Corner */}
      <div className={`absolute top-[6%] left-[6%] flex flex-col items-center leading-none ${isRed ? 'text-[#d40000]' : 'text-[#1a1a1a]'}`}>
        <span className="font-playfair font-bold text-[clamp(0.6rem,2.5vw,1.2rem)]">{card.rank}</span>
        <Icon className="w-[clamp(8px,2.5vw,16px)] h-[clamp(8px,2.5vw,16px)] mt-[2px]" fill="currentColor" />
      </div>

      {/* Center Art */}
      <div className={`flex items-center justify-center ${isRed ? 'text-[#d40000]' : 'text-[#1a1a1a]'}`}>
         {['J', 'Q', 'K', 'A'].includes(card.rank) ? (
             <div className="font-playfair font-black text-[clamp(1.2rem,5vw,2.5rem)] opacity-90 border-2 border-current rounded px-1">
                 {card.rank}
             </div>
         ) : (
             <Icon className="w-[clamp(24px,8vw,48px)] h-[clamp(24px,8vw,48px)]" fill="currentColor" />
         )}
      </div>

      {/* Bottom Right Corner */}
      <div className={`absolute bottom-[6%] right-[6%] flex flex-col items-center leading-none rotate-180 ${isRed ? 'text-[#d40000]' : 'text-[#1a1a1a]'}`}>
        <span className="font-playfair font-bold text-[clamp(0.6rem,2.5vw,1.2rem)]">{card.rank}</span>
        <Icon className="w-[clamp(8px,2.5vw,16px)] h-[clamp(8px,2.5vw,16px)] mt-[2px]" fill="currentColor" />
      </div>
    </div>
  );
};

export default PlayingCard;