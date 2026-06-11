import React, { useEffect, useState } from 'react';
import { Coffee, Sparkles } from 'lucide-react';

export default function OpeningSlider() {
  const [stage, setStage] = useState<'logo' | 'slide-up' | 'hidden'>('logo');

  useEffect(() => {
    // 1st stage: show logo and subtle pulse for 1200ms
    const logoTimeout = setTimeout(() => {
      setStage('slide-up');
    }, 1500);

    // 2nd stage: slide out completely after the slide-up animation runs (800ms)
    const hideTimeout = setTimeout(() => {
      setStage('hidden');
    }, 2300);

    return () => {
      clearTimeout(logoTimeout);
      clearTimeout(hideTimeout);
    };
  }, []);

  if (stage === 'hidden') return null;

  return (
    <div id="opening-door-slider" className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none">
      
      {/* Golden-Bronze curtain backdrop */}
      <div 
        className={`absolute inset-0 bg-[#A88665] transition-transform duration-[1000ms] cubic-bezier(0.85, 0, 0.15, 1) ${
          stage === 'slide-up' ? '-translate-y-full' : 'translate-y-0'
        }`}
        style={{ transitionDelay: '150ms' }}
      ></div>

      {/* Latte overlay curtain */}
      <div 
        className={`absolute inset-0 bg-[#EEDCC6] transition-transform duration-[1000ms] cubic-bezier(0.85, 0, 0.15, 1) ${
          stage === 'slide-up' ? '-translate-y-full' : 'translate-y-0'
        }`}
        style={{ transitionDelay: '75ms' }}
      ></div>

      {/* Charcoal main brand curtain (interactive container) */}
      <div 
        className={`absolute inset-0 bg-[#1e1a17] flex flex-col items-center justify-center pointer-events-auto transition-transform duration-[1200ms] cubic-bezier(0.85, 0, 0.15, 1) ${
          stage === 'slide-up' ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        {/* Abstract floating ambient dots for visual luxury inside loader */}
        <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-cafe-gold/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-[#A88665]/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

        {/* Core emblem container */}
        <div 
          className={`text-center space-y-6 transition-all duration-700 transform ${
            stage === 'slide-up' ? 'opacity-0 -translate-y-12 scale-90' : 'opacity-100 scale-100'
          }`}
        >
          {/* Glowing brand circular coffee stamp */}
          <div className="relative inline-flex items-center justify-center p-6 rounded-full border border-cafe-gold/20 bg-[#2C2621] shadow-2xl glow-coffee mb-2">
            <Coffee className="w-10 h-10 text-cafe-gold animate-bounce" />
            <div className="absolute inset-0 border border-cafe-gold/10 rounded-full animate-ping [animation-duration:3s]"></div>
          </div>

          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.4em] text-cafe-gold font-semibold block font-mono">
              London's Glasshouse Sanctuary
            </span>
            <h1 className="font-serif italic text-4xl sm:text-6xl font-extrabold text-[#FDFBF7] tracking-wider leading-none">
              CAFÉ VISTA
            </h1>
            <div className="flex items-center justify-center gap-2 text-cafe-gold/60 text-xs tracking-widest font-mono uppercase mt-2">
              <span className="h-px w-6 bg-cafe-gold/30"></span>
              <Sparkles className="w-3.5 h-3.5 text-cafe-gold animate-spin [animation-duration:6s]" />
              <span>Purely Artisan</span>
              <span className="h-px w-6 bg-cafe-gold/30"></span>
            </div>
          </div>

          {/* Luxury loading indicator lines progress */}
          <div className="w-48 h-[2px] bg-white/5 rounded-full mx-auto relative overflow-hidden mt-6">
            <div className="absolute top-0 left-0 h-full w-[80%] bg-gradient-to-r from-cafe-gold to-[#A88665] rounded-full animate-[loadingProgress_1.4s_infinite_ease-in-out]"></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loadingProgress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(50%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
