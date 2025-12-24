import React, { useState, useEffect } from 'react';
import { Home, MessageSquare, Shield, Wallet, Menu, Users, Navigation, FileText, X, Globe, Compass, Settings, LogOut, Briefcase, Ticket, Newspaper, Bell, FileBadge } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  userType: 'citizen' | 'foreigner';
  onNotificationClick: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, userType, onNotificationClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Core Navigation (Bottom Bar)
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'services', icon: Briefcase, label: 'Plan' },
    { id: 'assistant', icon: MessageSquare, label: 'Guide' },
    { id: 'navigation', icon: Navigation, label: 'Nav' },
    { id: 'safety', icon: Shield, label: 'Safety' },
  ];

  // Secondary Navigation (Hamburger Menu)
  const menuItems = [
    { id: 'history', icon: Ticket, label: 'My Bookings' },
    { id: 'vault', icon: FileBadge, label: 'Documents Vault' }, // Added
    { id: 'organizer', icon: FileText, label: 'Expenses & Notes' },
    { id: 'news', icon: Newspaper, label: 'Travel News' },
    { id: 'community', icon: Users, label: 'Community & Clubs' },
    { id: 'payments', icon: Wallet, label: 'Payments' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const handleMenuNavigation = (tabId: string) => {
    onTabChange(tabId);
    setIsMenuOpen(false);
  };

  // Shake to SOS Logic
  useEffect(() => {
    let lastX = 0, lastY = 0, lastZ = 0;
    let lastUpdate = 0;
    const SHAKE_THRESHOLD = 15;

    const handleMotion = (event: DeviceMotionEvent) => {
        const acceleration = event.accelerationIncludingGravity;
        if (!acceleration) return;

        const curTime = new Date().getTime();
        if ((curTime - lastUpdate) > 100) {
            const diffTime = curTime - lastUpdate;
            lastUpdate = curTime;
            
            const x = acceleration.x || 0;
            const y = acceleration.y || 0;
            const z = acceleration.z || 0;

            const speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;

            if (speed > SHAKE_THRESHOLD) {
                // Shake detected, trigger SOS navigation
                onTabChange('safety');
                // You might want to pass a state to auto-trigger SOS on the safety page
            }

            lastX = x;
            lastY = y;
            lastZ = z;
        }
    };

    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', handleMotion, false);
    }
    return () => {
        if (window.DeviceMotionEvent) {
            window.removeEventListener('devicemotion', handleMotion);
        }
    };
  }, [onTabChange]);

  return (
    <div className="h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden border-x border-slate-200 relative font-sans text-slate-900">
      {/* iOS-style Glass Header with Mini Doodle */}
      <header className="absolute top-0 left-0 right-0 h-[65px] px-5 flex items-center justify-between z-40 bg-white/80 backdrop-blur-xl border-b border-white/20 transition-all">
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => onTabChange('dashboard')}>
          <div className="relative w-10 h-10 flex items-center justify-center">
             {/* Mini Doodle SVG Behind */}
             <svg className="absolute inset-[-4px] w-12 h-12 text-violet-300 animate-spin-slow" viewBox="0 0 100 100" style={{animationDuration: '10s'}}>
                <path d="M50,10 Q90,10 90,50 Q90,90 50,90 Q10,90 10,50 Q10,10 50,10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
             </svg>
             
             <div className="relative w-full h-full bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center rotate-3">
                <Compass size={22} className="text-white" strokeWidth={2} />
             </div>
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tight leading-none text-slate-900 flex items-center">
                Trav<span className="text-violet-600">X</span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
            <button 
                onClick={onNotificationClick}
                aria-label="Notifications"
                className="p-2 hover:bg-slate-100 rounded-full transition-all active:scale-95 focus:outline-none relative group"
            >
                <Bell size={22} className="text-slate-600 group-hover:animate-wiggle" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
              className="p-2 hover:bg-slate-100 rounded-full transition-all active:scale-95 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} className="text-slate-800"/> : <Menu size={24} className="text-slate-800"/>}
            </button>
        </div>
      </header>

      {/* Hamburger Menu Overlay */}
      {isMenuOpen && (
        <div className="absolute inset-0 z-50 bg-slate-900/20 backdrop-blur-sm animate-fade-in" onClick={() => setIsMenuOpen(false)}>
           <div 
             className="absolute top-0 right-0 w-[280px] bg-white h-full shadow-2xl animate-slide-left flex flex-col z-50 rounded-l-3xl overflow-hidden"
             onClick={(e) => e.stopPropagation()}
           >
              <div className="p-8 bg-slate-900 text-white relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 opacity-10"><Globe size={120} /></div>
                  <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl mb-4 flex items-center justify-center font-bold text-xl shadow-inner border border-white/10">
                      {userType === 'citizen' ? 'IN' : 'FV'}
                  </div>
                  <h3 className="font-bold text-lg leading-tight">{userType === 'citizen' ? 'Indian Traveler' : 'Foreign Visitor'}</h3>
                  <p className="text-xs text-slate-400 opacity-80">traveler@travx.ai</p>
              </div>
              
              <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                  {menuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleMenuNavigation(item.id)}
                        className={`w-full flex items-center space-x-4 px-5 py-3.5 rounded-xl transition-all duration-200 active:scale-95 group ${
                            activeTab === item.id 
                            ? 'bg-slate-100 text-slate-900 shadow-sm' 
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                          <item.icon size={20} strokeWidth={2} className={`${activeTab === item.id ? 'text-slate-900' : 'text-slate-400'} group-hover:scale-110 transition-transform`} />
                          <span className="font-semibold text-sm">{item.label}</span>
                      </button>
                  ))}
              </div>

              <div className="p-6 border-t border-slate-50">
                  <button className="flex items-center space-x-3 text-slate-500 hover:text-rose-500 w-full px-2 py-2 text-sm font-semibold transition-colors">
                      <LogOut size={18} />
                      <span>Sign Out</span>
                  </button>
              </div>
           </div>
        </div>
      )}

      {/* Main Content Area - with padding for header and nav */}
      <main className="flex-1 overflow-y-auto pt-[65px] pb-24 scrollbar-hide relative bg-slate-50 z-0">
        {children}
      </main>

      {/* Floating Bottom Navigation */}
      <nav className="absolute bottom-6 left-4 right-4 bg-white/90 backdrop-blur-xl border border-white/40 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex justify-between px-2 py-2 z-40">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { onTabChange(item.id); setIsMenuOpen(false); }}
              aria-label={item.label}
              className={`group flex flex-col items-center justify-center flex-1 py-2 rounded-2xl transition-all duration-300 active:scale-90 ${
                isActive 
                  ? 'text-violet-600 bg-violet-50' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon 
                size={24} 
                strokeWidth={isActive ? 2.5 : 2} 
                className={`mb-1 transition-all duration-500 ${
                    isActive 
                    ? '-translate-y-1 scale-110 rotate-0 drop-shadow-sm' 
                    : 'group-hover:animate-wiggle'
                }`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              />
              <span className={`text-[10px] font-bold transition-all duration-300 origin-bottom ${isActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-0 hidden'}`}>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  );
};