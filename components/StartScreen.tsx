
import React from 'react';
import { KeyRound, Crown, Shield } from 'lucide-react';
import { Language } from '../types';
import { TEXTS } from '../utils/translations';

interface StartScreenProps {
  onStart: () => void;
  userName: string;
  lang: Language;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, userName, lang }) => {
  const t = TEXTS[lang].start;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-om-chocolate relative p-6 text-center animate-fade-in overflow-y-auto">
      <div className="absolute inset-0 bg-herringbone pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.95)_100%)] z-0 pointer-events-none" />
      
      <div className="relative z-20 w-full max-w-sm flex flex-col justify-center py-10">
        <div className="mb-12">
             <div className="flex justify-center opacity-40 mb-6">
                <Crown size={64} className="text-om-gold" />
             </div>
             <h1 className="text-4xl md:text-5xl font-cinzel font-black tracking-widest uppercase text-transparent bg-clip-text bg-gold-gradient leading-tight">
                {t.title}
             </h1>
             <div className="w-16 h-0.5 bg-om-gold/30 mx-auto mt-6"></div>
             <p className="mt-4 font-sans text-om-brass/60 font-bold text-xs tracking-[0.4em] uppercase">
                {t.est}
             </p>
        </div>

        <div className="space-y-8 w-full">
          <div className="bg-om-burgundy/10 backdrop-blur-xl border border-om-brass/20 p-8 rounded-lg shadow-2xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-om-mahogany border border-om-brass/50 px-4 py-1 rounded">
                  <span className="text-[10px] font-bold text-om-brass tracking-widest uppercase">{t.invitation}</span>
              </div>
              
              <div className="flex flex-col items-center pt-2">
                  <span className="text-[10px] font-bold text-om-gold/40 uppercase tracking-[0.2em] mb-4">{t.honoredGuest}</span>
                  <div className="font-sans text-xl font-extrabold text-om-cream border-b border-om-brass/20 pb-3 mb-6 tracking-wide w-full truncate">
                    {userName}
                  </div>
                  <div className="flex items-center gap-2 opacity-40">
                      <Shield size={12} className="text-om-brass" />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-om-cream">{t.accessCode}</span>
                  </div>
              </div>
          </div>

          <button
            onClick={onStart}
            className="group relative w-full py-5 overflow-hidden rounded-lg shadow-2xl active:scale-[0.98] transition-all bg-om-mahogany border border-om-brass/40"
          >
            <div className="absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <span className="relative z-10 font-sans text-base font-black text-om-gold flex items-center justify-center gap-4 tracking-[0.2em]">
               {t.enter} <KeyRound size={20} className="text-om-brass" />
            </span>
          </button>
        </div>

        <div className="mt-12 opacity-30">
          <p className="font-sans font-medium text-[10px] text-om-cream tracking-widest uppercase">
             {t.patience}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
