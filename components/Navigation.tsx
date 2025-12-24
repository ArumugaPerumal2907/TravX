import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Mic, Search, MapPin, Volume2, Layers, Crosshair, Map as MapIcon, Plus, Minus } from 'lucide-react';

export const Navigation: React.FC = () => {
  const [activeRoute, setActiveRoute] = useState(false);
  const [mapMode, setMapMode] = useState<'standard' | 'satellite'>('standard');
  const [activeLayers, setActiveLayers] = useState<string[]>(['attractions']);
  const [showLayers, setShowLayers] = useState(false);

  // Map Transformation State
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastTouchDistance = useRef<number | null>(null);

  const MIN_SCALE = 0.5;
  const MAX_SCALE = 4;

  // Haptic Wayfinding Logic
  useEffect(() => {
      if (activeRoute && navigator.vibrate) {
          // Simulate wayfinding vibration
          navigator.vibrate([100, 50, 100]); // Short-short buzz
      }
  }, [activeRoute]);

  // Layer Toggling
  const toggleLayer = (layer: string) => {
      setActiveLayers(prev => 
          prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
      );
  };

  // Zoom Logic
  const handleZoom = (delta: number) => {
    setScale(prev => Math.min(Math.max(prev + delta, MIN_SCALE), MAX_SCALE));
  };

  // Panning Logic
  const startPan = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStart.current = { x: clientX - position.x, y: clientY - position.y };
  };

  const pan = (clientX: number, clientY: number) => {
    if (isDragging) {
      setPosition({
        x: clientX - dragStart.current.x,
        y: clientY - dragStart.current.y
      });
    }
  };

  const stopPan = () => {
    setIsDragging(false);
    lastTouchDistance.current = null;
  };

  // Mouse Handlers
  const onMouseDown = (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent text selection
      startPan(e.clientX, e.clientY);
  };
  const onMouseMove = (e: React.MouseEvent) => pan(e.clientX, e.clientY);
  const onMouseUp = () => stopPan();
  const onMouseLeave = () => stopPan();
  const onWheel = (e: React.WheelEvent) => {
      const delta = -e.deltaY * 0.001;
      handleZoom(delta);
  };

  // Touch Handlers (Pinch & Pan)
  const onTouchStart = (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
          startPan(e.touches[0].clientX, e.touches[0].clientY);
      } else if (e.touches.length === 2) {
          // Calculate initial distance for pinch
          const dist = Math.hypot(
              e.touches[0].clientX - e.touches[1].clientX,
              e.touches[0].clientY - e.touches[1].clientY
          );
          lastTouchDistance.current = dist;
      }
  };

  const onTouchMove = (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
          pan(e.touches[0].clientX, e.touches[0].clientY);
      } else if (e.touches.length === 2 && lastTouchDistance.current) {
          const dist = Math.hypot(
              e.touches[0].clientX - e.touches[1].clientX,
              e.touches[0].clientY - e.touches[1].clientY
          );
          const delta = dist - lastTouchDistance.current;
          handleZoom(delta * 0.005);
          lastTouchDistance.current = dist;
      }
  };

  const resetView = () => {
      setScale(1);
      setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
        {/* Top Search Bar */}
        <div className="p-4 absolute top-0 left-0 right-0 z-20 pointer-events-none">
            <div className="bg-white rounded-xl shadow-lg flex items-center p-3 border border-slate-100 pointer-events-auto">
                <Search className="text-slate-400 ml-1 mr-3" size={20}/>
                <input 
                    type="text" 
                    placeholder="Search destination..."
                    className="flex-1 outline-none text-slate-700 font-medium"
                    defaultValue={activeRoute ? "Taj Mahal, Agra" : ""}
                />
                <div className="border-l pl-3 border-slate-200">
                    <Mic className="text-slate-500" size={20} />
                </div>
            </div>
            
            {/* Quick Filter Chips */}
            {!activeRoute && (
                <div className="mt-3 flex space-x-2 overflow-x-auto scrollbar-hide pointer-events-auto">
                    {['Restaurants', 'Petrol', 'Pharmacy', 'Hotels', 'Toilets'].map(cat => (
                        <button 
                            key={cat}
                            onClick={() => toggleLayer(cat.toLowerCase())}
                            className={`px-4 py-1.5 rounded-full shadow-md text-xs font-bold border whitespace-nowrap transition-all ${
                                activeLayers.includes(cat.toLowerCase()) 
                                ? 'bg-slate-800 text-white border-slate-800' 
                                : 'bg-white text-slate-700 border-slate-100'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}
        </div>

        {/* Map Area */}
        <div 
            className={`flex-1 relative overflow-hidden transition-colors duration-500 cursor-move touch-none ${mapMode === 'satellite' ? 'bg-slate-800' : 'bg-slate-200'}`}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={stopPan} // Simplified touch end
            onWheel={onWheel}
        >
             {/* Transform Container */}
             <div 
                style={{ 
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: 'center',
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                    width: '100%',
                    height: '100%'
                }}
                className="w-full h-full relative"
             >
                {/* Simulated Map Background */}
                <div className={`absolute inset-[-100%] bg-center opacity-20 ${mapMode === 'satellite' ? "bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')]" : "bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Google_Maps_Logo_2020.svg/2275px-Google_Maps_Logo_2020.svg.png')] bg-repeat"}`} style={{backgroundSize: '500px'}}></div>
                
                {/* Simulated Streets/Grid */}
                <div className="absolute top-0 bottom-0 left-1/2 w-4 bg-white/50 border-x border-slate-300/50 transform -translate-x-1/2"></div>
                <div className="absolute top-1/2 left-0 right-0 h-4 bg-white/50 border-y border-slate-300/50 transform -translate-y-1/2"></div>
                
                {/* Mock Pins */}
                {activeLayers.includes('pharmacy') && (
                    <div className="absolute top-[40%] left-[30%] animate-bounce">
                        <div className="text-red-500 bg-white p-1 rounded-full shadow-lg border border-red-100 scale-75 lg:scale-100">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        </div>
                    </div>
                )}
                {activeLayers.includes('hotels') && (
                    <div className="absolute bottom-[40%] right-[30%] animate-bounce delay-100">
                        <div className="text-blue-500 bg-white p-1 rounded-full shadow-lg border border-blue-100 scale-75 lg:scale-100">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                    </div>
                )}

                {/* Route Line */}
                {activeRoute && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
                        <path d="M 50% 80% L 50% 50% L 65% 50% L 65% 30%" fill="none" stroke={mapMode === 'satellite' ? '#60a5fa' : '#4f46e5'} strokeWidth="8" strokeLinecap="round" strokeDasharray="10 0" className="animate-pulse"/>
                    </svg>
                )}

                {/* User Puck - Stays relative to map content */}
                <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center animate-ping absolute"></div>
                    <div className="w-6 h-6 bg-blue-600 border-2 border-white rounded-full shadow-lg relative z-10 flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[4px] border-l-transparent border-b-[8px] border-b-white border-r-[4px] border-r-transparent mb-0.5"></div>
                    </div>
                </div>

                {activeRoute && (
                    <div className="absolute top-[30%] left-[65%] transform -translate-x-1/2 -translate-y-1/2">
                        <MapPin size={32} className="text-red-600 drop-shadow-lg fill-red-100 animate-bounce" />
                    </div>
                )}
             </div>

             {/* Directions Overlay */}
             {activeRoute && (
                 <div className="absolute top-24 left-4 right-4 bg-emerald-600 rounded-xl p-4 shadow-xl text-white flex items-start space-x-4 animate-slide-down z-20 pointer-events-auto">
                     <div className="mt-1">
                         <ArrowRight size={32} className="text-white"/>
                     </div>
                     <div>
                         <p className="text-emerald-100 text-xs font-medium uppercase tracking-wide">300 meters</p>
                         <h2 className="text-xl font-bold leading-tight">Turn right onto MG Road</h2>
                     </div>
                 </div>
             )}

             {/* Map Controls */}
             <div className="absolute right-4 bottom-24 flex flex-col space-y-2 z-20 pointer-events-auto">
                 <button onClick={() => handleZoom(0.5)} className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-700 active:bg-slate-50 transition-colors">
                     <Plus size={20} />
                 </button>
                 <button onClick={() => handleZoom(-0.5)} className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-700 active:bg-slate-50 transition-colors">
                     <Minus size={20} />
                 </button>
                 <div className="h-2"></div>
                 <button onClick={() => setShowLayers(!showLayers)} className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 active:scale-95 transition-transform">
                     <Layers size={20} />
                 </button>
                 <button onClick={() => setMapMode(mapMode === 'standard' ? 'satellite' : 'standard')} className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 active:scale-95 transition-transform">
                     <MapIcon size={20} />
                 </button>
                 <button onClick={resetView} className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600 active:scale-95 transition-transform">
                     <Crosshair size={20} />
                 </button>
             </div>

             {/* Layers Panel */}
             {showLayers && (
                 <div className="absolute right-16 bottom-24 bg-white p-3 rounded-xl shadow-xl border border-slate-100 animate-fade-in z-20 w-40 pointer-events-auto">
                     <h4 className="text-xs font-bold text-slate-800 mb-2 uppercase tracking-wide">Map Layers</h4>
                     <div className="space-y-2">
                         {['Traffic', 'Attractions', 'Hospitals', 'Hotels'].map(l => (
                             <label key={l} className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-slate-50 p-1 rounded">
                                 <input 
                                    type="checkbox" 
                                    checked={activeLayers.includes(l.toLowerCase())}
                                    onChange={() => toggleLayer(l.toLowerCase())}
                                    className="rounded text-indigo-600 focus:ring-indigo-500"
                                 />
                                 <span className="text-slate-700">{l}</span>
                             </label>
                         ))}
                     </div>
                 </div>
             )}
        </div>

        {/* Bottom Panel */}
        <div className="bg-white p-4 pb-20 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-10 relative">
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-4"></div>
            {activeRoute ? (
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-green-600">12 min <span className="text-slate-400 font-normal text-sm">(4.2 km)</span></h3>
                        <p className="text-xs text-slate-500">Fastest route due to traffic conditions</p>
                    </div>
                    <div className="flex space-x-3">
                        <button className="px-4 py-2 bg-red-100 text-red-600 rounded-full font-bold text-sm hover:bg-red-200" onClick={() => setActiveRoute(false)}>Exit</button>
                        <button className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200"><Volume2 size={20}/></button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <h3 className="font-bold text-slate-800">Recent Places</h3>
                    </div>
                    {[
                        { name: 'Taj Mahal', dist: '4.2 km', time: '12 min' },
                        { name: 'Hotel Pearl Palace', dist: '1.1 km', time: '5 min' },
                        { name: 'Railway Station', dist: '8.5 km', time: '25 min' }
                    ].map((place, i) => (
                        <div key={i} onClick={() => { setActiveRoute(true); resetView(); }} className="flex justify-between items-center py-2 cursor-pointer active:opacity-50 hover:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors">
                            <div className="flex items-center space-x-3">
                                <div className="bg-slate-100 p-2 rounded-full text-slate-500">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800 text-sm">{place.name}</p>
                                    <p className="text-xs text-slate-500">{place.dist}</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{place.time}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};