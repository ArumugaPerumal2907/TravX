import React from 'react';
import { Bell, Globe, Shield, Smartphone, LogOut, ChevronRight, Eye, Volume2, Vibrate, Mic } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsProps {
    settings: AppSettings;
    onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings }) => {
    
  const updateAccessibility = (key: keyof AppSettings['accessibility']) => {
      onUpdateSettings({
          accessibility: {
              ...settings.accessibility,
              [key]: !settings.accessibility[key]
          }
      });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 font-sans">
      <div className="p-5 space-y-6 overflow-y-auto pb-24">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h2>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-4 flex items-center space-x-4 shadow-sm border border-slate-100">
             <div className="w-16 h-16 bg-gradient-to-tr from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                 U
             </div>
             <div className="flex-1">
                 <h3 className="font-bold text-slate-800 text-lg">Traveler Profile</h3>
                 <p className="text-xs text-slate-500 font-medium">traveler@travx.ai</p>
             </div>
             <button className="bg-slate-100 p-2 rounded-full text-slate-400 hover:bg-slate-200 transition-colors">
                 <ChevronRight size={20}/>
             </button>
        </div>

        {/* General Settings */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
            {[
                { icon: Globe, label: 'Language', value: settings.language, color: 'bg-blue-500' },
                { icon: Smartphone, label: 'Data Saver', toggle: true, state: settings.dataSaver, key: 'dataSaver', color: 'bg-green-500' },
                { icon: Bell, label: 'Notifications', toggle: true, state: settings.notifications, key: 'notifications', color: 'bg-rose-500' }
            ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer"
                     onClick={() => item.toggle && item.key && onUpdateSettings({ [item.key]: !item.state })}>
                    <div className="flex items-center space-x-3">
                        <div className={`${item.color} p-1.5 rounded-lg text-white shadow-sm`}>
                            <item.icon size={18} />
                        </div>
                        <span className="font-bold text-slate-700 text-sm">{item.label}</span>
                    </div>
                    {item.toggle ? (
                        <div className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 ${item.state ? 'bg-green-500' : 'bg-slate-200'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${item.state ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2 text-slate-400">
                            <span className="text-sm font-medium">{item.value}</span>
                            <ChevronRight size={16} />
                        </div>
                    )}
                </div>
            ))}
        </div>

        {/* Accessibility Settings */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
            <h3 className="px-4 pt-4 pb-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Accessibility</h3>
            {[
                { icon: Eye, label: 'Screen Reader Mode', state: settings.accessibility.screenReader, key: 'screenReader' },
                { icon: Vibrate, label: 'Haptic Feedback', state: settings.accessibility.hapticFeedback, key: 'hapticFeedback' },
                { icon: Mic, label: 'Voice-First Mode', state: settings.accessibility.voiceFirst, key: 'voiceFirst' }
            ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer"
                     onClick={() => updateAccessibility(item.key as keyof AppSettings['accessibility'])}>
                    <div className="flex items-center space-x-3">
                        <div className="bg-indigo-500 p-1.5 rounded-lg text-white shadow-sm">
                            <item.icon size={18} />
                        </div>
                        <span className="font-bold text-slate-700 text-sm">{item.label}</span>
                    </div>
                    <div className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 ${item.state ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${item.state ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                </div>
            ))}
        </div>

        {/* Security & Logout */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
             <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                 <div className="flex items-center space-x-3">
                     <div className="bg-slate-500 p-1.5 rounded-lg text-white">
                         <Shield size={18} />
                     </div>
                     <span className="font-bold text-slate-700 text-sm">Privacy & Security</span>
                 </div>
                 <ChevronRight size={16} className="text-slate-400"/>
             </button>
             <button className="w-full flex items-center justify-between p-4 border-t border-slate-50 hover:bg-slate-50 transition-colors">
                 <div className="flex items-center space-x-3">
                     <div className="bg-red-500 p-1.5 rounded-lg text-white">
                         <LogOut size={18} />
                     </div>
                     <span className="font-bold text-slate-700 text-sm">Sign Out</span>
                 </div>
             </button>
        </div>
      </div>
    </div>
  );
};