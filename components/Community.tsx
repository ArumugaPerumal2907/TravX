import React, { useState, useRef } from 'react';
import { MOCK_POSTS, MOCK_GROUPS } from '../constants';
import { Heart, MessageCircle, MapPin, Plus, Map, List, X, Send, Navigation as NavIcon, ZoomIn, ZoomOut, Users, UserPlus, Calendar } from 'lucide-react';
import { CommunityPost } from '../types';

interface CommunityProps {
  onNavigate?: (tab: string) => void;
}

export const Community: React.FC<CommunityProps> = ({ onNavigate }) => {
    const [activeSection, setActiveSection] = useState<'feed' | 'clubs'>('feed');
    const [filter, setFilter] = useState('All');
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [posts, setPosts] = useState<CommunityPost[]>(MOCK_POSTS);
    
    // Modal & Map States
    const [showPostModal, setShowPostModal] = useState(false);
    const [newPostContent, setNewPostContent] = useState('');
    const [selectedMapPost, setSelectedMapPost] = useState<CommunityPost | null>(null);

    // Map Interaction State
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const lastTouchDistance = useRef<number | null>(null);

    const handleAddPost = () => {
        if (!newPostContent.trim()) return;
        const newPost: CommunityPost = {
            id: Date.now().toString(),
            author: 'You',
            avatar: 'ME',
            content: newPostContent,
            likes: 0,
            replies: 0,
            tag: 'Question',
            location: 'Current Location',
            coords: { x: 50, y: 50 } // Default center for demo
        };
        setPosts([newPost, ...posts]);
        setNewPostContent('');
        setShowPostModal(false);
    };

    const handleJoinGroup = () => {
        alert("Request Sent! The group admin will review your request.");
    };

    const handleNavigateToLocation = (post: CommunityPost) => {
        if (onNavigate) {
            onNavigate('navigation');
        } else {
            alert(`Navigating to ${post.location}...`);
        }
    };

    // Zoom Logic
    const handleZoom = (delta: number) => {
        setScale(prev => Math.min(Math.max(prev + delta, 0.5), 4));
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

    // Event Handlers
    const onMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        startPan(e.clientX, e.clientY);
    };
    const onMouseMove = (e: React.MouseEvent) => pan(e.clientX, e.clientY);
    const onMouseUp = stopPan;
    const onMouseLeave = stopPan;
    
    const onTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            startPan(e.touches[0].clientX, e.touches[0].clientY);
        } else if (e.touches.length === 2) {
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

    const onWheel = (e: React.WheelEvent) => {
        const delta = -e.deltaY * 0.001;
        handleZoom(delta);
    };

    const filteredPosts = posts.filter(p => filter === 'All' || p.tag === filter);

    const renderMap = () => (
        <div 
            className="relative w-full h-full bg-slate-100 overflow-hidden cursor-move touch-none animate-fade-in"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={stopPan}
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
                className="w-full h-full relative bg-blue-50"
             >
                {/* Simulated Map Background */}
                <div className="absolute inset-[-50%] opacity-30 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png')] bg-center bg-cover" style={{ filter: 'grayscale(100%) contrast(1.2)' }}></div>
                <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>

                 {/* Pins */}
                 <div className="absolute inset-0">
                    {filteredPosts.map(post => (
                        post.coords && (
                            <button
                                key={post.id}
                                onClick={(e) => { e.stopPropagation(); setSelectedMapPost(post); }}
                                onMouseDown={(e) => e.stopPropagation()}
                                onTouchStart={(e) => e.stopPropagation()}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 hover:z-20 focus:outline-none z-10"
                                style={{ top: `${post.coords.y}%`, left: `${post.coords.x}%` }}
                            >
                                <div className={`w-12 h-12 rounded-full border-4 shadow-xl flex items-center justify-center font-bold text-xs relative overflow-hidden bg-white ${
                                    post.tag === 'Review' ? 'border-green-500 text-green-700' : 
                                    post.tag === 'Question' ? 'border-orange-500 text-orange-700' : 'border-blue-500 text-blue-700'
                                }`}>
                                    {/* Avatar placeholder */}
                                    <span className="z-10">{post.avatar}</span>
                                    
                                    {/* Pointy bit */}
                                    <div className={`absolute -bottom-1 w-3 h-3 bg-white transform rotate-45 border-r border-b ${
                                         post.tag === 'Review' ? 'border-green-500' : 
                                         post.tag === 'Question' ? 'border-orange-500' : 'border-blue-500'
                                    }`}></div>
                                </div>
                                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-slate-800 shadow-sm whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                                    {post.author}
                                </div>
                            </button>
                        )
                    ))}
                 </div>
             </div>
             
             {/* Map Controls */}
             <div className="absolute right-4 bottom-24 flex flex-col space-y-2 z-10">
                 <button onClick={() => handleZoom(0.5)} className="p-3 bg-white rounded-full shadow-xl text-slate-700 active:bg-slate-50 transition-colors border border-slate-100"><ZoomIn size={20}/></button>
                 <button onClick={() => handleZoom(-0.5)} className="p-3 bg-white rounded-full shadow-xl text-slate-700 active:bg-slate-50 transition-colors border border-slate-100"><ZoomOut size={20}/></button>
             </div>

             {/* Selected Post Popup */}
             {selectedMapPost && (
                 <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-xl shadow-2xl border border-slate-100 animate-slide-up z-20" onClick={(e) => e.stopPropagation()}>
                     <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-xs text-slate-600 border border-slate-200">{selectedMapPost.avatar}</div>
                            <div>
                                <h3 className="font-bold text-sm text-slate-800">{selectedMapPost.author}</h3>
                                <p className="text-[10px] text-slate-500 flex items-center"><MapPin size={10} className="mr-1"/> {selectedMapPost.location}</p>
                            </div>
                        </div>
                        <button onClick={() => setSelectedMapPost(null)} className="p-1 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600">
                            <X size={16} />
                        </button>
                     </div>
                     <p className="text-xs text-slate-700 mb-3 leading-relaxed">{selectedMapPost.content}</p>
                     
                     <div className="grid grid-cols-2 gap-3 mb-2">
                        <div className="flex space-x-4 items-center">
                            <button className="flex items-center text-xs text-slate-500 space-x-1 hover:text-pink-500">
                                <Heart size={14} /> <span>{selectedMapPost.likes}</span>
                            </button>
                            <button className="flex items-center text-xs text-slate-500 space-x-1 hover:text-blue-500">
                                <MessageCircle size={14} /> <span>Reply</span>
                            </button>
                        </div>
                     </div>

                     <button 
                        onClick={() => handleNavigateToLocation(selectedMapPost)}
                        className="w-full bg-slate-800 text-white py-2.5 rounded-lg font-bold text-xs flex items-center justify-center hover:bg-slate-900 transition-colors"
                     >
                         <NavIcon size={14} className="mr-2"/> Navigate to Location
                     </button>
                 </div>
             )}
        </div>
    );

    const renderClubs = () => (
        <div className="p-4 space-y-4 animate-fade-in">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-slate-800">Popular Travel Clubs</h3>
                <button className="text-xs text-indigo-600 font-bold">See All</button>
            </div>
            
            {MOCK_GROUPS.map(group => (
                <div key={group.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-2xl border border-indigo-100">
                            {group.avatar}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800 text-sm">{group.name}</h4>
                            <p className="text-xs text-slate-500 flex items-center mt-0.5">
                                <MapPin size={10} className="mr-1"/> {group.destination}
                            </p>
                        </div>
                        <div className="text-right">
                             <div className="bg-green-50 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center">
                                 <Users size={10} className="mr-1"/> {group.members}/{group.maxMembers}
                             </div>
                        </div>
                    </div>
                    
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                        {group.description}
                    </p>
                    
                    <div className="flex justify-between items-center border-t border-slate-50 pt-3">
                         <div className="flex items-center text-xs text-slate-500">
                             <Calendar size={12} className="mr-1"/> {group.date}
                         </div>
                         <button onClick={handleJoinGroup} className="flex items-center space-x-1 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm">
                             <UserPlus size={12} />
                             <span>Join Group</span>
                         </button>
                    </div>
                </div>
            ))}
            
            <button className="w-full border-2 border-dashed border-slate-300 text-slate-500 py-3 rounded-xl text-sm font-bold flex items-center justify-center hover:bg-slate-50">
                <Plus size={16} className="mr-2"/> Create New Club
            </button>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-slate-50 relative">
            {/* Header */}
            <div className="p-4 bg-white border-b border-slate-200 z-10 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                     <h2 className="font-bold text-xl text-slate-800">Community</h2>
                     {activeSection === 'feed' && (
                        <div className="flex space-x-2">
                             <div className="bg-slate-100 rounded-lg p-1 flex">
                                 <button 
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-slate-800' : 'text-slate-400'}`}
                                 >
                                     <List size={18} />
                                 </button>
                                 <button 
                                    onClick={() => setViewMode('map')}
                                    className={`p-1.5 rounded-md transition-all ${viewMode === 'map' ? 'bg-white shadow text-slate-800' : 'text-slate-400'}`}
                                 >
                                     <Map size={18} />
                                 </button>
                             </div>
                             <button 
                                onClick={() => setShowPostModal(true)}
                                className="bg-slate-800 text-white rounded-full p-2 hover:bg-slate-700 active:scale-95 transition-all shadow-md"
                             >
                                <Plus size={20} />
                             </button>
                        </div>
                     )}
                </div>

                {/* Sub-Nav */}
                <div className="flex space-x-4 mb-2">
                    <button 
                        onClick={() => setActiveSection('feed')}
                        className={`text-sm font-bold pb-2 border-b-2 transition-colors ${activeSection === 'feed' ? 'border-slate-800 text-slate-800' : 'border-transparent text-slate-400'}`}
                    >
                        Feed & Map
                    </button>
                    <button 
                        onClick={() => setActiveSection('clubs')}
                        className={`text-sm font-bold pb-2 border-b-2 transition-colors ${activeSection === 'clubs' ? 'border-slate-800 text-slate-800' : 'border-transparent text-slate-400'}`}
                    >
                        Travel Clubs
                    </button>
                </div>

                {/* Filters (Only for Feed) */}
                {activeSection === 'feed' && (
                    <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-1">
                        {['All', 'Review', 'Question', 'Tip'].map(f => (
                            <button 
                                key={f} 
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filter === f ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto relative">
                {activeSection === 'feed' ? (
                    viewMode === 'list' ? (
                        <div className="p-4 space-y-4">
                            {filteredPosts.map(post => (
                                <div key={post.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 animate-fade-in">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center font-bold text-indigo-700 text-sm">
                                                {post.avatar}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-sm">{post.author}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                                        post.tag === 'Review' ? 'bg-green-100 text-green-700' : 
                                                        post.tag === 'Question' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                        {post.tag}
                                                    </span>
                                                    {post.location && (
                                                        <span className="flex items-center text-slate-400 text-[10px]">
                                                            <MapPin size={10} className="mr-0.5"/>
                                                            {post.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                        {post.content}
                                    </p>

                                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                        <button className="flex items-center space-x-1 text-slate-400 hover:text-red-500 transition-colors">
                                            <Heart size={16} />
                                            <span className="text-xs">{post.likes}</span>
                                        </button>
                                        <button className="flex items-center space-x-1 text-slate-400 hover:text-blue-500 transition-colors">
                                            <MessageCircle size={16} />
                                            <span className="text-xs">{post.replies} Replies</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        renderMap()
                    )
                ) : (
                    renderClubs()
                )}
            </div>

            {/* New Post Modal */}
            {showPostModal && (
                <div className="absolute inset-0 bg-black/50 z-50 flex items-end justify-center animate-fade-in">
                    <div className="bg-white w-full rounded-t-3xl p-6 shadow-2xl animate-slide-up">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-slate-800">New Community Post</h3>
                            <button onClick={() => setShowPostModal(false)} className="p-1 bg-slate-100 rounded-full hover:bg-slate-200">
                                <X size={20} className="text-slate-600"/>
                            </button>
                        </div>
                        <textarea
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            placeholder="Share a tip, review, or question..."
                            className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 resize-none mb-4"
                        />
                        <button 
                            onClick={handleAddPost}
                            disabled={!newPostContent.trim()}
                            className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-95 transition-all"
                        >
                            <Send size={18} />
                            <span>Post to Community</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};