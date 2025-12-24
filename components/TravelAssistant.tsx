import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Languages, Calendar, MessageSquare, Clock, Mic, Volume2, Navigation, Star, Phone, ChevronLeft, ChevronRight, Camera, Upload, Eye, Plane, Bed, Package, CheckCircle, ArrowRight, ShieldCheck, Zap, Bike } from 'lucide-react';
import { ChatMessage, UserType, DayPlan, AppSettings, TripRecord, BookingSuggestion } from '../types';
import { sendMessageToAI, generateStructuredItinerary, translateText, VoiceAssistant, describeImage } from '../services/geminiService';

interface TravelAssistantProps {
  userType: UserType;
  settings?: AppSettings;
  addBooking?: (booking: TripRecord) => void;
}

type Mode = 'chat' | 'translate' | 'plan' | 'voice' | 'vision';

// Suggested Queries for Feature Discovery
const SUGGESTED_ACTIONS = [
    { label: "Plan a 3-day trip to Goa", icon: Calendar, color: "bg-violet-100 text-violet-700" },
    { label: "Rent a bike nearby", icon: Bike, color: "bg-orange-100 text-orange-700" },
    { label: "Is it safe in Delhi?", icon: ShieldCheck, color: "bg-red-100 text-red-700" },
    { label: "Translate 'Hello' to Hindi", icon: Languages, color: "bg-blue-100 text-blue-700" },
    { label: "Find a doctor", icon: Zap, color: "bg-emerald-100 text-emerald-700" }
];

// Simple Calendar Component
const SimpleCalendar = ({ onSelectRange }: { onSelectRange: (start: string, end: string) => void }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectStart, setSelectStart] = useState<Date | null>(null);
    const [selectEnd, setSelectEnd] = useState<Date | null>(null);

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

    const handleDateClick = (day: number) => {
        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        
        if (!selectStart || (selectStart && selectEnd)) {
            setSelectStart(clickedDate);
            setSelectEnd(null);
        } else {
            if (clickedDate < selectStart) {
                setSelectStart(clickedDate);
                setSelectEnd(selectStart);
                onSelectRange(clickedDate.toISOString().split('T')[0], selectStart.toISOString().split('T')[0]);
            } else {
                setSelectEnd(clickedDate);
                onSelectRange(selectStart.toISOString().split('T')[0], clickedDate.toISOString().split('T')[0]);
            }
        }
    };

    const isSelected = (day: number) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        if (selectStart && date.getTime() === selectStart.getTime()) return 'start';
        if (selectEnd && date.getTime() === selectEnd.getTime()) return 'end';
        if (selectStart && selectEnd && date > selectStart && date < selectEnd) return 'range';
        return null;
    };

    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

    return (
        <div className="bg-white border border-violet-100 rounded-2xl p-4 shadow-sm mt-2 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <button onClick={prevMonth} className="p-1 hover:bg-violet-50 rounded-full"><ChevronLeft size={16} className="text-violet-500"/></button>
                <span className="text-sm font-bold text-slate-800">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <button onClick={nextMonth} className="p-1 hover:bg-violet-50 rounded-full"><ChevronRight size={16} className="text-violet-500"/></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['S','M','T','W','T','F','S'].map(d => <span key={d} className="text-[10px] text-slate-400 font-bold">{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {Array(firstDay).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
                {Array(days).fill(null).map((_, i) => {
                    const status = isSelected(i + 1);
                    return (
                        <button
                            key={i}
                            onClick={() => handleDateClick(i + 1)}
                            className={`h-8 w-8 text-xs rounded-full flex items-center justify-center transition-all font-medium ${
                                status === 'start' || status === 'end' ? 'bg-violet-600 text-white font-bold shadow-md scale-105' :
                                status === 'range' ? 'bg-violet-100 text-violet-700' :
                                'hover:bg-slate-100 text-slate-700'
                            }`}
                        >
                            {i + 1}
                        </button>
                    )
                })}
            </div>
            <div className="mt-3 text-[10px] text-slate-400 text-center font-medium">Select Start & End Date</div>
        </div>
    );
};

export const TravelAssistant: React.FC<TravelAssistantProps> = ({ userType, settings, addBooking }) => {
  const [mode, setMode] = useState<Mode>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Greeting based on Settings
  useEffect(() => {
      let greeting = "Hello! I am **TravX Guide**, your personal travel assistant.";
      if (settings?.language === 'Hindi') greeting = "Namaste! Main **TravX Guide** hoon, aapka travel assistant.";
      else if (settings?.language === 'Tamil') greeting = "Vanakkam! Naan **TravX Guide**, ungal payana uthaviyaalan.";
      else if (settings?.language === 'French') greeting = "Bonjour! Je suis **TravX Guide**, votre assistant de voyage personnel.";
      else if (settings?.language === 'Spanish') greeting = "¡Hola! Soy **TravX Guide**, tu asistente de viajes personal.";
      
      setMessages([{
          id: '1',
          role: 'model',
          text: `${greeting} Ask me about itineraries, rentals, safety, or translations.`,
          timestamp: new Date()
      }]);
  }, [settings?.language]);

  // Translation State
  const [transLang, setTransLang] = useState(settings?.language || 'Hindi');
  const [translation, setTranslation] = useState('');

  // Plan State
  const [planDest, setPlanDest] = useState('');
  const [planDays, setPlanDays] = useState(3);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<DayPlan[] | null>(null);

  // Vision State
  const [visionImage, setVisionImage] = useState<string | null>(null);
  const [visionResult, setVisionResult] = useState('');

  // Voice State
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("Tap to Speak");
  const voiceAssistantRef = useRef<VoiceAssistant | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, generatedPlan, visionResult]);

  // Update days when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays > 0) {
          setPlanDays(diffDays);
      } else {
          setPlanDays(1); // Fallback
      }
    }
  }, [startDate, endDate]);

  // Voice Toggle
  const toggleVoice = async () => {
      if (isVoiceActive) {
          voiceAssistantRef.current?.disconnect();
          setIsVoiceActive(false);
          setVoiceStatus("Tap to Speak");
      } else {
          voiceAssistantRef.current = new VoiceAssistant();
          try {
              await voiceAssistantRef.current.connect((status) => setVoiceStatus(status));
              setIsVoiceActive(true);
          } catch (e) {
              console.error(e);
              setVoiceStatus("Error Accessing Mic");
          }
      }
  };

  // Handle Vision Input
  const handleVisionCapture = async () => {
      // Mocking an image capture for demo
      const mockImage = "data:image/jpeg;base64,...."; // In real app, open camera/file input
      setVisionImage("https://images.unsplash.com/photo-1596541656041-026858e7b99c?auto=format&fit=crop&q=80&w=400"); // Mock Display
      setIsLoading(true);
      // Simulate base64 string
      const desc = await describeImage("mock_base64_data");
      setVisionResult(desc || "This looks like an Indian Rupee note (₹500)."); // Fallback for mock
      setIsLoading(false);
  };

  // Cleanup Voice on Unmount
  useEffect(() => {
      return () => {
          voiceAssistantRef.current?.disconnect();
      }
  }, []);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    if (mode === 'translate') {
        setIsLoading(true);
        const res = await translateText(textToSend, transLang);
        setTranslation(res);
        setIsLoading(false);
        return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToAI(userMsg.text, 'general');
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        timestamp: new Date(),
        widget: response.widget,
        widgetData: response.widgetData
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanTrip = async () => {
      if (!planDest || !startDate || !endDate) return;
      setIsLoading(true);
      setGeneratedPlan(null);
      const plan = await generateStructuredItinerary(planDest, planDays, userType, startDate);
      setGeneratedPlan(plan);
      setIsLoading(false);
  };

  const handleDateSelect = (start: string, end: string) => {
      setStartDate(start);
      setEndDate(end);
      // Don't close calendar automatically to allow user to see selection, user can toggle close
  };

  const handleDirectBooking = (suggestion: BookingSuggestion) => {
      if (addBooking) {
        const newBooking: TripRecord = {
            id: Date.now().toString(),
            destination: suggestion.title,
            date: new Date().toISOString().split('T')[0],
            status: 'Upcoming',
            totalCost: suggestion.price,
            type: suggestion.type === 'Flight' ? 'Flight' : suggestion.type === 'Hotel' ? 'Stay' : 'Package',
            bookingRef: `AI-${Math.floor(Math.random() * 10000)}`
        };
        addBooking(newBooking);
        alert(`Booking Confirmed for ${suggestion.title}! Check "My Bookings"`);
      }
  };

  // Widget Renders
  const renderTripProposal = () => (
      <div className="mt-4 bg-white rounded-xl overflow-hidden border border-violet-200 shadow-md animate-slide-up">
          <div className="bg-violet-600 p-3 text-white">
              <h4 className="font-bold text-sm flex items-center"><Sparkles size={14} className="mr-2"/> Trip Proposal Generated</h4>
          </div>
          <div className="p-4 space-y-3">
              <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Destination</span>
                  <span className="font-bold text-slate-800">Jaipur (Estimated)</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Dates</span>
                  <span className="font-bold text-slate-800">Oct 12 - Oct 15</span>
              </div>
              
              <div className="bg-slate-50 p-3 rounded-lg space-y-2">
                  <p className="text-xs font-bold text-slate-600 mb-1">Recommended Add-ons:</p>
                  <label className="flex items-center space-x-2 text-xs text-slate-700">
                      <input type="checkbox" defaultChecked className="rounded text-violet-600 focus:ring-violet-500"/>
                      <span>Travel Insurance (₹499)</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs text-slate-700">
                      <input type="checkbox" className="rounded text-violet-600 focus:ring-violet-500"/>
                      <span>Local Guide (₹1200)</span>
                  </label>
              </div>

              <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg mt-2 text-sm hover:bg-black transition-colors">
                  Proceed to Checkout
              </button>
          </div>
      </div>
  );

  const renderBookingSuggestion = (suggestions: BookingSuggestion[]) => (
      <div className="mt-4 space-y-3 animate-slide-up">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">AI Agent Suggestions</p>
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
              {suggestions.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm min-w-[200px] flex flex-col justify-between hover:shadow-md transition-all">
                      <div>
                          <div className="flex justify-between items-start mb-2">
                              <div className={`p-1.5 rounded-lg ${item.type === 'Flight' ? 'bg-blue-50 text-blue-600' : item.type === 'Hotel' ? 'bg-purple-50 text-purple-600' : 'bg-pink-50 text-pink-600'}`}>
                                  {item.type === 'Flight' ? <Plane size={16}/> : item.type === 'Hotel' ? <Bed size={16}/> : <Package size={16}/>}
                              </div>
                              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{item.type}</span>
                          </div>
                          <h4 className="font-bold text-slate-800 text-sm leading-tight mb-1">{item.title}</h4>
                          <p className="text-[10px] text-slate-500 mb-3">{item.subtitle}</p>
                      </div>
                      
                      <div>
                          <div className="flex justify-between items-center mb-2">
                              <span className="font-black text-slate-800">₹{item.price}</span>
                              <span className="text-[10px] flex items-center font-bold text-amber-500"><Star size={10} className="fill-current mr-0.5"/> {item.rating}</span>
                          </div>
                          <button 
                            onClick={() => handleDirectBooking(item)}
                            className="w-full bg-violet-600 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center hover:bg-violet-700 active:scale-95 transition-all"
                          >
                              Book Now <ArrowRight size={12} className="ml-1"/>
                          </button>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderItinerary = () => (
      <div className="space-y-4 animate-fade-in pb-20">
          {generatedPlan?.map((day) => (
              <div key={day.day} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-violet-50 px-4 py-2 border-b border-violet-100 flex justify-between items-center">
                      <h3 className="font-bold text-violet-800">Day {day.day}</h3>
                      <span className="text-xs text-violet-600 font-medium">{day.title}</span>
                  </div>
                  <div className="p-4 space-y-4">
                      {day.items.map((item, idx) => (
                          <div key={idx} className="flex gap-3">
                              <div className="flex flex-col items-center">
                                  <div className="w-2 h-2 bg-slate-300 rounded-full mt-1.5" />
                                  {idx !== day.items.length - 1 && <div className="w-0.5 flex-1 bg-slate-100 my-1" />}
                              </div>
                              <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-slate-800 text-sm">{item.activity}</h4>
                                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 flex items-center">
                                        <Clock size={10} className="mr-1"/> {item.time}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500 mt-1">{item.notes}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          ))}
          <button onClick={() => setGeneratedPlan(null)} className="w-full py-2 text-sm text-slate-500 underline font-medium hover:text-slate-800">Clear Plan</button>
      </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Top Toggle */}
      <div className="px-2 py-2 bg-white border-b border-slate-200 flex space-x-1 overflow-x-auto scrollbar-hide z-10">
          {[
              { id: 'chat', label: 'Chat', icon: MessageSquare },
              { id: 'plan', label: 'Plan', icon: Calendar },
              { id: 'voice', label: 'Voice', icon: Mic },
              { id: 'translate', label: 'Trans', icon: Languages },
              { id: 'vision', label: 'Vision', icon: Eye }
          ].map(m => (
              <button 
                key={m.id}
                onClick={() => setMode(m.id as Mode)}
                aria-label={`Switch to ${m.label} mode`}
                className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${mode === m.id ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                  <m.icon size={14} /> <span>{m.label}</span>
              </button>
          ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mode === 'chat' && (
            <>
                {messages.map((msg, index) => (
                <div key={msg.id} className="space-y-2">
                    <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                            msg.role === 'user' 
                            ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-br-none' 
                            : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                        }`}>
                            <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
                            {msg.widget === 'proposal' && renderTripProposal()}
                            {msg.widget === 'booking-suggestion' && msg.widgetData && renderBookingSuggestion(msg.widgetData)}
                        </div>
                    </div>
                    {/* Show Suggestion Chips only after initial Greeting */}
                    {index === 0 && messages.length === 1 && (
                        <div className="grid grid-cols-2 gap-2 mt-4 animate-slide-up">
                            {SUGGESTED_ACTIONS.map((action, i) => (
                                <button 
                                    key={i}
                                    onClick={() => handleSend(action.label)}
                                    className={`${action.color} p-3 rounded-xl flex flex-col items-start space-y-2 transition-all hover:brightness-95 active:scale-95 text-left`}
                                >
                                    <action.icon size={18} />
                                    <span className="text-xs font-bold leading-tight">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                ))}
            </>
        )}

        {mode === 'voice' && (
            <div className="flex flex-col items-center justify-center h-full animate-fade-in space-y-8">
                 <div className="text-center space-y-2">
                     <h2 className="text-xl font-bold text-slate-800">Bharat Voice</h2>
                     <p className="text-xs text-slate-500 max-w-xs mx-auto">
                        Speak in Hindi, English, Tamil, Telugu, Bengali, or other Indian languages. AI will detect and respond naturally.
                     </p>
                 </div>

                 <div className="relative">
                     {isVoiceActive && (
                        <>
                            <div className="absolute inset-0 bg-violet-200 rounded-full animate-ping opacity-75"></div>
                            <div className="absolute -inset-4 bg-violet-100 rounded-full animate-pulse opacity-50"></div>
                        </>
                     )}
                     <button 
                        onClick={toggleVoice}
                        aria-label={isVoiceActive ? "Stop Listening" : "Start Listening"}
                        className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all ${isVoiceActive ? 'bg-violet-600 text-white scale-110' : 'bg-white text-slate-700 border-2 border-slate-100 hover:border-violet-200'}`}
                     >
                        {isVoiceActive ? <Volume2 size={40} /> : <Mic size={40} />}
                     </button>
                 </div>

                 <div className={`text-sm font-semibold px-4 py-2 rounded-full ${isVoiceActive ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-500'}`}>
                     {voiceStatus}
                 </div>
            </div>
        )}

        {mode === 'vision' && (
            <div className="flex flex-col items-center h-full animate-fade-in space-y-6 pt-4">
                 <div className="text-center space-y-1">
                     <h2 className="text-lg font-bold text-slate-800">Drishti Vision</h2>
                     <p className="text-xs text-slate-500">Capture images to identify currency, read signs, or describe surroundings.</p>
                 </div>

                 <div className="w-full max-w-xs aspect-square bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center relative overflow-hidden">
                     {visionImage ? (
                         <img src={visionImage} alt="Captured" className="w-full h-full object-cover" />
                     ) : (
                         <div className="text-slate-400 flex flex-col items-center">
                             <Camera size={48} className="mb-2"/>
                             <span className="text-xs font-bold">Tap to Capture</span>
                         </div>
                     )}
                 </div>

                 <div className="flex space-x-3 w-full max-w-xs">
                     <button 
                        onClick={handleVisionCapture}
                        aria-label="Capture Image"
                        className="flex-1 bg-violet-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center hover:bg-violet-700"
                     >
                         <Camera size={18} className="mr-2"/> Capture
                     </button>
                     <button 
                        aria-label="Upload Image"
                        className="flex-1 bg-white text-slate-700 border border-slate-200 py-3 rounded-xl font-bold text-sm flex items-center justify-center hover:bg-slate-50"
                     >
                         <Upload size={18} className="mr-2"/> Upload
                     </button>
                 </div>

                 {visionResult && (
                     <div className="w-full max-w-xs bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                         <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Analysis Result</h3>
                         <p className="text-sm font-medium text-slate-800 leading-relaxed">{visionResult}</p>
                     </div>
                 )}
            </div>
        )}

        {mode === 'translate' && (
            <div className="space-y-6 animate-fade-in">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-inner">
                        <Languages size={32} />
                    </div>
                    <h2 className="font-bold text-lg text-slate-800">AI Translator</h2>
                    <p className="text-xs text-slate-500 mb-4">Powered by iBhashini & Gemini</p>
                    
                    <div className="flex items-center justify-center space-x-2 mb-4 bg-slate-50 p-2 rounded-xl">
                        <span className="text-sm font-bold text-slate-600">English</span>
                        <span className="text-slate-300">→</span>
                        <select 
                            value={transLang} 
                            onChange={(e) => setTransLang(e.target.value)}
                            className="bg-transparent text-sm font-bold border-none outline-none text-slate-800"
                        >
                            <option value="Hindi">Hindi</option>
                            <option value="Tamil">Tamil</option>
                            <option value="Bengali">Bengali</option>
                            <option value="French">French</option>
                            <option value="Spanish">Spanish</option>
                        </select>
                    </div>
                    
                    {translation && (
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100 mt-4">
                            <p className="text-lg font-bold text-green-800">{translation}</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {mode === 'plan' && (
            <div className="space-y-4 animate-fade-in">
                {!generatedPlan ? (
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <h2 className="font-bold text-lg text-slate-800 mb-4">Create Itinerary</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Destination</label>
                                <input 
                                    type="text" 
                                    value={planDest}
                                    onChange={(e) => setPlanDest(e.target.value)}
                                    placeholder="e.g., Jaipur, Kerala"
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:border-violet-500 outline-none mt-2 transition-all"
                                />
                            </div>
                            
                            {/* Calendar Date Picker - Custom Component */}
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 flex justify-between items-center">
                                    <span>Travel Dates</span>
                                    <button onClick={() => setShowCalendar(!showCalendar)} className="text-violet-600 font-bold hover:underline">
                                        {showCalendar ? 'Hide Calendar' : 'Select Dates'}
                                    </button>
                                </label>
                                
                                {showCalendar ? (
                                    <SimpleCalendar onSelectRange={handleDateSelect} />
                                ) : (
                                    <div 
                                        onClick={() => setShowCalendar(true)}
                                        className="flex items-center justify-between p-3 border border-slate-200 rounded-xl cursor-pointer hover:border-violet-300 bg-slate-50 transition-all"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <Calendar size={18} className="text-slate-400"/>
                                            <span className={`text-sm ${startDate ? 'text-slate-800 font-bold' : 'text-slate-400 font-medium'}`}>
                                                {startDate ? `${new Date(startDate).toLocaleDateString()} - ${endDate ? new Date(endDate).toLocaleDateString() : '...'}` : 'Select Date Range'}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                
                                {startDate && endDate && (
                                    <div className="mt-2 flex justify-between items-center">
                                        <p className="text-[10px] text-violet-600 font-bold bg-violet-50 px-2 py-1 rounded">
                                            Duration: {planDays} Days
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={handlePlanTrip}
                                disabled={!planDest || !startDate || !endDate || isLoading}
                                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm mt-4 disabled:opacity-50 active:scale-95 transition-all shadow-lg hover:bg-black"
                            >
                                {isLoading ? <Sparkles size={16} className="animate-spin inline mr-2"/> : null}
                                Generate Smart Plan
                            </button>
                        </div>
                    </div>
                ) : renderItinerary()}
            </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-4 py-3 border border-slate-100 flex items-center space-x-2 shadow-sm">
              <Sparkles size={16} className="text-violet-500 animate-pulse" />
              <span className="text-xs text-slate-500 font-medium">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area (Only for Chat & Translate) */}
      {(mode === 'chat' || mode === 'translate') && (
        <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-200">
            <div className="flex items-center space-x-2 bg-slate-100/80 rounded-full px-4 py-2.5 border border-slate-200 focus-within:border-violet-300 focus-within:bg-white transition-all shadow-inner">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={mode === 'translate' ? "Enter text..." : "Ask TravX Guide..."}
                className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-800 placeholder-slate-400 font-medium"
            />
            <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className={`p-2 rounded-full ${isLoading || !input.trim() ? 'bg-slate-300' : 'bg-violet-600'} text-white transition-all hover:scale-105 active:scale-95 shadow-md`}
            >
                <Send size={16} />
            </button>
            </div>
        </div>
      )}
    </div>
  );
};