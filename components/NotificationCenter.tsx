import React, { useState } from 'react';
import { Bell, X, Clock, MapPin, Phone, AlertTriangle, CheckCircle, Bed, Plane, Bus, AlarmClock } from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../constants';
import { AppNotification } from '../types';

interface NotificationCenterProps {
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<'all' | 'priority'>('all');

  // Simple handlers to simulate interactions
  const handleSnooze = (id: string) => {
      alert("Reminder set for 15 minutes later.");
  };

  const handleSetAlarm = (id: string) => {
      alert("System Alarm set! We will wake you up 1 hour before this event.");
  };

  const filtered = activeTab === 'all' ? notifications : notifications.filter(n => n.priority === 'high');

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fade-in">
        <div className="w-full max-w-sm bg-slate-50 h-full shadow-2xl animate-slide-left flex flex-col">
            
            {/* Header */}
            <div className="bg-white p-5 border-b border-slate-200 flex justify-between items-center shadow-sm">
                <div className="flex items-center space-x-2">
                    <div className="bg-orange-100 p-2 rounded-full text-orange-600">
                        <Bell size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Smart Guide</h2>
                        <p className="text-xs text-slate-500">Timeline & Reminders</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                    <X size={20} className="text-slate-600"/>
                </button>
            </div>

            {/* Smart Timeline (Next Step) */}
            <div className="p-4 bg-slate-100">
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-3 opacity-10">
                        <Clock size={80} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Up Next</p>
                    <h3 className="text-xl font-bold leading-tight mb-2">Flight to Jaipur</h3>
                    <div className="flex items-center space-x-4 text-xs font-medium text-slate-300">
                        <span className="flex items-center"><Clock size={12} className="mr-1"/> 06:00 AM</span>
                        <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                        <span className="flex items-center"><MapPin size={12} className="mr-1"/> Gate 4</span>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
                        <span className="text-xs font-bold text-green-400 animate-pulse">Boarding in 40m</span>
                        <button className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                            View Ticket
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-4 pt-2">
                <div className="flex space-x-4 border-b border-slate-200">
                    <button 
                        onClick={() => setActiveTab('all')}
                        className={`pb-2 text-sm font-bold transition-colors ${activeTab === 'all' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-slate-400'}`}
                    >
                        All Reminders
                    </button>
                    <button 
                         onClick={() => setActiveTab('priority')}
                         className={`pb-2 text-sm font-bold transition-colors ${activeTab === 'priority' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-slate-400'}`}
                    >
                        Priority
                    </button>
                </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {filtered.map(notif => (
                    <div key={notif.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm group">
                        <div className="flex justify-between items-start mb-2">
                            <div className={`p-2 rounded-lg ${
                                notif.type === 'check-in' ? 'bg-blue-50 text-blue-600' : 
                                notif.type === 'agent' ? 'bg-green-50 text-green-600' :
                                notif.type === 'alert' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                            }`}>
                                {notif.type === 'check-in' ? <Plane size={18}/> : 
                                 notif.type === 'agent' ? <Phone size={18}/> :
                                 notif.type === 'alert' ? <AlertTriangle size={18}/> : <Bed size={18}/>}
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded-full">{notif.time}</span>
                        </div>
                        
                        <h4 className="font-bold text-slate-800 text-sm mb-1">{notif.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed mb-3">{notif.message}</p>
                        
                        {/* Details Grid */}
                        {notif.details && (
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                {notif.details.platform && (
                                    <div className="bg-slate-50 p-2 rounded text-[10px]">
                                        <span className="block text-slate-400 font-bold uppercase">Platform</span>
                                        <span className="font-bold text-slate-700">{notif.details.platform}</span>
                                    </div>
                                )}
                                {notif.details.pnr && (
                                    <div className="bg-slate-50 p-2 rounded text-[10px]">
                                        <span className="block text-slate-400 font-bold uppercase">PNR</span>
                                        <span className="font-bold text-slate-700">{notif.details.pnr}</span>
                                    </div>
                                )}
                                {notif.details.roomNumber && (
                                    <div className="bg-slate-50 p-2 rounded text-[10px]">
                                        <span className="block text-slate-400 font-bold uppercase">Room</span>
                                        <span className="font-bold text-slate-700">{notif.details.roomNumber}</span>
                                    </div>
                                )}
                                 {notif.details.agentNumber && (
                                    <div className="bg-slate-50 p-2 rounded text-[10px]">
                                        <span className="block text-slate-400 font-bold uppercase">Contact</span>
                                        <span className="font-bold text-slate-700">{notif.details.agentNumber}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex space-x-2 pt-2 border-t border-slate-50">
                            <button 
                                onClick={() => handleSnooze(notif.id)}
                                className="flex-1 py-2 text-[10px] font-bold bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 flex items-center justify-center space-x-1"
                            >
                                <Clock size={12}/> <span>Remind later</span>
                            </button>
                            <button 
                                onClick={() => handleSetAlarm(notif.id)}
                                className="flex-1 py-2 text-[10px] font-bold bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 flex items-center justify-center space-x-1"
                            >
                                <AlarmClock size={12}/> <span>Set Alarm</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};