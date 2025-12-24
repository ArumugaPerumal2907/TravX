import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CloudSun, ArrowRight, Plane, Bed, Train, Bus, Car, MapPin, Sparkles, Wind, Droplets, Utensils, ShoppingBag, Star, TrendingUp, ChevronRight, Play, Newspaper, Info, RefreshCw, Languages, Shield, Bike, Megaphone, Zap } from 'lucide-react';
import { MOCK_EXPENSES, APP_SERVICES } from '../constants';
import { UserType } from '../types';

const COLORS = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b']; // Violet, Pink, Emerald, Amber

interface DashboardProps {
  userType: UserType;
  onNavigate: (tab: string) => void;
}

// Cinematic Recommendation Data
const RECOMMENDATIONS = [
    {
        id: '1',
        category: 'Trending Spot',
        title: 'Amer Fort',
        location: 'Jaipur, Rajasthan',
        context: 'Most visited today',
        tagline: 'Witness the Royal Grandeur',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=800',
        weather: '28°C • Clear',
        rating: 4.9,
        action: 'Plan Visit',
        icon: TrendingUp
    },
    {
        id: '2',
        category: 'Must Try Food',
        title: 'Laxmi Mishthan',
        location: 'Jaipur • 5km away',
        context: 'Perfect lunch near Amer',
        tagline: 'World Famous Ghewar & Kachori',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800',
        weather: 'Open Now',
        rating: 4.8,
        action: 'View Menu',
        icon: Utensils
    },
    {
        id: '3',
        category: 'Shopping Spree',
        title: 'Johri Bazaar',
        location: 'Jaipur • Old City',
        context: 'Famous for Gems',
        tagline: 'Jewelry & Traditional Textiles',
        image: 'https://images.unsplash.com/photo-1596541656041-026858e7b99c?auto=format&fit=crop&q=80&w=800',
        weather: 'Crowd: Moderate',
        rating: 4.7,
        action: 'Explore Shops',
        icon: ShoppingBag
    }
];

const ANNOUNCEMENTS = [
    { id: 1, text: "New: Rent Bikes & Cars with DigiLocker Verification!", icon: Bike, color: "bg-orange-500" },
    { id: 2, text: "Safety First: Offline SOS & Location Sharing active.", icon: Shield, color: "bg-red-500" },
    { id: 3, text: "Travel Cashless: Use Offline UPI Payments (*99#).", icon: Zap, color: "bg-blue-500" },
    { id: 4, text: "Plan Smarter: Get AI Itineraries in seconds.", icon: Sparkles, color: "bg-violet-500" },
];

export const Dashboard: React.FC<DashboardProps> = ({ userType, onNavigate }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % RECOMMENDATIONS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Announcement Rotator
  useEffect(() => {
      const interval = setInterval(() => {
          setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
          setFadeKey(prev => prev + 1);
      }, 4000);
      return () => clearInterval(interval);
  }, []);

  const handleServiceClick = (serviceId: string) => {
    switch (serviceId) {
        case 'flights': onNavigate('services-transport-flight'); break;
        case 'hotels': onNavigate('services-stays'); break;
        case 'irctc': onNavigate('services-transport-train'); break;
        case 'bus': onNavigate('services-transport-bus'); break;
        case 'cabs': onNavigate('services-transport-jeep'); break;
        case 'rental': onNavigate('services-transport-rental'); break;
        case 'safety': onNavigate('safety'); break;
        case 'weather': onNavigate('services'); break;
        case 'nav': onNavigate('navigation'); break;
        case 'organizer': onNavigate('organizer'); break;
        case 'translator': onNavigate('assistant'); break;
        case 'currency': onNavigate('payments'); break;
        case 'news': onNavigate('news'); break;
        default: onNavigate('services'); break;
    }
  };

  const ESSENTIALS = [
      { id: 'flights', name: 'Flights', icon: Plane },
      { id: 'hotels', name: 'Stays', icon: Bed },
      { id: 'rental', name: 'Rentals', icon: Bike }, // Updated to show Rentals prominently
  ];

  const CITIZEN_SPECIFIC = [
      { id: 'irctc', name: 'Trains', icon: Train },
      { id: 'cabs', name: 'Cabs', icon: Car },
      { id: 'news', name: 'News', icon: Newspaper }, 
  ];

  const FOREIGNER_SPECIFIC = [
      { id: 'translator', name: 'Translate', icon: Languages },
      { id: 'currency', name: 'Money', icon: RefreshCw },
      { id: 'safety', name: 'Safety', icon: Shield },
  ];

  const DISPLAY_SERVICES = [
      ...ESSENTIALS,
      ...(userType === 'citizen' ? CITIZEN_SPECIFIC : FOREIGNER_SPECIFIC),
  ];

  const currentRec = RECOMMENDATIONS[activeSlide];
  const currentAnnouncement = ANNOUNCEMENTS[announcementIndex];

  return (
    <div className="p-5 space-y-6 animate-fade-in">
      
      {/* Dynamic Announcement Banner */}
      <div 
        key={fadeKey}
        className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex items-center space-x-3 overflow-hidden animate-fade-in cursor-pointer hover:shadow-md transition-all"
        onClick={() => {
            if (currentAnnouncement.id === 1) onNavigate('services-transport-rental');
            if (currentAnnouncement.id === 2) onNavigate('safety');
            if (currentAnnouncement.id === 3) onNavigate('payments');
            if (currentAnnouncement.id === 4) onNavigate('services');
        }}
      >
          <div className={`${currentAnnouncement.color} text-white p-2 rounded-xl shadow-sm shrink-0`}>
              <currentAnnouncement.icon size={18} />
          </div>
          <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 flex items-center">
                  <Megaphone size={10} className="mr-1"/> Announcement
              </p>
              <p className="text-xs font-bold text-slate-800 truncate">{currentAnnouncement.text}</p>
          </div>
          <ChevronRight size={16} className="text-slate-400 shrink-0"/>
      </div>

      {/* Cinematic Recommendation Widget */}
      <div className="relative rounded-[32px] overflow-hidden shadow-2xl shadow-violet-900/20 h-[380px] bg-slate-900 group transform transition-transform hover:scale-[1.01] duration-500">
         {/* Background Slideshow */}
         {RECOMMENDATIONS.map((rec, idx) => (
             <div 
                key={rec.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === activeSlide ? 'opacity-100' : 'opacity-0'}`}
             >
                 <img 
                    src={rec.image} 
                    alt={rec.title} 
                    className="w-full h-full object-cover transition-transform duration-[10s] ease-linear transform scale-100 group-hover:scale-110"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90"></div>
             </div>
         ))}

         {/* Content Layer */}
         <div className="absolute inset-0 p-6 flex flex-col justify-between">
            {/* Top Bar */}
            <div className="flex justify-between items-start">
                <div className="flex flex-col items-start space-y-2">
                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full shadow-lg">
                        <MapPin size={12} className="text-violet-300"/>
                        <span className="text-[10px] font-bold text-white tracking-wide uppercase">{currentRec.location}</span>
                    </div>
                    {currentRec.context && (
                         <div className="flex items-center space-x-1.5 bg-rose-500/90 backdrop-blur-md px-3 py-1 rounded-lg shadow-lg shadow-rose-900/20">
                             <Sparkles size={10} className="text-white"/>
                             <span className="text-[10px] font-bold text-white">{currentRec.context}</span>
                         </div>
                    )}
                </div>
                
                <div className="flex items-center space-x-1.5 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-white">
                    <CloudSun size={14} className="text-amber-300"/>
                    <span className="text-[10px] font-bold">{currentRec.weather}</span>
                </div>
            </div>

            {/* Bottom Content */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <span className="bg-white text-slate-900 text-[10px] font-black px-2 py-0.5 rounded shadow-sm flex items-center uppercase tracking-wider">
                        <currentRec.icon size={10} className="mr-1 text-violet-600"/> {currentRec.category}
                    </span>
                    <span className="text-white/90 text-[10px] flex items-center font-bold bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                        <Star size={10} className="text-amber-400 fill-amber-400 mr-1"/> {currentRec.rating}
                    </span>
                </div>

                <div>
                    <h2 className="text-4xl font-black text-white leading-[0.95] tracking-tight drop-shadow-xl">
                        {currentRec.title}
                    </h2>
                    <p className="text-sm text-slate-300 font-medium line-clamp-1 mt-2 opacity-90">
                        {currentRec.tagline}
                    </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <button 
                        onClick={() => onNavigate('services')}
                        className="bg-violet-600 text-white text-xs font-bold px-6 py-3 rounded-2xl flex items-center hover:bg-violet-500 transition-all shadow-lg shadow-violet-600/30 active:scale-95 group/btn"
                    >
                        {currentRec.icon === Utensils ? 'Order Now' : currentRec.icon === ShoppingBag ? 'Shop Collection' : 'Plan Visit'}
                        <ArrowRight size={14} className="ml-2 transition-transform group-hover/btn:translate-x-1"/>
                    </button>
                    
                    <div className="flex space-x-2">
                        {RECOMMENDATIONS.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`h-1.5 rounded-full transition-all duration-500 ${idx === activeSlide ? 'w-6 bg-white' : 'w-1.5 bg-white/30'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* Quick Services Grid */}
      <div>
        <h3 className="font-bold text-slate-400 mb-4 text-xs uppercase tracking-widest pl-1">
            {userType === 'citizen' ? 'Bookings & Essentials' : 'Travel Toolkit'}
        </h3>
        <div className="grid grid-cols-3 gap-4">
            {DISPLAY_SERVICES.map((service) => (
                <button 
                    key={service.id}
                    onClick={() => handleServiceClick(service.id)}
                    className="flex flex-col items-center justify-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 active:scale-95 group"
                >
                    <div className={`p-3.5 rounded-2xl mb-3 transition-colors duration-300 shadow-sm ${
                        'bg-slate-50 text-slate-600 group-hover:bg-violet-50 group-hover:text-violet-600'
                    }`}>
                        {/* @ts-ignore */}
                        <service.icon size={24} strokeWidth={2} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{service.name}</span>
                </button>
            ))}
        </div>
      </div>

      {/* Budget Tracker */}
      <div className="bg-white p-6 rounded-[32px] shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 text-lg">Trip Budget</h3>
              <button 
                onClick={() => onNavigate('organizer')} 
                className="text-xs text-violet-600 font-bold flex items-center hover:bg-violet-50 px-3 py-1.5 rounded-full transition-colors"
              >
                  Analytics <ChevronRight size={14} className="ml-1"/>
              </button>
          </div>
          <div className="flex items-center">
            <div className="h-32 w-32 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={MOCK_EXPENSES}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={50}
                        paddingAngle={5}
                        dataKey="amount"
                        nameKey="category"
                        stroke="none"
                        cornerRadius={4}
                    >
                        {MOCK_EXPENSES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                    />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Spent</span>
                    <span className="text-sm font-black text-slate-800">₹16.8k</span>
                </div>
            </div>
            <div className="flex-1 ml-8 space-y-3">
                {MOCK_EXPENSES.slice(0, 3).map((exp, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs group cursor-default">
                        <div className="flex items-center">
                            <div className="w-2.5 h-2.5 rounded-full mr-3 ring-2 ring-white shadow-sm" style={{ backgroundColor: COLORS[idx] }} />
                            <span className="text-slate-500 font-semibold group-hover:text-slate-800 transition-colors">{exp.category}</span>
                        </div>
                        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">₹{exp.amount}</span>
                    </div>
                ))}
            </div>
          </div>
      </div>
    </div>
  );
};