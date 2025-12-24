import React, { useState } from 'react';
import { QrCode, Phone, Smartphone, RefreshCw, CheckCircle, Lock } from 'lucide-react';
import { PaymentMode } from '../types';

export const PaymentModule: React.FC = () => {
  const [mode, setMode] = useState<PaymentMode>(PaymentMode.UPI);
  const [step, setStep] = useState(0); // 0: Select, 1: Process, 2: Success

  const renderUPI = () => (
    <div className="flex flex-col items-center justify-center space-y-6 py-10 animate-fade-in">
      <div className="w-48 h-48 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center shadow-inner">
        <QrCode size={120} className="text-slate-800" />
      </div>
      <p className="text-slate-500 text-sm">Scan any UPI QR Code</p>
      <button 
        onClick={() => setStep(2)}
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
      >
        Simulate Scan & Pay
      </button>
    </div>
  );

  const renderUSSD = () => (
    <div className="bg-black rounded-xl p-4 font-mono text-green-500 min-h-[300px] flex flex-col shadow-2xl border-4 border-slate-700 animate-fade-in">
       {/* Mock USSD Interface */}
       <div className="flex-1 space-y-2">
         <p>{`>`} Dialing *99#...</p>
         {step >= 1 && (
            <div className="mt-4">
                <p>Welcome to NUUP</p>
                <p>1. Send Money</p>
                <p>2. Request Money</p>
                <p>3. Check Balance</p>
                <p>4. My Profile</p>
            </div>
         )}
         {step >= 1 && (
             <div className="mt-4 border-b border-green-500/50 pb-1 w-1/2 animate-pulse">
                1_
             </div>
         )}
       </div>
       <div className="mt-4 grid grid-cols-3 gap-2">
            {[1,2,3,4,5,6,7,8,9,'*',0,'#'].map(n => (
                <button key={n} onClick={() => n === '#' ? setStep(2) : setStep(1)} className="bg-slate-800 rounded p-2 text-center hover:bg-slate-700 text-white font-sans text-xs">
                    {n}
                </button>
            ))}
       </div>
    </div>
  );

  if (step === 2) {
      return (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-scale-up">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle size={40} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Payment Successful!</h2>
              <p className="text-slate-500 mt-2">Transaction ID: BY-{Math.floor(Math.random()*1000000)}</p>
              <p className="text-sm font-semibold mt-6 text-slate-800">₹ 540.00</p>
              <button onClick={() => setStep(0)} className="mt-8 text-indigo-600 font-medium hover:underline">Make another payment</button>
          </div>
      )
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Payments</h2>
        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
            <CheckCircle size={12} className="mr-1"/> BHIM Verified
        </div>
      </div>

       {/* SIM Security Check */}
       <div className="bg-slate-50 rounded-lg p-3 flex items-center justify-between border border-slate-200">
           <div className="flex items-center space-x-2">
               <div className="bg-white p-1.5 rounded-full text-slate-600 shadow-sm">
                    <Lock size={14} />
               </div>
               <div>
                   <p className="text-xs font-bold text-slate-700">Secure Environment</p>
                   <p className="text-[10px] text-slate-500">SIM Verified: Airtel 4G</p>
               </div>
           </div>
           <span className="text-[10px] font-bold text-green-600">SAFE</span>
       </div>

      <div className="flex space-x-2 bg-slate-100 p-1 rounded-lg">
        <button 
            onClick={() => { setMode(PaymentMode.UPI); setStep(0); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === PaymentMode.UPI ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
        >
            <div className="flex items-center justify-center space-x-2">
                <Smartphone size={16}/> <span>UPI / Online</span>
            </div>
        </button>
        <button 
            onClick={() => { setMode(PaymentMode.OFFLINE_USSD); setStep(0); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === PaymentMode.OFFLINE_USSD ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
        >
            <div className="flex items-center justify-center space-x-2">
                <Phone size={16}/> <span>Offline (*99#)</span>
            </div>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 min-h-[350px]">
        {mode === PaymentMode.UPI ? renderUPI() : renderUSSD()}
      </div>

      <div className="bg-blue-50 p-4 rounded-xl flex items-start space-x-3">
          <RefreshCw size={20} className="text-blue-600 mt-1 shrink-0"/>
          <div>
              <p className="text-sm font-bold text-blue-800">Currency Converter</p>
              <p className="text-xs text-blue-600 mt-1">1 USD ≈ 83.50 INR</p>
              <p className="text-xs text-blue-600">1 EUR ≈ 90.20 INR</p>
          </div>
      </div>
    </div>
  );
};