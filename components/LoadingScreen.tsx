import React, { useEffect, useState } from 'react';
import { STATE_INFOGRAPHICS } from '../constants';
import { Compass, Plane } from 'lucide-react';

interface LoadingScreenProps {
  loadingMessage?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ loadingMessage = "Preparing your journey..." }) => {
  const [activeState, setActiveState] = useState(STATE_INFOGRAPHICS[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * STATE_INFOGRAPHICS.length);
    setActiveState(STATE_INFOGRAPHICS[randomIndex]);
  }, []);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-700 text-white transition-all duration-1000 overflow-hidden`}>
        
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-400 rounded-full mix-blend-overlay filter blur-3xl animate-float-delayed"></div>
        </div>

        {/* Animated Doodle Logo Area */}
        <div className="relative w-64 h-40 flex items-center justify-center mb-4">
             {/* The SVG Doodle Path */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                    d="M30,100 C70,100 80,40 120,40 C160,40 180,110 220,110 C260,110 280,60 290,50" 
                    stroke="rgba(255,255,255,0.4)" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    strokeDasharray="10 10"
                />
                <path 
                    className="path-draw"
                    d="M30,100 C70,100 80,40 120,40 C160,40 180,110 220,110 C260,110 280,60 290,50" 
                    stroke="white" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                />
                <circle cx="30" cy="100" r="6" fill="white" className="animate-ping" />
             </svg>
             
             {/* Main Icon */}
             <div className="relative z-10 w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl rotate-6 flex items-center justify-center shadow-2xl border border-white/30 animate-float">
                <Compass size={48} className="text-white drop-shadow-md" strokeWidth={2} />
             </div>
             
             {/* Flying Plane Icon - CSS Offset Animation simulated by absolute positioning and animation delay */}
             <div className="absolute right-[10%] top-[25%] z-20 animate-bounce">
                <Plane size={28} className="text-amber-300 fill-amber-300 rotate-[-15deg] drop-shadow-lg" />
             </div>
        </div>
        
        <h1 className="text-5xl font-black tracking-tighter text-white drop-shadow-sm mb-2 relative z-10">
            Trav<span className="text-amber-300">X</span>
        </h1>
        <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-12 animate-pulse">{loadingMessage}</p>

        {/* Fact Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-xs mx-auto border border-white/20 shadow-xl animate-slide-up relative z-10">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white text-violet-600 w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg font-bold border-4 border-violet-500">
                {activeState.icon}
            </div>
            <div className="mt-4 text-center">
                <h2 className="text-xl font-bold mb-1">{activeState.stateName}</h2>
                <p className="text-[10px] font-bold uppercase tracking-wide opacity-75 mb-3">{activeState.tagline}</p>
                <p className="text-sm leading-relaxed opacity-90 font-medium border-t border-white/10 pt-3">
                    "{activeState.fact}"
                </p>
            </div>
        </div>
    </div>
  );
};