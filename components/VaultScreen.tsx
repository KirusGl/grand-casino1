
import React from 'react';
import { Briefcase, Gem, CheckCircle } from 'lucide-react';
import { InventoryItem } from '../types';

interface VaultScreenProps {
  inventory: InventoryItem[];
  onPurchase: (item: InventoryItem) => void;
  balance: number;
}

const VaultScreen: React.FC<VaultScreenProps> = ({ inventory, onPurchase, balance }) => {
  return (
    <div className="flex-1 p-4 animate-fade-in overflow-y-auto pb-24">
      <div className="text-center mb-8">
         <Briefcase className="mx-auto text-royal-gold mb-2" size={32} />
         <h2 className="text-2xl font-cinzel text-royal-gold tracking-widest uppercase">The Royal Vault</h2>
         <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] mt-1">Acquire assets of distinction</p>
      </div>

      <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
         {inventory.map(item => (
            <div key={item.id} className={`p-4 rounded-lg border flex items-center justify-between transition-all ${
              item.owned ? 'bg-om-matte-green/20 border-royal-gold/40' : 'bg-black/40 border-white/5'
            }`}>
               <div className="flex items-center gap-4">
                  <div className="text-3xl">{item.icon}</div>
                  <div>
                     <div className="font-playfair text-om-cream font-bold">{item.name}</div>
                     <div className="text-xs text-royal-gold">${item.price.toLocaleString()}</div>
                  </div>
               </div>
               
               {item.owned ? (
                 <CheckCircle className="text-royal-gold" size={24} />
               ) : (
                 <button 
                    disabled={balance < item.price}
                    onClick={() => onPurchase(item)}
                    className="px-4 py-2 bg-royal-gold text-black rounded font-cinzel text-[10px] font-bold tracking-widest uppercase disabled:opacity-20"
                 >
                    Buy
                 </button>
               )}
            </div>
         ))}
      </div>
    </div>
  );
};

export default VaultScreen;
