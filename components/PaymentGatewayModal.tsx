import React, { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Building, CheckCircle, ShieldCheck, Lock, X, ChevronRight, Loader2, Delete } from 'lucide-react';

interface PaymentGatewayModalProps {
    amount: number;
    itemName: string;
    onSuccess: () => void;
    onClose: () => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({ amount, itemName, onSuccess, onClose }) => {
    const [step, setStep] = useState<'method' | 'auth' | 'processing' | 'success'>('method');
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [pin, setPin] = useState('');

    const handleMethodConfirm = () => {
        if (!selectedMethod) return;
        setPin(''); // Reset PIN on new attempt
        setStep('auth');
    };

    const handlePinEnter = (num: string) => {
        if (pin.length < 6) {
            setPin(prev => prev + num);
        }
    };

    const handlePinDelete = () => {
        setPin(prev => prev.slice(0, -1));
    };

    const handlePay = () => {
        if (pin.length < 4) return; // Basic validation
        setStep('processing');
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                onSuccess();
            }, 1500);
        }, 2000);
    };

    if (step === 'success') {
        return (
            <div className="fixed inset-0 z-[60] bg-white flex flex-col items-center justify-center p-6 animate-fade-in">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-inner animate-scale-up">
                    <CheckCircle size={48} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-black text-slate-800">Payment Successful!</h2>
                <p className="text-slate-500 font-medium mt-2">Transaction ID: TXN-{Math.floor(Math.random() * 1000000)}</p>
                <div className="mt-8 w-full max-w-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-500">Amount Paid</span>
                        <span className="font-bold text-slate-800">₹{amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Paid via</span>
                        <span className="font-bold text-slate-800">{selectedMethod}</span>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'processing') {
        return (
            <div className="fixed inset-0 z-[60] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-fade-in">
                <Loader2 size={48} className="text-violet-600 animate-spin mb-4" />
                <h3 className="font-bold text-slate-800 text-lg">Processing Payment...</h3>
                <p className="text-xs text-slate-500 mt-2">Please do not close this window.</p>
                <div className="mt-8 flex items-center space-x-2 text-slate-400 text-xs font-bold">
                    <Lock size={12} /> <span>256-Bit Secure Connection</span>
                </div>
            </div>
        );
    }

    if (step === 'auth') {
        return (
            <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in">
                <div className="w-full max-w-md bg-slate-50 h-full shadow-2xl animate-slide-left flex flex-col">
                    <div className="bg-white p-5 border-b border-slate-200 flex items-center">
                        <button onClick={() => setStep('method')} className="mr-3 p-1 hover:bg-slate-100 rounded-full"><ChevronRight className="rotate-180" size={20}/></button>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Enter {selectedMethod === 'UPI' ? 'UPI PIN' : 'OTP'}</h2>
                            <p className="text-[10px] text-slate-500">Secure Verification for ₹{amount.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center p-6">
                        <div className="mb-8">
                            <Lock size={40} className="text-slate-300 mx-auto mb-4"/>
                            <div className="flex space-x-4">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all ${i < pin.length ? 'bg-slate-800 border-slate-800' : 'border-slate-300'}`}></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Numeric Keypad */}
                    <div className="bg-white p-4 pb-8 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                <button 
                                    key={num} 
                                    onClick={() => handlePinEnter(num.toString())}
                                    className="h-14 rounded-xl bg-slate-50 text-xl font-bold text-slate-700 hover:bg-slate-100 active:scale-95 transition-all shadow-sm border border-slate-100"
                                >
                                    {num}
                                </button>
                            ))}
                            <div className="h-14"></div> {/* Empty slot */}
                            <button 
                                onClick={() => handlePinEnter('0')}
                                className="h-14 rounded-xl bg-slate-50 text-xl font-bold text-slate-700 hover:bg-slate-100 active:scale-95 transition-all shadow-sm border border-slate-100"
                            >
                                0
                            </button>
                            <button 
                                onClick={handlePinDelete}
                                className="h-14 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all shadow-sm border border-slate-100"
                            >
                                <Delete size={24}/>
                            </button>
                        </div>
                        <button 
                            onClick={handlePay}
                            disabled={pin.length < 4}
                            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-black active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 disabled:active:scale-100"
                        >
                            <span>Confirm Payment</span>
                            <ChevronRight size={18} className="ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in">
            <div className="w-full max-w-md bg-slate-50 h-full shadow-2xl animate-slide-left flex flex-col">
                {/* Header */}
                <div className="bg-white p-5 border-b border-slate-200 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Checkout</h2>
                        <div className="flex items-center space-x-1 text-green-600 text-[10px] font-bold mt-0.5">
                            <ShieldCheck size={10} /> <span>Secure Payment Gateway</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                        <X size={20} className="text-slate-600"/>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5">
                    {/* Order Summary */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Order Summary</span>
                        <h3 className="font-bold text-slate-800 text-lg mt-1 mb-3">{itemName}</h3>
                        <div className="space-y-2 border-t border-slate-50 pt-3">
                             <div className="flex justify-between text-sm">
                                 <span className="text-slate-500">Base Fare</span>
                                 <span className="font-semibold text-slate-700">₹{(amount * 0.9).toFixed(0)}</span>
                             </div>
                             <div className="flex justify-between text-sm">
                                 <span className="text-slate-500">Taxes & Fees</span>
                                 <span className="font-semibold text-slate-700">₹{(amount * 0.1).toFixed(0)}</span>
                             </div>
                             <div className="flex justify-between text-lg font-black pt-2 border-t border-slate-50 mt-2">
                                 <span className="text-slate-800">Total</span>
                                 <span className="text-violet-600">₹{amount.toLocaleString()}</span>
                             </div>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <h3 className="font-bold text-slate-700 mb-3 text-sm px-1">Select Payment Method</h3>
                    <div className="space-y-3">
                        <button 
                            onClick={() => setSelectedMethod('UPI')}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${selectedMethod === 'UPI' ? 'bg-violet-50 border-violet-500 ring-1 ring-violet-500' : 'bg-white border-slate-200 hover:border-violet-200'}`}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><Smartphone size={20}/></div>
                                <div className="text-left">
                                    <span className="block font-bold text-slate-800 text-sm">UPI</span>
                                    <span className="block text-[10px] text-slate-500">GPay, PhonePe, Paytm</span>
                                </div>
                            </div>
                            {selectedMethod === 'UPI' && <CheckCircle size={20} className="text-violet-600"/>}
                        </button>

                        <button 
                            onClick={() => setSelectedMethod('Card')}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${selectedMethod === 'Card' ? 'bg-violet-50 border-violet-500 ring-1 ring-violet-500' : 'bg-white border-slate-200 hover:border-violet-200'}`}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><CreditCard size={20}/></div>
                                <div className="text-left">
                                    <span className="block font-bold text-slate-800 text-sm">Credit / Debit Card</span>
                                    <span className="block text-[10px] text-slate-500">Visa, Mastercard, RuPay</span>
                                </div>
                            </div>
                            {selectedMethod === 'Card' && <CheckCircle size={20} className="text-violet-600"/>}
                        </button>

                         <button 
                            onClick={() => setSelectedMethod('NetBanking')}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${selectedMethod === 'NetBanking' ? 'bg-violet-50 border-violet-500 ring-1 ring-violet-500' : 'bg-white border-slate-200 hover:border-violet-200'}`}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="bg-slate-100 p-2 rounded-lg text-slate-600"><Building size={20}/></div>
                                <div className="text-left">
                                    <span className="block font-bold text-slate-800 text-sm">Net Banking</span>
                                    <span className="block text-[10px] text-slate-500">All Indian Banks</span>
                                </div>
                            </div>
                            {selectedMethod === 'NetBanking' && <CheckCircle size={20} className="text-violet-600"/>}
                        </button>
                    </div>
                </div>

                <div className="p-5 bg-white border-t border-slate-200 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                    <button 
                        onClick={handleMethodConfirm}
                        disabled={!selectedMethod}
                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-black active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 disabled:active:scale-100"
                    >
                        <span>Proceed to Pay</span>
                        <ChevronRight size={18} className="ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};