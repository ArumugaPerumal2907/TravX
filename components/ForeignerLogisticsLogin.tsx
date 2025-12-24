import React, { useState } from 'react';
import { Shield, Globe, FileCheck, ScanLine, CheckCircle, Lock, Plane, AlertCircle } from 'lucide-react';

interface ForeignerLogisticsLoginProps {
  onVerified: () => void;
}

export const ForeignerLogisticsLogin: React.FC<ForeignerLogisticsLoginProps> = ({ onVerified }) => {
  const [step, setStep] = useState<'form' | 'verifying' | 'success'>('form');
  const [formData, setFormData] = useState({
    passportId: '',
    country: '',
    visaType: 'Tourist'
  });

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('verifying');
    // Simulate verification process
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onVerified();
      }, 1500);
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] bg-slate-50 p-6 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl shadow-violet-500/10 border border-white overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-violet-900 p-8 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
               <Globe size={120} />
           </div>
           <div className="relative z-10">
               <div className="flex items-center space-x-2 mb-2">
                   <Shield size={20} className="text-violet-300"/>
                   <span className="text-[10px] font-bold tracking-widest uppercase text-violet-200">Secure Access</span>
               </div>
               <h2 className="text-3xl font-black">Logistics Login</h2>
               <p className="text-violet-200 text-sm mt-1 font-medium">International Traveler Protocol</p>
           </div>
        </div>

        <div className="p-8">
            {step === 'form' && (
                <form onSubmit={handleVerify} className="space-y-5 animate-fade-in">
                    <div className="bg-violet-50 p-4 rounded-2xl flex items-start space-x-3 border border-violet-100">
                        <AlertCircle size={18} className="text-violet-600 mt-0.5 shrink-0"/>
                        <p className="text-[10px] text-violet-900 leading-relaxed font-medium">
                            Pursuant to the <span className="font-bold">Motor Vehicles Act & Tourist Safety Protocols</span>, strictly verified access is required for logistics booking.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-2 tracking-wide">Passport Number</label>
                            <div className="relative">
                                <ScanLine className="absolute left-4 top-3.5 text-slate-400" size={18}/>
                                <input 
                                    required
                                    type="text"
                                    value={formData.passportId}
                                    onChange={e => setFormData({...formData, passportId: e.target.value})}
                                    placeholder="Enter Passport ID"
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-violet-100 outline-none uppercase transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-2 tracking-wide">Country of Origin</label>
                            <div className="relative">
                                <Globe className="absolute left-4 top-3.5 text-slate-400" size={18}/>
                                <input 
                                    required
                                    type="text"
                                    value={formData.country}
                                    onChange={e => setFormData({...formData, country: e.target.value})}
                                    placeholder="e.g. United Kingdom"
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-violet-100 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-2 tracking-wide">Visa Category</label>
                            <div className="relative">
                                <select 
                                    value={formData.visaType}
                                    onChange={e => setFormData({...formData, visaType: e.target.value})}
                                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-violet-100 outline-none appearance-none transition-all"
                                >
                                    <option>Tourist Visa (e-Visa)</option>
                                    <option>Business Visa</option>
                                    <option>Diplomatic</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" required className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-slate-300" />
                            <span className="text-[10px] text-slate-500 font-medium leading-tight">I agree to share travel data with local authorities for safety monitoring.</span>
                        </label>
                    </div>

                    <button type="submit" className="w-full bg-violet-600 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-violet-700 active:scale-95 transition-all flex items-center justify-center space-x-2">
                        <Lock size={18} />
                        <span>Verify Identity</span>
                    </button>
                </form>
            )}

            {step === 'verifying' && (
                <div className="flex flex-col items-center justify-center py-10 space-y-6 animate-fade-in text-center">
                    <div className="relative">
                        <div className="w-24 h-24 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Shield size={32} className="text-violet-600" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">Verifying Credentials...</h3>
                        <p className="text-xs text-slate-500 mt-1">Connecting to Bureau of Immigration Gateway</p>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 max-w-[200px] overflow-hidden">
                        <div className="h-full bg-violet-600 animate-pulse w-2/3 rounded-full"></div>
                    </div>
                </div>
            )}

            {step === 'success' && (
                <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-scale-up text-center">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center shadow-inner">
                        <CheckCircle size={48} className="text-green-500" />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-800 text-2xl">Access Granted</h3>
                        <p className="text-sm text-slate-500 mt-2 font-medium">Welcome to Indian Transport Logistics</p>
                    </div>
                    <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-5 py-3 rounded-xl text-xs font-bold border border-green-100 mt-4">
                        <FileCheck size={16} />
                        <span>Verified Traveler ID: INT-{Math.floor(Math.random() * 10000)}</span>
                    </div>
                </div>
            )}
        </div>
        
        {/* Footer Protocol */}
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-mono flex items-center justify-center font-bold tracking-widest">
                <Lock size={12} className="mr-1.5"/> 256-BIT ENCRYPTED SESSION
            </p>
        </div>
      </div>
    </div>
  );
};