// src/features/fiches/FicheData.ts

export interface Fiche {
  id: string;
  name: string;
  value: number;
  color: string;
  gradient: string;
  glow: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'divine';
  effect?: string;
  description: string;
}

export const FICHES: Fiche[] = [
  // Common (1-10) - Basic colors, simple effects
  { id: 'f001', name: 'Ember Spark', value: 1, color: '#ff6b35', gradient: 'linear-gradient(135deg, #ff6b35 0%, #f7c59f 100%)', glow: '0 0 10px rgba(255,107,53,0.6)', rarity: 'common', description: 'A warm spark to start your journey' },
  { id: 'f002', name: 'Ocean Breeze', value: 1, color: '#4ecdc4', gradient: 'linear-gradient(135deg, #4ecdc4 0%, #a8edea 100%)', glow: '0 0 10px rgba(78,205,196,0.6)', rarity: 'common', description: 'Cool as a seaside wind' },
  { id: 'f003', name: 'Forest Dew', value: 1, color: '#95e1d3', gradient: 'linear-gradient(135deg, #95e1d3 0%, #dce775 100%)', glow: '0 0 10px rgba(149,225,211,0.6)', rarity: 'common', description: 'Fresh morning dewdrops' },
  { id: 'f004', name: 'Lavender Mist', value: 1, color: '#dda0dd', gradient: 'linear-gradient(135deg, #dda0dd 0%, #f8bbd0 100%)', glow: '0 0 10px rgba(221,160,221,0.6)', rarity: 'common', description: 'Soft and soothing' },
  { id: 'f005', name: 'Sunset Glow', value: 1, color: '#ff8c42', gradient: 'linear-gradient(135deg, #ff8c42 0%, #f9d423 100%)', glow: '0 0 10px rgba(255,140,66,0.6)', rarity: 'common', description: 'Golden hour warmth' },
  { id: 'f006', name: 'Sky Blue', value: 1, color: '#87ceeb', gradient: 'linear-gradient(135deg, #87ceeb 0%, #e0f7fa 100%)', glow: '0 0 10px rgba(135,206,235,0.6)', rarity: 'common', description: 'Clear day skies' },
  { id: 'f007', name: 'Mint Fresh', value: 1, color: '#98ff98', gradient: 'linear-gradient(135deg, #98ff98 0%, #c1ffc1 100%)', glow: '0 0 10px rgba(152,255,152,0.6)', rarity: 'common', description: 'Crisp and refreshing' },
  { id: 'f008', name: 'Peach Blossom', value: 1, color: '#ffdab9', gradient: 'linear-gradient(135deg, #ffdab9 0%, #ffb6c1 100%)', glow: '0 0 10px rgba(255,218,185,0.6)', rarity: 'common', description: 'Delicate spring flowers' },
  { id: 'f009', name: 'Slate Gray', value: 1, color: '#708090', gradient: 'linear-gradient(135deg, #708090 0%, #b0c4de 100%)', glow: '0 0 10px rgba(112,128,144,0.6)', rarity: 'common', description: 'Steady and reliable' },
  { id: 'f010', name: 'Coral Reef', value: 1, color: '#ff7f50', gradient: 'linear-gradient(135deg, #ff7f50 0%, #ffa07a 100%)', glow: '0 0 10px rgba(255,127,80,0.6)', rarity: 'common', description: 'Vibrant underwater life' },

  // Uncommon (11-20) - Enhanced colors, subtle animations
  { id: 'f011', name: 'Crimson Tide', value: 5, color: '#dc143c', gradient: 'linear-gradient(135deg, #dc143c 0%, #ff6b6b 100%)', glow: '0 0 15px rgba(220,20,60,0.7)', rarity: 'uncommon', description: 'Rising waves of fortune' },
  { id: 'f012', name: 'Royal Purple', value: 5, color: '#6a0dad', gradient: 'linear-gradient(135deg, #6a0dad 0%, #ba55d3 100%)', glow: '0 0 15px rgba(106,13,173,0.7)', rarity: 'uncommon', description: 'Noble and distinguished' },
  { id: 'f013', name: 'Golden Sand', value: 5, color: '#daa520', gradient: 'linear-gradient(135deg, #daa520 0%, #ffd700 100%)', glow: '0 0 15px rgba(218,165,32,0.7)', rarity: 'uncommon', description: 'Desert treasures' },
  { id: 'f014', name: 'Electric Blue', value: 5, color: '#0066ff', gradient: 'linear-gradient(135deg, #0066ff 0%, #00ccff 100%)', glow: '0 0 15px rgba(0,102,255,0.7)', rarity: 'uncommon', description: 'Charged with energy' },
  { id: 'f015', name: 'Emerald Shine', value: 5, color: '#50c878', gradient: 'linear-gradient(135deg, #50c878 0%, #98fb98 100%)', glow: '0 0 15px rgba(80,200,120,0.7)', rarity: 'uncommon', description: 'Precious gem brilliance' },
  { id: 'f016', name: 'Amber Glow', value: 5, color: '#ffbf00', gradient: 'linear-gradient(135deg, #ffbf00 0%, #ffcc00 100%)', glow: '0 0 15px rgba(255,191,0,0.7)', rarity: 'uncommon', description: 'Ancient preserved light' },
  { id: 'f017', name: 'Rose Quartz', value: 5, color: '#f7cac9', gradient: 'linear-gradient(135deg, #f7cac9 0%, #feb4b4 100%)', glow: '0 0 15px rgba(247,202,201,0.7)', rarity: 'uncommon', description: 'Love and compassion' },
  { id: 'f018', name: 'Steel Silver', value: 5, color: '#c0c0c0', gradient: 'linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%)', glow: '0 0 15px rgba(192,192,192,0.7)', rarity: 'uncommon', description: 'Industrial strength' },
  { id: 'f019', name: 'Tangerine Dream', value: 5, color: '#ff9933', gradient: 'linear-gradient(135deg, #ff9933 0%, #ffad60 100%)', glow: '0 0 15px rgba(255,153,51,0.7)', rarity: 'uncommon', description: 'Citrus explosion' },
  { id: 'f020', name: 'Periwinkle', value: 5, color: '#ccccff', gradient: 'linear-gradient(135deg, #ccccff 0%, #e6e6ff 100%)', glow: '0 0 15px rgba(204,204,255,0.7)', rarity: 'uncommon', description: 'Twilight serenity' },

  // Rare (21-35) - Complex gradients, particle effects
  { id: 'f021', name: 'Dragon Fire', value: 25, color: '#ff4500', gradient: 'linear-gradient(135deg, #ff4500 0%, #ff8c00 50%, #ffd700 100%)', glow: '0 0 20px rgba(255,69,0,0.8)', rarity: 'rare', effect: 'particles', description: 'Breath of the ancient dragon' },
  { id: 'f022', name: 'Northern Lights', value: 25, color: '#00ff88', gradient: 'linear-gradient(135deg, #00ff88 0%, #00ffff 50%, #7b68ee 100%)', glow: '0 0 20px rgba(0,255,136,0.8)', rarity: 'rare', effect: 'aurora', description: 'Arctic dance of colors' },
  { id: 'f023', name: 'Volcanic Core', value: 25, color: '#8b0000', gradient: 'linear-gradient(135deg, #8b0000 0%, #ff4500 50%, #ff6347 100%)', glow: '0 0 20px rgba(139,0,0,0.8)', rarity: 'rare', effect: 'magma', description: 'Earth\'s burning heart' },
  { id: 'f024', name: 'Cosmic Dust', value: 25, color: '#4b0082', gradient: 'linear-gradient(135deg, #4b0082 0%, #8a2be2 50%, #9370db 100%)', glow: '0 0 20px rgba(75,0,130,0.8)', rarity: 'rare', effect: 'stars', description: 'Remnants of creation' },
  { id: 'f025', name: 'Phoenix Feather', value: 25, color: '#ff6347', gradient: 'linear-gradient(135deg, #ff6347 0%, #ffa500 50%, #ffd700 100%)', glow: '0 0 20px rgba(255,99,71,0.8)', rarity: 'rare', effect: 'rebirth', description: 'Risen from ashes' },
  { id: 'f026', name: 'Deep Ocean', value: 25, color: '#00008b', gradient: 'linear-gradient(135deg, #00008b 0%, #0000cd 50%, #4169e1 100%)', glow: '0 0 20px rgba(0,0,139,0.8)', rarity: 'rare', effect: 'waves', description: 'Mysteries of the abyss' },
  { id: 'f027', name: 'Thunder Strike', value: 25, color: '#ffd700', gradient: 'linear-gradient(135deg, #ffd700 0%, #ffff00 50%, #ffffff 100%)', glow: '0 0 20px rgba(255,215,0,0.8)', rarity: 'rare', effect: 'lightning', description: 'Power of the storm' },
  { id: 'f028', name: 'Jade Emperor', value: 25, color: '#00a86b', gradient: 'linear-gradient(135deg, #00a86b 0%, #00cd6b 50%, #7fff00 100%)', glow: '0 0 20px rgba(0,168,107,0.8)', rarity: 'rare', effect: 'wisdom', description: 'Imperial authority' },
  { id: 'f029', name: 'Ruby Romance', value: 25, color: '#e0115f', gradient: 'linear-gradient(135deg, #e0115f 0%, #ff1493 50%, #ff69b4 100%)', glow: '0 0 20px rgba(224,17,95,0.8)', rarity: 'rare', effect: 'passion', description: 'Love\'s fiery embrace' },
  { id: 'f030', name: 'Sapphire Sky', value: 25, color: '#0f52ba', gradient: 'linear-gradient(135deg, #0f52ba 0%, #4169e1 50%, #87ceeb 100%)', glow: '0 0 20px rgba(15,82,186,0.8)', rarity: 'rare', effect: 'clouds', description: 'Endless blue expanse' },
  { id: 'f031', name: 'Topaz Sun', value: 25, color: '#ffc87c', gradient: 'linear-gradient(135deg, #ffc87c 0%, #ffd700 50%, #ffef96 100%)', glow: '0 0 20px rgba(255,200,124,0.8)', rarity: 'rare', effect: 'rays', description: 'Midday brilliance' },
  { id: 'f032', name: 'Amethyst Dreams', value: 25, color: '#9966cc', gradient: 'linear-gradient(135deg, #9966cc 0%, #ba55d3 50%, #dda0dd 100%)', glow: '0 0 20px rgba(153,102,204,0.8)', rarity: 'rare', effect: 'mist', description: 'Mystical visions' },
  { id: 'f033', name: 'Copper Coin', value: 25, color: '#b87333', gradient: 'linear-gradient(135deg, #b87333 0%, #cd7f32 50%, #daa520 100%)', glow: '0 0 20px rgba(184,115,51,0.8)', rarity: 'rare', effect: 'shine', description: 'Old world wealth' },
  { id: 'f034', name: 'Platinum Edge', value: 25, color: '#e5e4e2', gradient: 'linear-gradient(135deg, #e5e4e2 0%, #f0f0f0 50%, #ffffff 100%)', glow: '0 0 20px rgba(229,228,226,0.8)', rarity: 'rare', effect: 'blade', description: 'Sharp and precious' },
  { id: 'f035', name: 'Obsidian Night', value: 25, color: '#36454f', gradient: 'linear-gradient(135deg, #36454f 0%, #696969 50%, #a9a9a9 100%)', glow: '0 0 20px rgba(54,69,79,0.8)', rarity: 'rare', effect: 'void', description: 'Darkness refined' },

  // Epic (36-50) - Animated shaders, unique patterns
  { id: 'f036', name: 'Galaxy Swirl', value: 100, color: '#9400d3', gradient: 'radial-gradient(circle, #9400d3 0%, #4b0082 40%, #000000 100%)', glow: '0 0 30px rgba(148,0,211,0.9)', rarity: 'epic', effect: 'spiral', description: 'Spiral arms of destiny' },
  { id: 'f037', name: 'Solar Flare', value: 100, color: '#ff4500', gradient: 'radial-gradient(circle, #ffff00 0%, #ff8c00 40%, #ff4500 100%)', glow: '0 0 30px rgba(255,69,0,0.9)', rarity: 'epic', effect: 'eruption', description: 'Star\'s violent outburst' },
  { id: 'f038', name: 'Moonstone Magic', value: 100, color: '#f8f8ff', gradient: 'radial-gradient(circle, #ffffff 0%, #f0f8ff 40%, #e6e6fa 100%)', glow: '0 0 30px rgba(248,248,255,0.9)', rarity: 'epic', effect: 'lunar', description: 'Lunar enchantment' },
  { id: 'f039', name: 'Blood Diamond', value: 100, color: '#8a0303', gradient: 'radial-gradient(circle, #ff0000 0%, #8b0000 40%, #4a0000 100%)', glow: '0 0 30px rgba(138,3,3,0.9)', rarity: 'epic', effect: 'crimson', description: 'Forbidden perfection' },
  { id: 'f040', name: 'Titanium Storm', value: 100, color: '#87ceeb', gradient: 'linear-gradient(45deg, #87ceeb 0%, #c0c0c0 25%, #87ceeb 50%, #c0c0c0 75%, #87ceeb 100%)', glow: '0 0 30px rgba(135,206,235,0.9)', rarity: 'epic', effect: 'stripes', description: 'Unbreakable force' },
  { id: 'f041', name: 'Prism Light', value: 100, color: '#ff0000', gradient: 'conic-gradient(from 0deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000)', glow: '0 0 30px rgba(255,0,0,0.9)', rarity: 'epic', effect: 'rainbow', description: 'Full spectrum power' },
  { id: 'f042', name: 'Quantum Flux', value: 100, color: '#00ffff', gradient: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 50%, #00ffff 100%)', glow: '0 0 30px rgba(0,255,255,0.9)', rarity: 'epic', effect: 'oscillate', description: 'Reality bending energy' },
  { id: 'f043', name: 'Eternal Ice', value: 100, color: '#b0e0e6', gradient: 'linear-gradient(180deg, #ffffff 0%, #b0e0e6 50%, #4682b4 100%)', glow: '0 0 30px rgba(176,224,230,0.9)', rarity: 'epic', effect: 'frost', description: 'Frozen in time' },
  { id: 'f044', name: 'Inferno Core', value: 100, color: '#ff3000', gradient: 'radial-gradient(circle, #ffffff 0%, #ff3000 30%, #8b0000 100%)', glow: '0 0 30px rgba(255,48,0,0.9)', rarity: 'epic', effect: 'burn', description: 'Unquenchable fire' },
  { id: 'f045', name: 'Venom Green', value: 100, color: '#00ff00', gradient: 'linear-gradient(135deg, #00ff00 0%, #008000 50%, #006400 100%)', glow: '0 0 30px rgba(0,255,0,0.9)', rarity: 'epic', effect: 'toxic', description: 'Deadly allure' },
  { id: 'f046', name: 'Celestial Gold', value: 100, color: '#ffd700', gradient: 'radial-gradient(circle, #ffffff 0%, #ffd700 40%, #b8860b 100%)', glow: '0 0 30px rgba(255,215,0,0.9)', rarity: 'epic', effect: 'divine', description: 'Heavenly radiance' },
  { id: 'f047', name: 'Shadow Walker', value: 100, color: '#2f2f2f', gradient: 'linear-gradient(135deg, #000000 0%, #2f2f2f 50%, #696969 100%)', glow: '0 0 30px rgba(47,47,47,0.9)', rarity: 'epic', effect: 'stealth', description: 'Master of darkness' },
  { id: 'f048', name: 'Crystal Clear', value: 100, color: '#e0ffff', gradient: 'linear-gradient(135deg, #f0ffff 0%, #e0ffff 50%, #b0e0e6 100%)', glow: '0 0 30px rgba(224,255,255,0.9)', rarity: 'epic', effect: 'refract', description: 'Pure transparency' },
  { id: 'f049', name: 'Magma Flow', value: 100, color: '#ff8c00', gradient: 'linear-gradient(90deg, #8b0000 0%, #ff4500 25%, #ff8c00 50%, #ff4500 75%, #8b0000 100%)', glow: '0 0 30px rgba(255,140,0,0.9)', rarity: 'epic', effect: 'flow', description: 'Liquid earth' },
  { id: 'f050', name: 'Neon Nights', value: 100, color: '#ff1493', gradient: 'linear-gradient(135deg, #ff1493 0%, #00ffff 50%, #ff1493 100%)', glow: '0 0 30px rgba(255,20,147,0.9)', rarity: 'epic', effect: 'neon', description: 'City that never sleeps' },

  // Legendary (51-62) - Complex animations, legendary status
  { id: 'f051', name: 'Dragon\'s Heart', value: 500, color: '#ff0000', gradient: 'radial-gradient(circle, #ffff00 0%, #ff0000 30%, #8b0000 70%, #000000 100%)', glow: '0 0 40px rgba(255,0,0,1)', rarity: 'legendary', effect: 'dragon', description: 'Core of an ancient wyrm' },
  { id: 'f052', name: 'Poseidon\'s Trident', value: 500, color: '#00bfff', gradient: 'linear-gradient(180deg, #00ffff 0%, #00bfff 50%, #00008b 100%)', glow: '0 0 40px rgba(0,191,255,1)', rarity: 'legendary', effect: 'trident', description: 'Ruler of the seas' },
  { id: 'f053', name: 'Zeus\' Lightning', value: 500, color: '#ffd700', gradient: 'linear-gradient(45deg, #ffffff 0%, #ffd700 30%, #ff8c00 60%, #8b0000 100%)', glow: '0 0 40px rgba(255,215,0,1)', rarity: 'legendary', effect: 'zeus', description: 'King of gods\' weapon' },
  { id: 'f054', name: 'Hades\' Soul', value: 500, color: '#4b0082', gradient: 'radial-gradient(circle, #ff00ff 0%, #4b0082 50%, #000000 100%)', glow: '0 0 40px rgba(75,0,130,1)', rarity: 'legendary', effect: 'souls', description: 'Tormented underworld spirits' },
  { id: 'f055', name: 'Athena\'s Wisdom', value: 500, color: '#ffd700', gradient: 'linear-gradient(135deg, #f0e68c 0%, #ffd700 50%, #daa520 100%)', glow: '0 0 40px rgba(255,215,0,1)', rarity: 'legendary', effect: 'owl', description: 'Goddess of strategy' },
  { id: 'f056', name: 'Apollo\'s Chariot', value: 500, color: '#ff8c00', gradient: 'conic-gradient(from 0deg, #ffff00, #ff8c00, #ff4500, #ff8c00, #ffff00)', glow: '0 0 40px rgba(255,140,0,1)', rarity: 'legendary', effect: 'sun', description: 'Sun god\'s vehicle' },
  { id: 'f057', name: 'Artemis\' Moon', value: 500, color: '#f0f8ff', gradient: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #f0f8ff 40%, #483d8b 100%)', glow: '0 0 40px rgba(240,248,255,1)', rarity: 'legendary', effect: 'moon', description: 'Huntress\' celestial companion' },
  { id: 'f058', name: 'Thor\'s Hammer', value: 500, color: '#c0c0c0', gradient: 'linear-gradient(135deg, #e8e8e8 0%, #c0c0c0 50%, #696969 100%)', glow: '0 0 40px rgba(192,192,192,1)', rarity: 'legendary', effect: 'thunder', description: 'Mjölnir\'s might' },
  { id: 'f059', name: 'Odin\'s Eye', value: 500, color: '#0000ff', gradient: 'radial-gradient(circle, #00ffff 0%, #0000ff 50%, #000000 100%)', glow: '0 0 40px rgba(0,0,255,1)', rarity: 'legendary', effect: 'allseeing', description: 'Sacrificed for wisdom' },
  { id: 'f060', name: 'Freya\'s Tears', value: 500, color: '#ff69b4', gradient: 'linear-gradient(180deg, #ffb6c1 0%, #ff69b4 50%, #c71585 100%)', glow: '0 0 40px rgba(255,105,180,1)', rarity: 'legendary', effect: 'tears', description: 'Gold turned to tears' },
  { id: 'f061', name: 'Anubis\' Judgment', value: 500, color: '#2f4f4f', gradient: 'linear-gradient(135deg, #000000 0%, #2f4f4f 50%, #daa520 100%)', glow: '0 0 40px rgba(47,79,79,1)', rarity: 'legendary', effect: 'scales', description: 'Weigher of souls' },
  { id: 'f062', name: 'Ra\'s Sun Disk', value: 500, color: '#ffd700', gradient: 'radial-gradient(circle, #ffffff 0%, #ffd700 20%, #ff8c00 60%, #8b0000 100%)', glow: '0 0 40px rgba(255,215,0,1)', rarity: 'legendary', effect: 'ra', description: 'Egyptian sun god' },

  // Mythic (63-68) - Reality-bending effects
  { id: 'f063', name: 'Chronos Time', value: 2500, color: '#9370db', gradient: 'conic-gradient(from 0deg, #000000, #4b0082, #9370db, #ffffff, #9370db, #4b0082, #000000)', glow: '0 0 50px rgba(147,112,219,1)', rarity: 'mythic', effect: 'time', description: 'Master of temporal flow' },
  { id: 'f064', name: 'Void Essence', value: 2500, color: '#000000', gradient: 'radial-gradient(circle, #ffffff 0%, #808080 10%, #000000 100%)', glow: '0 0 50px rgba(0,0,0,1)', rarity: 'mythic', effect: 'void', description: 'Nothingness incarnate' },
  { id: 'f065', name: 'Creation Spark', value: 2500, color: '#ffffff', gradient: 'radial-gradient(circle, #ffffff 0%, #ffff00 20%, #ff0000 40%, #0000ff 60%, #00ff00 80%, #ffffff 100%)', glow: '0 0 50px rgba(255,255,255,1)', rarity: 'mythic', effect: 'creation', description: 'Big Bang captured' },
  { id: 'f066', name: 'Destiny Weaver', value: 2500, color: '#da70d6', gradient: 'linear-gradient(135deg, #e6e6fa 0%, #da70d6 30%, #9370db 60%, #4b0082 100%)', glow: '0 0 50px rgba(218,112,214,1)', rarity: 'mythic', effect: 'threads', description: 'Fate\'s architect' },
  { id: 'f067', name: 'Infinity Loop', value: 2500, color: '#00ced1', gradient: 'linear-gradient(90deg, #00ced1 0%, #ff69b4 25%, #00ced1 50%, #ff69b4 75%, #00ced1 100%)', glow: '0 0 50px rgba(0,206,209,1)', rarity: 'mythic', effect: 'infinity', description: 'Endless cycle' },
  { id: 'f068', name: 'Omniverse Key', value: 2500, color: '#ffd700', gradient: 'conic-gradient(from 0deg, #ff0000, #00ff00, #0000ff, #ffff00, #ff00ff, #00ffff, #ff0000)', glow: '0 0 50px rgba(255,215,0,1)', rarity: 'mythic', effect: 'key', description: 'Unlock all realities' },

  // Divine (69-70) - Ultimate rarity, game-changing
  { id: 'f069', name: 'The Architect', value: 10000, color: '#ffffff', gradient: 'radial-gradient(circle, #ffffff 0%, #f0f0f0 20%, #d0d0d0 40%, #a0a0a0 60%, #606060 80%, #000000 100%)', glow: '0 0 60px rgba(255,255,255,1)', rarity: 'divine', effect: 'architect', description: 'Creator of the casino itself' },
  { id: 'f070', name: 'House Edge Breaker', value: 50000, color: '#00ff00', gradient: 'linear-gradient(135deg, #00ff00 0%, #00ffff 25%, #ff00ff 50%, #ffff00 75%, #00ff00 100%)', glow: '0 0 70px rgba(0,255,0,1)', rarity: 'divine', effect: 'breaker', description: 'Defies all odds - The ultimate fiche' },
];

export const getFicheByValue = (value: number): Fiche => {
  const exactMatch = FICHES.find(f => f.value === value);
  if (exactMatch) return exactMatch;
  
  // Find closest lower value
  const sorted = [...FICHES].sort((a, b) => b.value - a.value);
  for (const fiche of sorted) {
    if (value >= fiche.value) return fiche;
  }
  return FICHES[0];
};

export const getFichesByRarity = (rarity: Fiche['rarity']): Fiche[] => {
  return FICHES.filter(f => f.rarity === rarity);
};

export const getRandomFiche = (): Fiche => {
  return FICHES[Math.floor(Math.random() * FICHES.length)];
};
