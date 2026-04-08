import React from 'react';
import { Fiche } from './FicheData';
import './Fiche.css';

interface FicheComponentProps {
  fiche: Fiche;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  animated?: boolean;
  onClick?: () => void;
  showValue?: boolean;
  showName?: boolean;
  className?: string;
}

export const FicheComponent: React.FC<FicheComponentProps> = ({
  fiche,
  size = 'medium',
  animated = true,
  onClick,
  showValue = true,
  showName = false,
  className = '',
}) => {
  const sizeClass = `fiche--${size}`;
  const animatedClass = animated ? 'fiche--animated' : '';
  const rarityClass = `fiche--${fiche.rarity}`;

  return (
    <div
      className={`fiche ${sizeClass} ${animatedClass} ${rarityClass} ${className}`}
      onClick={onClick}
      style={{
        background: fiche.gradient,
        boxShadow: fiche.glow,
      }}
    >
      {/* Glass overlay effect */}
      <div className="fiche__glass-overlay"></div>
      
      {/* Animated particles for rare+ fiches */}
      {fiche.effect && (
        <div className={`fiche__effect fiche__effect--${fiche.effect}`}>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="fiche__particle"
              style={{
                animationDelay: `${i * 0.2}s`,
                background: fiche.color,
              }}
            />
          ))}
        </div>
      )}

      {/* Value display */}
      {showValue && (
        <div className="fiche__value">
          <span>{fiche.value.toLocaleString()}</span>
        </div>
      )}

      {/* Name tooltip on hover */}
      {showName && (
        <div className="fiche__name">
          {fiche.name}
        </div>
      )}

      {/* Rarity indicator */}
      <div className={`fiche__rarity-indicator fiche__rarity-indicator--${fiche.rarity}`}>
        <div className="rarity-dot"></div>
      </div>

      {/* Shine effect */}
      <div className="fiche__shine"></div>
    </div>
  );
};

export default FicheComponent;
