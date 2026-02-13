
import React from 'react';
import { Settings, Globe, Volume2, Trash2, ShieldCheck, ChevronRight, Eye, EyeOff, UserCircle } from 'lucide-react';
import { Language } from '../types';
import { TEXTS } from '../utils/translations';
import { resetProgress } from '../utils/storage';
import { hapticSelection, hapticNotification } from '../utils/haptics';

interface SettingsScreenProps {
  lang: Language;
  onToggleLang: () => void;
  privacyMode: boolean;
  onTogglePrivacy: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ lang, onToggleLang, privacyMode, onTogglePrivacy }) => {
  const t = TEXTS[lang].settings;

  const handleReset = () => {
    if (window.confirm(t.resetConfirm)) {
      hapticNotification('warning');
      resetProgress();
    }
  };

  const handleAction = (fn: () => void) => {
    hapticSelection();
    fn();
  };

  return (
    <div className="flex-1 p-6 animate-fade-in overflow-y-auto pb-24 scrollbar-hide">
      <div className="text-center mb-10">
        <div className="relative inline-block mb-3">
          <Settings className="mx-auto text-royal-gold" size={36} />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black animate-pulse" />
        </div>
        <h2 className="text-3xl font-cinzel text-royal-gold tracking-[0.2em] uppercase font-black">{t.title}</h2>
        <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] mt-2 italic font-lora">The Residency Private Access</p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <div className="bg-om-black/60 border border-royal-gold/10 p-5 rounded-sm flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-royal-gold/5 rounded-full border border-royal-gold/20">
                    <UserCircle size={24} className="text-royal-gold" />
                </div>
                <div>
                   <span className="block text-sm font-playfair text-om-cream tracking-wider italic font-bold">{t.cabinet}</span>
                   <span className="text-[10px] text-royal-gold uppercase font-bold tracking-[0.2em]">{t.verified}</span>
                </div>
            </div>
            <ShieldCheck size={20} className="text-green-500/80" />
        </div>

        <div className="bg-om-black/80 border border-royal-gold/20 rounded-sm overflow-hidden divide-y divide-white/5 shadow-2xl">
          <button onClick={() => handleAction(onToggleLang)} className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-4">
              <Globe size={20} className="text-om-gold/60 group-hover:text-om-gold transition-colors" />
              <span className="font-cinzel text-xs tracking-[0.2em] uppercase text-om-cream">{t.language}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-playfair italic text-royal-gold/80">{lang === 'EN' ? 'English' : 'Русский'}</span>
              <ChevronRight size={14} className="text-white/20" />
            </div>
          </button>

          <button onClick={() => handleAction(onTogglePrivacy)} className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-4">
              {privacyMode ? <EyeOff size={20} className="text-om-gold/60 group-hover:text-om-gold transition-colors" /> : <Eye size={20} className="text-om-gold/60 group-hover:text-om-gold transition-colors" />}
              <span className="font-cinzel text-xs tracking-[0.2em] uppercase text-om-cream">{t.privacy}</span>
            </div>
            <div className={`text-[10px] font-black px-4 py-1.5 rounded-sm border tracking-widest uppercase transition-all ${privacyMode ? 'bg-royal-gold text-black border-white' : 'border-white/10 text-white/30'}`}>
               {privacyMode ? t.on : t.off}
            </div>
          </button>

          <div className="p-5 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <Volume2 size={20} className="text-om-gold/60" />
              <span className="font-cinzel text-xs tracking-[0.2em] uppercase text-om-cream">{t.sound}</span>
            </div>
            <div className="text-[10px] font-black px-4 py-1.5 rounded-sm bg-om-mahogany border border-om-brass/40 text-om-gold uppercase tracking-widest">
               {t.on}
            </div>
          </div>
        </div>

        <div className="pt-6">
            <p className="text-[10px] font-cinzel text-white/20 uppercase tracking-[0.4em] mb-4 px-1">{t.danger}</p>
            <button 
                onClick={handleReset}
                className="w-full p-5 bg-om-burgundy/10 border border-om-burgundy/30 rounded-sm flex items-center gap-4 text-red-400/80 hover:bg-om-burgundy/20 transition-all group shadow-xl"
            >
                <Trash2 size={20} className="group-hover:rotate-12 transition-transform" />
                <span className="font-cinzel text-xs tracking-[0.3em] uppercase font-bold">{t.reset}</span>
            </button>
        </div>

        <div className="text-center pt-12">
           <p className="text-[9px] font-cinzel text-white/10 uppercase tracking-[0.6em]">{t.version}</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
