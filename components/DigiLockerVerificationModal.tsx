import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, CheckCircle, Lock, Loader2, ArrowRight } from 'lucide-react';

interface DigiLockerVerificationModalProps {
    onSuccess: () => void;
    onClose: () => void;
}

export const DigiLockerVerificationModal: React.FC<DigiLockerVerificationModalProps> = ({ onSuccess, onClose }) => {
    const [step, setStep] = useState<'connect' | 'fetching' | 'success'>('connect');

    const handleConnect = () => {
        setStep('fetching');
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                onSuccess();
            }, 1500);
        }, 2500);
    };

    return (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative">
                
                {/* Header */}
                <div className="bg-blue-600 p-6 text-white text-center relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-blue-200 hover:text-white font-bold text-xs">Close</button>
                    <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto flex items-center justify-center mb-3 backdrop-blur-sm">
                        <ShieldCheck size={32} className="text-white"/>
                    </div>
                    <h2 className="text-xl font-black tracking-tight">DigiLocker Connect</h2>
                    <p className="text-blue-100 text-xs font-medium mt-1">Government Verified Documents</p>
                </div>

                <div className="p-6">
                    {step === 'connect' && (
                        <div className="text-center space-y-5">
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                To rent a vehicle, we need to verify your <span className="text-slate-900 font-bold">Driving License</span>. Please connect your DigiLocker account.
                            </p>
                            
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center space-x-3 text-left">
                                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                    <FileText size={20}/>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">Driving License</h4>
                                    <p className="text-[10px] text-slate-500">Ministry of Road Transport</p>
                                </div>
                                <div className="ml-auto">
                                    <Lock size={14} className="text-slate-400"/>
                                </div>
                            </div>

                            <button 
                                onClick={handleConnect}
                                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center"
                            >
                                Fetch from DigiLocker <ArrowRight size={16} className="ml-2"/>
                            </button>
                            
                            <p className="text-[10px] text-slate-400 font-bold flex items-center justify-center">
                                <Lock size={10} className="mr-1"/> 100% Secure & Encrypted
                            </p>
                        </div>
                    )}

                    {step === 'fetching' && (
                        <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                            <Loader2 size={48} className="text-blue-600 animate-spin" />
                            <div>
                                <h3 className="font-bold text-slate-800">Fetching Document...</h3>
                                <p className="text-xs text-slate-500 mt-1">Connecting to UIDAI Gateway</p>
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="py-6 flex flex-col items-center justify-center text-center space-y-4 animate-scale-up">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-inner">
                                <CheckCircle size={40} className="text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-800 text-xl">Verified!</h3>
                                <p className="text-sm text-slate-500 mt-1 font-medium">Driving License added to Vault</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};