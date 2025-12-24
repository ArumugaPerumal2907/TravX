import React, { useState } from 'react';
import { User, Globe, Compass, ShieldCheck, ScanLine, ArrowRight, Lock, Map, Cloud } from 'lucide-react';
import { UserType } from '../types';

interface OnboardingProps {
  onSelect: (type: UserType) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onSelect }) => {
  const [step, setStep] = useState<'select' | 'verify'>('select');
  const [selectedType, setSelectedType] = useState<UserType>(null);
  const [idNumber, setIdNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSelection = (type: UserType) => {
      setSelectedType(type);
      setStep('verify');
  };

  const handleVerification = (e: React.FormEvent) => {
      e.preventDefault();
      setIsVerifying(true);
      
      // Simulate API verification delay
      setTimeout(() => {
          setIsVerifying(false);
          onSelect(selectedType);
      }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      
      {/* Background Doodles */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
          <Cloud className="absolute top-10 left-10 text-slate-200 w-24 h-24 animate-float" />
          <Cloud className="absolute bottom-20 right-5 text-slate-200 w-16 h-16 animate-float-delayed" />
          <Map className="absolute top-1/4 right-[-20px] text-slate-100 w-32 h-32 rotate-12" />
          
          {/* SVG Path Background */}
          <svg className="absolute top-1/3 left-0 w-full h-64 z-0 opacity-30" viewBox="0 0 400 200">
             <path d="M-50,150 C50,50 150,250 250,100 C300,25 380,50 450,150" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="8 8" fill="none" />
          </svg>
      </div>

      <div className="mb-10 animate-fade-in-up flex flex-col items-center relative z-10">
        {/* Doodle Logo */}
        <div className="relative w-32 h-32 flex items-center justify-center mb-4">
             {/* Animated Rings */}
             <div className="absolute inset-0 border-2 border-violet-200 rounded-full animate-[spin_8s_linear_infinite]" style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }} />
             <div className="absolute inset-2 border-2 border-fuchsia-200 rounded-full animate-[spin_6s_linear_infinite_reverse]" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }} />
             
             {/* Core Icon */}
             <div className="w-20 h-20 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-3xl rotate-6 shadow-2xl shadow-violet-500/40 flex items-center justify-center z-10 hover:scale-105 transition-transform duration-300">
                <Compass size={40} className="text-white" strokeWidth={1.5} />
             </div>
             
             {/* Decorative Dots */}
             <div className="absolute top-0 right-2 w-3 h-3 bg-amber-400 rounded-full animate-bounce" />
             <div className="absolute bottom-2 left-2 w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s'}} />
        </div>

        <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter relative">
            Trav<span className="text-violet-600 relative">X
                <svg className="absolute -bottom-2 -left-1 w-full h-3 text-amber-400" viewBox="0 0 50 10">
                    <path d="M2,5 Q25,12 48,2" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
            </span>
        </h1>
        <p className="text-sm font-bold text-slate-400 max-w-xs leading-relaxed tracking-widest uppercase">
            Navigate the Incredible
        </p>
      </div>

      {step === 'select' ? (
        <div className="space-y-4 w-full max-w-xs animate-slide-up relative z-10">
            <button
            onClick={() => handleSelection('citizen')}
            className="w-full group relative overflow-hidden rounded-3xl bg-white p-1 pr-6 shadow-lg shadow-slate-200/50 border border-slate-100 hover:border-orange-200 hover:shadow-xl transition-all text-left flex items-center"
            >
            <div className="bg-orange-50 w-20 h-20 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
                <User size={32} className="text-orange-500 group-hover:rotate-12 transition-transform" />
            </div>
            <div>
                <h3 className="font-bold text-lg text-slate-800">Indian Citizen</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">Via Aadhar / DigiLocker</p>
            </div>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all">
                <ArrowRight size={20} className="text-orange-400"/>
            </div>
            </button>

            <button
            onClick={() => handleSelection('foreigner')}
            className="w-full group relative overflow-hidden rounded-3xl bg-white p-1 pr-6 shadow-lg shadow-slate-200/50 border border-slate-100 hover:border-indigo-200 hover:shadow-xl transition-all text-left flex items-center"
            >
            <div className="bg-indigo-50 w-20 h-20 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
                <Globe size={32} className="text-indigo-500 group-hover:rotate-12 transition-transform" />
            </div>
            <div>
                <h3 className="font-bold text-lg text-slate-800">Foreign Visitor</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">Via Passport / e-Visa</p>
            </div>
             <div className="ml-auto opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all">
                <ArrowRight size={20} className="text-indigo-400"/>
            </div>
            </button>
        </div>
      ) : (
          <div className="w-full max-w-xs bg-white rounded-[32px] shadow-2xl border border-slate-100 p-6 animate-slide-up relative overflow-hidden z-10">
              {isVerifying && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 border-4 border-slate-100 border-t-violet-600 rounded-full animate-spin mb-4"></div>
                      <p className="text-xs font-bold text-slate-600 animate-pulse uppercase tracking-wider">
                          Verifying Credentials
                      </p>
                  </div>
              )}

              <button onClick={() => setStep('select')} className="absolute top-6 right-6 text-slate-300 hover:text-slate-600 transition-colors">
                  <ArrowRight size={20} className="rotate-180" />
              </button>

              <div className="mb-6 mt-2">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-sm rotate-3 ${selectedType === 'citizen' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'}`}>
                      <ShieldCheck size={28} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 leading-tight">Identity<br/>Check</h2>
              </div>

              <form onSubmit={handleVerification} className="space-y-4">
                  <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">
                          {selectedType === 'citizen' ? 'Aadhar Number' : 'Passport Number'}
                      </label>
                      <div className="relative group">
                          <ScanLine size={18} className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-violet-500 transition-colors"/>
                          <input 
                            type="text" 
                            required
                            value={idNumber}
                            onChange={(e) => setIdNumber(e.target.value)}
                            placeholder={selectedType === 'citizen' ? 'XXXX XXXX XXXX' : 'A1234567'}
                            className="w-full bg-slate-50 border-2 border-transparent focus:border-violet-100 rounded-2xl py-3 pl-11 pr-4 text-sm font-bold text-slate-800 outline-none transition-all uppercase placeholder:text-slate-300"
                          />
                      </div>
                  </div>
                  
                  <div className="flex items-start space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <Lock size={12} className="text-slate-400 mt-0.5 shrink-0"/>
                      <p className="text-[10px] text-slate-500 leading-tight font-medium">
                          Encrypted Verification via Government Gateway.
                      </p>
                  </div>

                  <button 
                    type="submit"
                    disabled={!idNumber}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 hover:bg-black active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 shadow-xl shadow-slate-200"
                  >
                      <span>Verify & Continue</span>
                      <ArrowRight size={16} />
                  </button>
              </form>
          </div>
      )}
    </div>
  );
};