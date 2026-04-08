import React from 'react';
import { FicheComponent } from '../fiches/Fiche';
import { getFicheByValue } from '../fiches/FicheData';
import './GameCard.css';

interface GameCardProps {
  title: string;
  icon: React.ReactNode;
  description?: string;
  onPlay: () => void;
  minBet?: number;
  maxBet?: number;
  jackpot?: number;
  players?: number;
  hot?: boolean;
  new?: boolean;
  disabled?: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({
  title,
  icon,
  description,
  onPlay,
  minBet,
  maxBet,
  jackpot,
  players,
  hot = false,
  new: isNew = false,
  disabled = false,
}) => {
  const jackpotFiche = jackpot ? getFicheByValue(jackpot) : null;

  return (
    <div 
      className={`game-card ${hot ? 'game-card--hot' : ''} ${disabled ? 'game-card--disabled' : ''}`}
      onClick={!disabled ? onPlay : undefined}
    >
      {/* Glass background */}
      <div className="game-card__glass"></div>
      
      {/* Hot badge */}
      {hot && (
        <div className="game-card__badge game-card__badge--hot">
          🔥 HOT
        </div>
      )}
      
      {/* New badge */}
      {isNew && (
        <div className="game-card__badge game-card__badge--new">
          ✨ NEW
        </div>
      )}
      
      {/* Content */}
      <div className="game-card__content">
        {/* Icon */}
        <div className="game-card__icon">
          {icon}
        </div>
        
        {/* Title */}
        <h3 className="game-card__title">{title}</h3>
        
        {/* Description */}
        {description && (
          <p className="game-card__description">{description}</p>
        )}
        
        {/* Stats */}
        <div className="game-card__stats">
          {minBet !== undefined && (
            <div className="game-card__stat">
              <span className="stat-label">Min Bet</span>
              <span className="stat-value">${minBet.toLocaleString()}</span>
            </div>
          )}
          
          {maxBet !== undefined && (
            <div className="game-card__stat">
              <span className="stat-label">Max Bet</span>
              <span className="stat-value">${maxBet.toLocaleString()}</span>
            </div>
          )}
          
          {jackpot && jackpotFiche && (
            <div className="game-card__stat game-card__stat--jackpot">
              <span className="stat-label">Jackpot</span>
              <div className="jackpot-fiche">
                <FicheComponent fiche={jackpotFiche} size="small" animated={true} />
              </div>
            </div>
          )}
          
          {players !== undefined && (
            <div className="game-card__stat">
              <span className="stat-label">Players</span>
              <span className="stat-value">{players.toLocaleString()}</span>
            </div>
          )}
        </div>
        
        {/* Play button */}
        <button className="game-card__play-btn" disabled={disabled}>
          {disabled ? 'Coming Soon' : 'Play Now'}
        </button>
      </div>
      
      {/* Animated border glow */}
      <div className="game-card__glow"></div>
      
      {/* Particle effects for hot games */}
      {hot && (
        <div className="game-card__particles">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                animationDelay: `${i * 0.3}s`,
                left: `${20 + (i * 15)}%`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GameCard;
