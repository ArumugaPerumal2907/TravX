import React, { useState } from 'react';
import { ShieldCheck, FileText, QrCode, Download, Share2, Plus, Lock, CheckCircle, Plane, Train, Bed } from 'lucide-react';
import { TripRecord } from '../types';

interface DocumentsVaultProps {
    bookings: TripRecord[];
}

export const DocumentsVault: React.FC<DocumentsVaultProps> = ({ bookings }) => {
    const [activeTab, setActiveTab] = useState<'ids' | 'tickets'>('ids');

    const renderIDCard = () => (
        <div className="relative w-full aspect-[1.586] bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl overflow-hidden shadow-xl border border-white mb-6">
            {/* Hologram Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.4)_25%,transparent_30%)] animate-[shimmer_3s_infinite]"></div>
            
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                <div className="flex items-center space-x-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Emblem" className="w-8 h-10 opacity-80" />
                    <div>
                        <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Government of India</h3>
                        <h2 className="text-sm font-black text-slate-800">Aadhar Verification</h2>
                    </div>
                </div>
                <ShieldCheck size={24} className="text-green-600" />
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Name</p>
                    <p className="text-sm font-bold text-slate-800">Traveler User</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">ID Number</p>
                    <p className="text-sm font-bold text-slate-800 tracking-wider">XXXX XXXX 8829</p>
                </div>
                <div className="bg-white p-1 rounded-lg shadow-sm">
                    <QrCode size={48} className="text-slate-800"/>
                </div>
            </div>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5">
                <ShieldCheck size={120} />
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="p-5 bg-white border-b border-slate-200 shadow-sm z-10">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-800">Documents Vault</h2>
                        <div className="flex items-center space-x-1 text-green-600 text-[10px] font-bold mt-1">
                            <Lock size={10} /> <span>Secured by DigiLocker</span>
                        </div>
                    </div>
                    <button className="bg-slate-100 p-2 rounded-full hover:bg-slate-200 transition-colors">
                        <Plus size={20} className="text-slate-600"/>
                    </button>
                </div>

                <div className="flex bg-slate-100 rounded-xl p-1">
                    <button 
                        onClick={() => setActiveTab('ids')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'ids' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
                    >
                        Identity Proofs
                    </button>
                    <button 
                        onClick={() => setActiveTab('tickets')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'tickets' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
                    >
                        Travel Tickets
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
                {activeTab === 'ids' ? (
                    <div className="space-y-6 animate-fade-in">
                        {renderIDCard()}
                        
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Linked Documents</h3>
                            
                            {['COVID Vaccination Cert', 'Driving License', 'PAN Card'].map((doc, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-violet-200 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-violet-50 p-2.5 rounded-lg text-violet-600">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm">{doc}</h4>
                                            <div className="flex items-center text-[10px] text-green-600 font-bold mt-0.5">
                                                <CheckCircle size={10} className="mr-1"/> Verified
                                            </div>
                                        </div>
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600">
                                        <Download size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 animate-fade-in">
                        {bookings.filter(b => b.status === 'Upcoming').length === 0 ? (
                            <div className="text-center py-10 opacity-50">
                                <FileText size={48} className="mx-auto mb-3"/>
                                <p className="text-sm font-bold">No upcoming tickets</p>
                            </div>
                        ) : (
                            bookings.filter(b => b.status === 'Upcoming').map(ticket => (
                                <div key={ticket.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative">
                                    <div className={`h-1.5 w-full ${ticket.type === 'Flight' ? 'bg-blue-500' : ticket.type === 'Stay' ? 'bg-purple-500' : 'bg-orange-500'}`}></div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className={`p-2 rounded-lg ${
                                                    ticket.type === 'Flight' ? 'bg-blue-50 text-blue-600' :
                                                    ticket.type === 'Stay' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'
                                                }`}>
                                                    {ticket.type === 'Flight' ? <Plane size={20} /> : ticket.type === 'Stay' ? <Bed size={20} /> : <Train size={20} />}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800">{ticket.destination}</h4>
                                                    <p className="text-xs text-slate-500">{ticket.date}</p>
                                                </div>
                                            </div>
                                            <span className="bg-slate-100 px-2 py-1 rounded text-[10px] font-mono font-bold text-slate-600">{ticket.bookingRef}</span>
                                        </div>
                                        
                                        <div className="border-t border-dashed border-slate-200 pt-3 flex justify-between items-center">
                                             <button className="flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-slate-900">
                                                 <QrCode size={16} /> <span>Show QR</span>
                                             </button>
                                             <div className="flex space-x-3">
                                                 <button className="text-slate-400 hover:text-slate-600"><Share2 size={16}/></button>
                                                 <button className="text-slate-400 hover:text-slate-600"><Download size={16}/></button>
                                             </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};