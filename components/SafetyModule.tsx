import React, { useState, useEffect } from 'react';
import { AlertTriangle, PhoneCall, MapPin, Share2, ShieldCheck, Info, Copy, Check, X, User, Send, Stethoscope } from 'lucide-react';
import { EMERGENCY_CONTACTS, FOREIGN_EMBASSIES, MOCK_AGENTS } from '../constants';
import { UserType } from '../types';
import { getSafetyAdvice } from '../services/geminiService';

interface SafetyModuleProps {
    userType: UserType;
    onNavigate?: (tab: string) => void;
}

export const SafetyModule: React.FC<SafetyModuleProps> = ({ userType, onNavigate }) => {
  const [sosActive, setSosActive] = useState(false);
  const [safetyTip, setSafetyTip] = useState("Scanning location safety...");
  const [showLocationShare, setShowLocationShare] = useState(false);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [sharedContacts, setSharedContacts] = useState<Set<string>>(new Set());

  useEffect(() => {
      const fetchSafety = async () => {
          const tip = await getSafetyAdvice("Connaught Place, New Delhi", "Evening");
          setSafetyTip(tip);
      };
      fetchSafety();
  }, []);

  const handleSOS = () => {
    setSosActive(true);
    // In a real app, this would trigger navigator.vibrate, send SMS, etc.
    setTimeout(() => alert("SOS Triggered! Location sent to nearest police station and emergency contacts."), 500);
  };

  const generateShareLink = () => {
      setShareLinkCopied(true);
      setTimeout(() => setShareLinkCopied(false), 2000);
  };

  const handleShareWithContact = (id: string) => {
      // Simulate API call to grant location access
      setSharedContacts(prev => new Set(prev).add(id));
  };

  return (
    <div className="p-4 space-y-6 pb-24 relative">
      {/* AI Safety Tip */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
          <Info className="text-blue-600 shrink-0 mt-0.5" size={20} />
          <div>
              <h3 className="font-bold text-blue-900 text-sm">AI Safety Guard</h3>
              <p className="text-xs text-blue-700 mt-1 leading-relaxed">{safetyTip}</p>
          </div>
      </div>

      <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
            <AlertTriangle size={32} />
        </div>
        <h2 className="text-lg font-bold text-red-900">Emergency Distress</h2>
        <p className="text-sm text-red-700">Pressing this will contact police and share your live location.</p>
        
        <button 
            onClick={handleSOS}
            className={`w-24 h-24 rounded-full mx-auto shadow-xl border-4 border-red-200 flex items-center justify-center font-bold text-white text-xl transition-all active:scale-95 ${sosActive ? 'bg-red-700 animate-pulse' : 'bg-red-600 hover:bg-red-700'}`}
        >
            SOS
        </button>
      </div>

      {/* Medical Assistance Card */}
      <div 
        onClick={() => onNavigate && onNavigate('medical')}
        className="bg-teal-50 border border-teal-100 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-teal-100 transition-colors shadow-sm"
      >
          <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center">
                  <Stethoscope size={24} />
              </div>
              <div>
                  <h3 className="font-bold text-teal-900">Medical Assistance</h3>
                  <p className="text-xs text-teal-700">Find doctors, first aid & pharmacy</p>
              </div>
          </div>
          <div className="bg-white p-2 rounded-full shadow text-teal-600">
              <PhoneCall size={18} />
          </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setShowLocationShare(true)}
            className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50"
          >
              <Share2 size={24} className="text-indigo-600 mb-2"/>
              <span className="text-xs font-semibold text-slate-700">Share Location</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50">
              <ShieldCheck size={24} className="text-green-600 mb-2"/>
              <span className="text-xs font-semibold text-slate-700">Safety Check</span>
          </button>
      </div>

      <div>
          <h3 className="font-bold text-slate-800 mb-3 flex items-center">
              <PhoneCall size={18} className="mr-2"/> Essential Numbers
          </h3>
          <div className="space-y-2">
              {EMERGENCY_CONTACTS.map((contact, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                      <div className="flex flex-col">
                          <span className="font-medium text-slate-800 text-sm">{contact.name}</span>
                          <span className="text-xs text-slate-500">{contact.category}</span>
                      </div>
                      <a href={`tel:${contact.number}`} className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-bold hover:bg-green-200">
                          {contact.number}
                      </a>
                  </div>
              ))}
          </div>
      </div>

      {userType === 'foreigner' && (
          <div>
            <h3 className="font-bold text-slate-800 mb-3 flex items-center">
                <MapPin size={18} className="mr-2"/> Embassy Contacts
            </h3>
            <div className="space-y-2">
                {FOREIGN_EMBASSIES.map((contact, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                        <span className="font-medium text-slate-800 text-sm">{contact.name}</span>
                        <a href={`tel:${contact.number}`} className="text-indigo-600 text-sm font-bold hover:underline">
                            Call
                        </a>
                    </div>
                ))}
            </div>
          </div>
      )}

      {/* Location Sharing Modal */}
      {showLocationShare && (
          <div className="absolute inset-0 bg-white z-20 flex flex-col animate-fade-in">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
                  <h3 className="font-bold text-slate-800">Live Location Sharing</h3>
                  <button onClick={() => setShowLocationShare(false)} className="p-2 bg-slate-100 rounded-full">
                      <X size={16} />
                  </button>
              </div>
              
              <div className="flex-1 bg-slate-100 relative overflow-hidden flex flex-col">
                  {/* Map View */}
                  <div className="h-1/2 relative">
                      <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Google_Maps_Logo_2020.svg/2275px-Google_Maps_Logo_2020.svg.png')] bg-center bg-cover opacity-20"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                           <div className="w-32 h-32 border-2 border-indigo-200 rounded-full flex items-center justify-center relative animate-pulse">
                               <div className="w-16 h-16 border-2 border-indigo-400 rounded-full opacity-50"></div>
                               <div className="w-4 h-4 bg-indigo-600 rounded-full z-10 shadow-lg border-2 border-white"></div>
                               <div className="absolute -top-8 bg-white px-2 py-0.5 rounded shadow text-[10px] font-bold text-indigo-700 whitespace-nowrap">You are here</div>
                           </div>
                      </div>
                  </div>

                  {/* Sharing Controls */}
                  <div className="flex-1 bg-white p-4 rounded-t-2xl shadow-lg -mt-4 relative z-10 overflow-y-auto">
                      <div className="mb-6">
                          <p className="text-xs font-bold text-slate-700 mb-2">Share Link</p>
                          <div className="flex space-x-2">
                              <input disabled value="https://bharatyatra.ai/live/u/8923" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600" />
                              <button 
                                onClick={generateShareLink}
                                className={`px-4 py-2 rounded-lg text-white font-bold text-xs transition-all ${shareLinkCopied ? 'bg-green-600' : 'bg-indigo-600'}`}
                              >
                                  {shareLinkCopied ? <Check size={16}/> : <Copy size={16}/>}
                              </button>
                          </div>
                      </div>

                      <div>
                          <p className="text-xs font-bold text-slate-700 mb-3">Send Access to Contacts</p>
                          <div className="space-y-3">
                              {/* Family Mock */}
                              <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50">
                                  <div className="flex items-center space-x-3">
                                      <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
                                          <User size={14} />
                                      </div>
                                      <div>
                                          <p className="text-sm font-bold text-slate-800">Mom / Family</p>
                                          <p className="text-[10px] text-slate-500">Trusted Contact</p>
                                      </div>
                                  </div>
                                  <button 
                                    onClick={() => handleShareWithContact('family')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${sharedContacts.has('family') ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
                                  >
                                      {sharedContacts.has('family') ? <Check size={12}/> : <Send size={12}/>}
                                      <span>{sharedContacts.has('family') ? 'Sent' : 'Share'}</span>
                                  </button>
                              </div>

                              {/* Agent Mock - Taking first agent from constants */}
                              {Object.values(MOCK_AGENTS).slice(0, 1).map(agent => (
                                  <div key={agent.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50">
                                      <div className="flex items-center space-x-3">
                                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                                              <User size={14} />
                                          </div>
                                          <div>
                                              <p className="text-sm font-bold text-slate-800">{agent.name} (Agent)</p>
                                              <p className="text-[10px] text-slate-500">Trip Guide</p>
                                          </div>
                                      </div>
                                      <button 
                                        onClick={() => handleShareWithContact(agent.id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${sharedContacts.has(agent.id) ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
                                      >
                                          {sharedContacts.has(agent.id) ? <Check size={12}/> : <Send size={12}/>}
                                          <span>{sharedContacts.has(agent.id) ? 'Sent' : 'Share'}</span>
                                      </button>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};