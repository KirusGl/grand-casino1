import React, { useState } from 'react';
import { FICHES, Fiche, getFichesByRarity } from './FicheData';
import { FicheComponent } from './Fiche';
import './FicheSelector.css';

interface FicheSelectorProps {
  selectedValue?: number;
  onSelect?: (fiche: Fiche) => void;
  filterByRarity?: Fiche['rarity'] | 'all';
  showSearch?: boolean;
  className?: string;
}

export const FicheSelector: React.FC<FicheSelectorProps> = ({
  selectedValue,
  onSelect,
  filterByRarity = 'all',
  showSearch = true,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRarity, setActiveRarity] = useState<Fiche['rarity'] | 'all'>(filterByRarity);

  const filteredFiches = FICHES.filter(fiche => {
    const matchesRarity = activeRarity === 'all' || fiche.rarity === activeRarity;
    const matchesSearch = searchTerm === '' || 
      fiche.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fiche.value.toString().includes(searchTerm);
    return matchesRarity && matchesSearch;
  });

  const rarities: (Fiche['rarity'] | 'all')[] = ['all', 'common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'divine'];

  const handleFicheClick = (fiche: Fiche) => {
    if (onSelect) {
      onSelect(fiche);
    }
  };

  return (
    <div className={`fiche-selector ${className}`}>
      {/* Search bar */}
      {showSearch && (
        <div className="fiche-selector__search">
          <input
            type="text"
            placeholder="Search fiches by name or value..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="fiche-selector__search-input"
          />
        </div>
      )}

      {/* Rarity filter tabs */}
      <div className="fiche-selector__filters">
        {rarities.map(rarity => (
          <button
            key={rarity}
            className={`fiche-selector__filter-btn fiche-selector__filter-btn--${rarity} ${
              activeRarity === rarity ? 'active' : ''
            }`}
            onClick={() => setActiveRarity(rarity)}
          >
            {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats summary */}
      <div className="fiche-selector__stats">
        <span>Showing {filteredFiches.length} of {FICHES.length} fiches</span>
        {selectedValue && (
          <span> | Selected: {selectedValue.toLocaleString()}</span>
        )}
      </div>

      {/* Fiches grid */}
      <div className="fiche-selector__grid">
        {filteredFiches.map(fiche => (
          <div
            key={fiche.id}
            className={`fiche-selector__item ${selectedValue === fiche.value ? 'selected' : ''}`}
            onClick={() => handleFicheClick(fiche)}
          >
            <FicheComponent
              fiche={fiche}
              size="medium"
              animated={true}
              showValue={true}
              showName={true}
            />
            <div className="fiche-selector__item-info">
              <div className="fiche-name">{fiche.name}</div>
              <div className="fiche-rarity">{fiche.rarity}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredFiches.length === 0 && (
        <div className="fiche-selector__empty">
          <p>No fiches found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default FicheSelector;
