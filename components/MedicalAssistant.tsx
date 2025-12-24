import React, { useState, useRef, useEffect } from 'react';
import { Send, HeartPulse, MapPin, Phone, ShieldAlert, Stethoscope, ArrowLeft, Plus } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToAI } from '../services/geminiService';
import { MOCK_DOCTORS } from '../constants';

interface MedicalAssistantProps {
  onBack?: () => void;
}

export const MedicalAssistant: React.FC<MedicalAssistantProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Namaste. I am **Bharat Swasthya**, your medical guide. I can help with first aid, symptoms, or finding nearby doctors. How are you feeling?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

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
      const response = await sendMessageToAI(userMsg.text, 'medical');
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        timestamp: new Date(),
        widget: response.widget
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderDoctorList = () => (
      <div className="mt-4 space-y-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-teal-700 uppercase tracking-wide">Nearby Medical Help</h4>
            <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">GPS Active</span>
          </div>
          {MOCK_DOCTORS.map(doc => (
              <div key={doc.id} className="bg-white p-3 rounded-xl border border-teal-100 shadow-sm flex items-center justify-between">
                  <div>
                      <h5 className="font-bold text-slate-800 text-sm">{doc.name}</h5>
                      <p className="text-xs text-slate-500">{doc.specialty}</p>
                      <div className="flex items-center text-xs mt-1 text-slate-400">
                          <MapPin size={10} className="mr-1"/> {doc.distance} • {doc.hospital}
                      </div>
                  </div>
                  <a href={`tel:${doc.phone}`} className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors">
                      <Phone size={18} />
                  </a>
              </div>
          ))}
          <button className="w-full py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">
              View More on Map
          </button>
      </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Header */}
      <div className="bg-teal-600 p-4 text-white shadow-md z-10">
          <div className="flex items-center space-x-3">
              {onBack && (
                  <button onClick={onBack} className="p-1 hover:bg-white/20 rounded-full">
                      <ArrowLeft size={20}/>
                  </button>
              )}
              <div className="bg-white/20 p-2 rounded-full">
                  <Stethoscope size={20} className="text-white"/>
              </div>
              <div>
                  <h2 className="font-bold text-lg leading-tight">Bharat Swasthya</h2>
                  <p className="text-[10px] text-teal-100">AI Medical Assistant • 24/7</p>
              </div>
          </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-teal-50 p-2 border-b border-teal-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="flex space-x-2 px-2">
              <button onClick={() => handleSend("Call Ambulance")} className="flex items-center space-x-1 bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-xs font-bold border border-red-200 animate-pulse">
                  <ShieldAlert size={12}/> <span>Emergency (108)</span>
              </button>
              <button onClick={() => handleSend("Find nearest Pharmacy")} className="flex items-center space-x-1 bg-white text-teal-700 px-3 py-1.5 rounded-full text-xs font-medium border border-teal-200 shadow-sm">
                  <Plus size={12}/> <span>Pharmacy</span>
              </button>
              <button onClick={() => handleSend("First aid for cuts")} className="flex items-center space-x-1 bg-white text-teal-700 px-3 py-1.5 rounded-full text-xs font-medium border border-teal-200 shadow-sm">
                  <HeartPulse size={12}/> <span>First Aid</span>
              </button>
          </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-teal-600 text-white rounded-br-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                }`}>
                    <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
                    {msg.widget === 'doctor-list' && renderDoctorList()}
                </div>
            </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3 border border-slate-100 flex items-center space-x-2">
                    <HeartPulse size={16} className="text-teal-500 animate-pulse" />
                    <span className="text-xs text-slate-500">Consulting AI knowledge base...</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-center space-x-2 bg-slate-50 rounded-full px-4 py-2 border border-slate-200 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100 transition-all">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Describe your symptoms..."
                className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-800 placeholder-slate-400"
            />
            <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className={`p-2 rounded-full ${isLoading || !input.trim() ? 'bg-slate-300' : 'bg-teal-600'} text-white transition-colors`}
            >
                <Send size={16} />
            </button>
        </div>
        <p className="text-[9px] text-center text-slate-400 mt-2">
            AI can make mistakes. For emergencies, always call 108 or visit a hospital.
        </p>
      </div>
    </div>
  );
};