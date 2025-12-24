import React, { useState } from 'react';
import { MOCK_HISTORY } from '../constants';
import { Plane, Train, Bus, Package, CheckCircle, Clock, QrCode, Bed, Trash2, X, Download, Share2, FileText, Calendar } from 'lucide-react';
import { TripRecord, AppSettings } from '../types';

interface BookingsHistoryProps {
    bookings?: TripRecord[];
    onCancelBooking?: (id: string) => void;
    settings?: AppSettings;
}

export const BookingsHistory: React.FC<BookingsHistoryProps> = ({ bookings = MOCK_HISTORY, onCancelBooking, settings }) => {
    const [selectedTicket, setSelectedTicket] = useState<TripRecord | null>(null);

    const formatCurrency = (amount: number) => {
        if (settings?.currency === 'USD') return `$${(amount / 84).toFixed(2)}`;
        if (settings?.currency === 'EUR') return `€${(amount / 90).toFixed(2)}`;
        return `₹${amount.toLocaleString()}`;
    };

    const handleCancel = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to cancel this booking? Cancellation charges may apply.")) {
            if (onCancelBooking) onCancelBooking(id);
        }
    };

    // Sleek E-Ticket Modal
    const renderTicketModal = () => {
        if (!selectedTicket) return null;

        return (
            <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
                <div className="bg-slate-50 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-scale-up relative">
                    
                    {/* Premium Header */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white relative">
                        <button 
                            onClick={() => setSelectedTicket(null)}
                            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
                        >
                            <X size={18} className="text-white" />
                        </button>
                        <div className="flex justify-between items-center mt-2">
                             <div>
                                 <h3 className="text-[10px] font-bold tracking-widest uppercase opacity-70">TravX Secure Ticket</h3>
                                 <h2 className="text-2xl font-black tracking-tight">{selectedTicket.type.toUpperCase()}</h2>
                             </div>
                             <div className="bg-white/10 p-2 rounded-xl">
                                 {selectedTicket.type === 'Flight' ? <Plane size={24}/> : 
                                  selectedTicket.type === 'Transport' ? <Train size={24}/> :
                                  selectedTicket.type === 'Stay' ? <Bed size={24}/> : <Package size={24}/>}
                             </div>
                        </div>
                    </div>

                    {/* Ticket Body with "Tear-off" effect */}
                    <div className="bg-white p-6 relative">
                        {/* Cutouts */}
                        <div className="absolute -left-3 top-[-12px] w-6 h-6 bg-slate-900 rounded-full"></div>
                        <div className="absolute -right-3 top-[-12px] w-6 h-6 bg-slate-900 rounded-full"></div>
                        
                        <div className="space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Destination</p>
                                    <h3 className="text-lg font-bold text-slate-800 leading-snug">{selectedTicket.destination}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Date</p>
                                    <p className="text-sm font-bold text-slate-800">{selectedTicket.date}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Booking Ref</p>
                                    <p className="font-mono text-sm font-bold text-slate-800">{selectedTicket.bookingRef}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Status</p>
                                    <p className="text-sm font-bold text-green-600 uppercase tracking-wide">Confirmed</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Traveler</p>
                                    <p className="text-sm font-bold text-slate-800">You</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Price</p>
                                    <p className="text-sm font-bold text-slate-800">{formatCurrency(selectedTicket.totalCost)}</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center space-y-2 py-2">
                                <QrCode size={100} className="text-slate-800 opacity-90"/>
                                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-medium">Scan to Verify</p>
                            </div>
                        </div>

                        {/* Dashed Line */}
                        <div className="border-t-2 border-dashed border-slate-200 my-6"></div>

                        <div className="flex space-x-3">
                            <button className="flex-1 bg-slate-900 text-white py-3.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-lg active:scale-95 transition-transform">
                                <Download size={16} /> <span>Save PDF</span>
                            </button>
                            <button className="flex-1 bg-slate-100 text-slate-800 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 hover:bg-slate-200 active:scale-95 transition-transform">
                                <Share2 size={16} /> <span>Share</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {renderTicketModal()}

            <div className="p-5 bg-white border-b border-slate-200 shadow-sm z-10 sticky top-0 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">My Bookings</h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Your travel history & tickets</p>
                </div>
                <div className="bg-slate-100 p-2 rounded-full">
                    <FileText size={20} className="text-slate-600"/>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {bookings.map((booking) => (
                    <div 
                        key={booking.id} 
                        onClick={() => booking.status === 'Upcoming' && setSelectedTicket(booking)}
                        className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in relative group transition-all duration-300 ${booking.status === 'Upcoming' ? 'hover:shadow-lg cursor-pointer hover:border-orange-200' : 'opacity-90'}`}
                    >
                        {/* Status Line */}
                        <div className={`h-1.5 w-full ${
                            booking.status === 'Upcoming' ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                            booking.status === 'Completed' ? 'bg-gradient-to-r from-green-500 to-teal-500' : 'bg-slate-300'
                        }`}></div>

                        <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2.5 rounded-xl ${
                                        booking.type === 'Flight' ? 'bg-blue-50 text-blue-600' :
                                        booking.type === 'Transport' ? 'bg-orange-50 text-orange-600' :
                                        booking.type === 'Stay' ? 'bg-purple-50 text-purple-600' : 'bg-pink-50 text-pink-600'
                                    }`}>
                                        {booking.type === 'Flight' ? <Plane size={20} /> :
                                         booking.type === 'Transport' ? <Train size={20} /> :
                                         booking.type === 'Stay' ? <Bed size={20} /> :
                                         <Package size={20} />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 leading-tight">{booking.destination}</h3>
                                        <p className="text-xs text-slate-400 font-medium mt-0.5">{booking.type}</p>
                                    </div>
                                </div>
                                <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${
                                    booking.status === 'Upcoming' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                                    booking.status === 'Completed' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-slate-50 text-slate-500 border border-slate-100'
                                }`}>
                                    {booking.status}
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center text-slate-600 space-x-1.5 bg-slate-50 px-3 py-1.5 rounded-lg">
                                    <Calendar size={14} className="text-slate-400"/>
                                    <span className="font-semibold text-xs">{booking.date}</span>
                                </div>
                                <div className="font-bold text-slate-800">{formatCurrency(booking.totalCost)}</div>
                            </div>
                        </div>

                        {/* Actions Footer */}
                        <div className="bg-slate-50/50 px-5 py-3 border-t border-slate-100 flex justify-between items-center backdrop-blur-sm">
                            <span className="text-[10px] font-mono text-slate-400 tracking-wider">{booking.bookingRef}</span>
                            
                            {booking.status === 'Upcoming' ? (
                                <div className="flex items-center space-x-3">
                                     <button 
                                        onClick={(e) => handleCancel(e, booking.id)}
                                        className="text-[10px] font-bold text-red-500 hover:text-red-700 transition-colors flex items-center"
                                     >
                                        <Trash2 size={12} className="mr-1"/> Cancel
                                     </button>
                                     <div className="text-[10px] font-bold text-indigo-600 flex items-center cursor-pointer hover:underline">
                                        <QrCode size={12} className="mr-1"/> View Ticket
                                     </div>
                                </div>
                            ) : booking.status === 'Completed' ? (
                                <button className="text-[10px] font-bold text-slate-600 flex items-center hover:text-slate-900 transition-colors">
                                    <Download size={12} className="mr-1"/> Invoice
                                </button>
                            ) : (
                                <span className="text-[10px] font-bold text-slate-400">Archived</span>
                            )}
                        </div>
                    </div>
                ))}

                {bookings.length === 0 && (
                    <div className="text-center py-16 flex flex-col items-center">
                        <div className="bg-slate-100 p-6 rounded-full mb-4">
                            <Package size={32} className="text-slate-300"/>
                        </div>
                        <h3 className="text-slate-800 font-bold mb-1">No bookings yet</h3>
                        <p className="text-xs text-slate-500 max-w-[200px]">Your upcoming trips and tickets will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};