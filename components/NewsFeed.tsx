import React from 'react';
import { MOCK_NEWS } from '../constants';
import { AlertTriangle, Info, Calendar } from 'lucide-react';

export const NewsFeed: React.FC = () => {
    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="p-4 bg-white border-b border-slate-200 shadow-sm z-10 sticky top-0">
                <h2 className="text-xl font-bold text-slate-800">Travel News & Alerts</h2>
                <p className="text-xs text-slate-500">Stay informed about your destinations</p>
            </div>

            <div className="p-4 space-y-4">
                {MOCK_NEWS.map(news => (
                    <div key={news.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 animate-fade-in">
                        <div className="flex justify-between items-start mb-2">
                             <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                 news.type === 'alert' ? 'bg-red-100 text-red-700' :
                                 news.type === 'event' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                             }`}>
                                 {news.type}
                             </div>
                             <span className="text-[10px] text-slate-400">{news.date}</span>
                        </div>
                        <h3 className="font-bold text-slate-800 mb-1">{news.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed mb-3">{news.summary}</p>
                        
                        {news.location && (
                            <div className="flex items-center text-xs text-slate-500">
                                <span className="font-semibold mr-1">Location:</span> {news.location}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};