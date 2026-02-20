
import React from 'react';
import { History, TrendingUp, TrendingDown } from 'lucide-react';
import { LedgerEntry } from '../types';

interface LedgerScreenProps {
  ledger: LedgerEntry[];
}

const LedgerScreen: React.FC<LedgerScreenProps> = ({ ledger }) => {
  return (
    <div className="flex-1 p-4 animate-fade-in overflow-y-auto pb-24">
      <div className="text-center mb-8">
         <History className="mx-auto text-royal-gold mb-2" size={32} />
         <h2 className="text-2xl font-cinzel text-royal-gold tracking-widest uppercase">The Ledger</h2>
         <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] mt-1">Official Account of Fortune</p>
      </div>

      <div className="max-w-md mx-auto flex flex-col gap-2 bg-om-wood/20 rounded-lg p-2 border border-royal-gold/10">
         {ledger.length === 0 ? (
           <div className="text-center py-10 text-white/20 italic font-cormorant">No entries in the ledger yet, My Lord.</div>
         ) : (
           ledger.map(entry => (
             <div key={entry.id} className="flex justify-between items-center p-3 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                   {entry.result === 'WIN' ? <TrendingUp className="text-green-500" size={14} /> : <TrendingDown className="text-red-500" size={14} />}
                   <div>
                      <div className="text-xs font-cinzel text-om-cream uppercase tracking-widest">{entry.game}</div>
                      <div className="text-[8px] text-white/30 uppercase">{new Date(entry.timestamp).toLocaleTimeString()}</div>
                   </div>
                </div>
                <div className={`font-playfair font-bold ${entry.result === 'WIN' ? 'text-green-500' : 'text-red-500'}`}>
                   {entry.result === 'WIN' ? '+' : '-'}${entry.amount.toLocaleString()}
                </div>
             </div>
           ))
         )}
      </div>
    </div>
  );
};

export default LedgerScreen;
