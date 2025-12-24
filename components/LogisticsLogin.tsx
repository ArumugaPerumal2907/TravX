import React, { useState } from 'react';
import { Truck, ShieldCheck, Lock, HardHat, FileText, CheckCircle } from 'lucide-react';

interface LogisticsLoginProps {
  onVerified: () => void;
  onCancel: () => void;
}

export const LogisticsLogin: React.FC<LogisticsLoginProps> = ({ onVerified, onCancel }) => {
  const [step, setStep] = useState<'form' | 'verifying' | 'success'>('form');
  const [formData, setFormData] = useState({
    operatorId: '',
    vehicleReg: '',
    permitType: 'Commercial'
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
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 animate-fade-in h-full bg-slate-50">
      <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl shadow-slate-300/50 border border-white overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
               <Truck size={120} />
           </div>
           <div className="relative z-10">
               <div className="flex items-center space-x-2 mb-2">
                   <HardHat size={20} className="text-amber-400"/>
                   <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Logistics Portal</span>
               </div>
               <h2 className="text-3xl font-black">Maintenance Login</h2>
               <p className="text-slate-400 text-sm mt-1 font-medium">Cargo & Heavy Vehicle Access</p>
           </div>
        </div>

        <div className="p-8">
            {step === 'form' && (
                <form onSubmit={handleVerify} className="space-y-5 animate-fade-in">
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                        Access to Logistics booking and maintenance scheduling requires verified operator credentials.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-2 tracking-wide">Operator ID</label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-3.5 text-slate-400" size={18}/>
                                <input 
                                    required
                                    type="text"
                                    value={formData.operatorId}
                                    onChange={e => setFormData({...formData, operatorId: e.target.value})}
                                    placeholder="OP-XXXX-YYYY"
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-200 outline-none uppercase transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-2 tracking-wide">Vehicle Registration</label>
                            <div className="relative">
                                <Truck className="absolute left-4 top-3.5 text-slate-400" size={18}/>
                                <input 
                                    required
                                    type="text"
                                    value={formData.vehicleReg}
                                    onChange={e => setFormData({...formData, vehicleReg: e.target.value})}
                                    placeholder="IND-XX-XXXX"
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-200 outline-none uppercase transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-black active:scale-95 transition-all flex items-center justify-center space-x-2 mt-2">
                        <Lock size={18} />
                        <span>Authenticate</span>
                    </button>
                    
                    <button type="button" onClick={onCancel} className="w-full text-slate-500 font-bold py-3 text-xs hover:text-slate-800 transition-colors rounded-xl hover:bg-slate-50">
                        Cancel & Return
                    </button>
                </form>
            )}

            {step === 'verifying' && (
                <div className="flex flex-col items-center justify-center py-10 space-y-6 animate-fade-in text-center">
                    <div className="relative">
                        <div className="w-24 h-24 border-4 border-slate-100 border-t-slate-800 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <ShieldCheck size={32} className="text-slate-800" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">Verifying Operator...</h3>
                        <p className="text-xs text-slate-500 mt-1">Checking permit validity</p>
                    </div>
                </div>
            )}

            {step === 'success' && (
                <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-scale-up text-center">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center shadow-inner">
                        <CheckCircle size={48} className="text-emerald-500" />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-800 text-2xl">Authorized</h3>
                        <p className="text-sm text-slate-500 mt-2 font-medium">Logistics Dashboard Unlocked</p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};