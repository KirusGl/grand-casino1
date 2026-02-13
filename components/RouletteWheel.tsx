import React, { useMemo } from 'react';
import { WHEEL_NUMBERS, RED_NUMBERS } from '../constants';

interface RouletteWheelProps {
  rotation: number;
  isSpinning: boolean;
  targetNumber?: number | null;
}

const RouletteWheel: React.FC<RouletteWheelProps> = ({ rotation, isSpinning }) => {
  const numSectors = WHEEL_NUMBERS.length;
  const sectorAngle = 360 / numSectors;

  // Old Money Wheel Colors: Wine instead of bright red, darker black, deep emerald zero
  const conicGradient = useMemo(() => {
    let gradient = 'conic-gradient(';
    WHEEL_NUMBERS.forEach((num, i) => {
      let color = '#1a1a1a'; // Standard Black
      if (num === 0) color = '#0b2d1f'; // Deep Emerald
      else if (RED_NUMBERS.includes(num)) color = '#4a0e26'; // Deep Wine (Replacing Red)
      
      const start = i * sectorAngle;
      const end = (i + 1) * sectorAngle;
      gradient += `${color} ${start}deg ${end}deg, `;
    });
    return gradient.slice(0, -2) + ')';
  }, [sectorAngle]);

  return (
    <div className="relative w-full h-full aspect-square flex items-center justify-center">
      
      {/* 1. OUTER RIM - Wood & Gold */}
      <div className="absolute inset-0 rounded-full border-[clamp(12px,4vw,24px)] border-om-wood shadow-[0_0_30px_black] z-20 pointer-events-none ring-4 ring-om-gold/30"></div>

      {/* 2. SPINNING CONTAINER */}
      <div
        className="relative w-[90%] h-[90%] rounded-full overflow-hidden will-change-transform z-10 shadow-inner"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0, 0.15, 1)' : 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        {/* Sectors */}
        <div className="absolute inset-0 rounded-full" style={{ background: conicGradient }} />
        
        {/* Separator Lines (Gold) */}
        <div className="absolute inset-0 rounded-full opacity-30" 
             style={{ background: `repeating-conic-gradient(from 0deg, transparent 0deg ${sectorAngle - 0.2}deg, #c5a059 ${sectorAngle - 0.2}deg ${sectorAngle}deg)` }} 
        />
        
        {/* Numbers */}
        {WHEEL_NUMBERS.map((num, i) => {
             const angle = (i + 0.5) * sectorAngle;
             return (
                 <div
                    key={num}
                    className="absolute top-1/2 left-1/2 text-om-cream font-playfair font-bold origin-center"
                    style={{
                        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-40%)`,
                        height: '100%',
                        fontSize: 'clamp(8px, 2.5cqw, 14px)',
                        textShadow: '1px 1px 2px black'
                    }}
                 >
                    <span className="block pt-1">{num}</span>
                 </div>
             )
        })}

        {/* Inner Hub - Gold & Wood */}
        <div className="absolute inset-0 m-auto w-[55%] h-[55%] bg-om-wood rounded-full border-4 border-om-gold/50 flex items-center justify-center shadow-[0_0_20px_black] bg-wood-texture">
            <div className="w-[30%] h-[30%] bg-gradient-to-br from-om-gold to-[#8a6e2f] rounded-full shadow-lg border border-white/20"></div>
        </div>
      </div>

      {/* 3. INDICATOR - A precious gem or metal pointer */}
      <div className="absolute -top-[1%] left-1/2 -translate-x-1/2 z-30 drop-shadow-xl">
        <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[20px] border-transparent border-t-om-cream filter drop-shadow"></div>
      </div>
    </div>
  );
};

export default RouletteWheel;