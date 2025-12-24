import { GoogleGenAI, Chat, Type, LiveServerMessage, Modality } from "@google/genai";
import { UserType, DayPlan, BookingSuggestion } from "../types";
import { MOCK_PACKAGES, MOCK_HOTELS, MOCK_FLIGHT_RESULTS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// We keep a simple in-memory store for the chat session for this demo
let chatSession: Chat | null = null;
let medicalSession: Chat | null = null;

export const initializeChat = (userType: UserType) => {
  const systemInstruction = `
    You are 'TravX Guide', an advanced AI travel assistant for the TravX Super-App.
    
    Your User Profile: ${userType === 'citizen' ? 'Indian Citizen (Local expert, looks for deals, spiritual, family)' : 'International Traveler (Needs cultural context, safety tips, hygiene advice, currency help)'}.

    Capabilities:
    1. Create detailed day-by-day itineraries based on specific dates.
    2. Provide safety advice based on location.
    3. Suggest transport (IRCTC for trains, RedBus for buses).
    4. Offer cultural etiquette tips.
    5. Translate local phrases if asked.
    
    Tone: Professional, Warm, Neutral, and Inclusive.
    Language: Default to English. Adapt to Indian languages (Hindi, Tamil, etc.) ONLY if the user speaks them.
  `;

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: { systemInstruction },
  });

  // Separate Medical Chat Session
  const medicalInstruction = `
    You are 'Bharat Swasthya', a medical assistance bot for travelers in India.
    Your goal is to provide immediate first-aid advice, suggest nearby hospitals (simulated), and guide users to emergency numbers (102, 108).
    
    Capabilities:
    1. Provide home remedies for common travel issues (Delhi Belly, Heatstroke, Altitude sickness).
    2. Guide to nearest doctor types based on symptoms.
    3. Emergency response: Always suggest calling 108 for critical cases.
    
    Tone: Calm, reassuring, professional.
    Disclaimer: Always state "I am an AI, not a doctor. Please consult a professional for serious issues."
  `;
  medicalSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: { systemInstruction: medicalInstruction },
  });
};

export const sendMessageToAI = async (message: string, context: 'general' | 'medical' = 'general'): Promise<{text: string, widget?: 'proposal' | 'doctor-list' | 'booking-suggestion', widgetData?: any}> => {
  if (!chatSession || !medicalSession) {
    throw new Error("Chat session not initialized");
  }

  try {
    const session = context === 'medical' ? medicalSession : chatSession;
    
    // Intent Detection for Booking (Mocked Logic)
    // In a real app, Gemini function calling would handle this more gracefully.
    const lowerMsg = message.toLowerCase();
    const isBookingIntent = lowerMsg.includes('go to') || lowerMsg.includes('travel to') || lowerMsg.includes('trip to') || lowerMsg.includes('book');
    
    if (context === 'general' && isBookingIntent) {
        // Extract destination (very naive extraction for prototype)
        let destination = "Jaipur"; // Default fallback
        if (lowerMsg.includes("goa")) destination = "Goa";
        else if (lowerMsg.includes("manali")) destination = "Manali";
        else if (lowerMsg.includes("kerala")) destination = "Kerala";
        else if (lowerMsg.includes("agra")) destination = "Agra";
        else if (lowerMsg.includes("delhi")) destination = "New Delhi";

        const suggestions: BookingSuggestion[] = [];
        
        // Add Flight
        suggestions.push({
            type: 'Flight',
            title: `Flight to ${destination}`,
            subtitle: 'Indigo 6E • Non-stop',
            price: 5400,
            rating: 4.5,
            data: MOCK_FLIGHT_RESULTS[0]
        });

        // Add Hotel
        suggestions.push({
            type: 'Hotel',
            title: `Luxury Stay in ${destination}`,
            subtitle: '5-Star • City Center',
            price: 8500,
            rating: 4.8,
            image: MOCK_HOTELS[0].image,
            data: MOCK_HOTELS[0]
        });

         // Add Package
        suggestions.push({
            type: 'Package',
            title: `Best of ${destination}`,
            subtitle: '3 Days • All Inclusive',
            price: 15000,
            rating: 4.7,
            data: MOCK_PACKAGES[0]
        });

        return {
            text: `I've found some excellent options for your trip to **${destination}**. You can book them directly below.`,
            widget: 'booking-suggestion',
            widgetData: suggestions
        };
    }

    const response = await session.sendMessage({ message });
    let text = response.text || "I apologize, I couldn't generate a response at this moment.";
    let widget: 'proposal' | 'doctor-list' | undefined = undefined;

    if (context === 'general') {
        if (lowerMsg.includes('confirm') || lowerMsg.includes('lock it')) {
            widget = 'proposal';
            text = "Great! I've prepared a booking proposal for you. You can review the details and proceed to payment below.";
        }
    } else if (context === 'medical') {
        if (lowerMsg.includes('doctor') || lowerMsg.includes('hospital') || lowerMsg.includes('clinic')) {
            widget = 'doctor-list';
        }
    }

    return { text, widget };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Network error. Please try again or use Offline Mode features." };
  }
};

export const generateBudgetEstimate = async (destination: string, days: number, userType: UserType): Promise<string> => {
    try {
        const model = 'gemini-2.5-flash';
        const prompt = `
            Estimate a travel budget for a ${days}-day trip to ${destination} for a ${userType}. 
            Provide a breakdown (Accommodation, Food, Transport, Misc) in JSON format.
            Example format:
            {
                "breakdown": [
                    {"category": "Accommodation", "amount": 5000},
                    {"category": "Food", "amount": 2000}
                ],
                "total": 7000,
                "currency": "INR",
                "tips": "Brief budget tip"
            }
        `;
        
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        
        return response.text || "{}";
    } catch (e) {
        console.error(e);
        return "{}";
    }
}

export const generateStructuredItinerary = async (destination: string, days: number, userType: UserType, startDate?: string): Promise<DayPlan[]> => {
    try {
        const dateContext = startDate ? ` starting from ${startDate}` : '';
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Create a ${days}-day itinerary for ${destination} for a ${userType}${dateContext}. 
            Ensure the itinerary days are titled with dates if provided (e.g. Day 1: 12th Oct).
            Focus on safe timings and popular spots.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            day: { type: Type.INTEGER },
                            title: { type: Type.STRING },
                            items: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        time: { type: Type.STRING },
                                        activity: { type: Type.STRING },
                                        type: { type: Type.STRING, enum: ['sightseeing', 'food', 'transport'] },
                                        notes: { type: Type.STRING }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        
        if (response.text) {
            return JSON.parse(response.text) as DayPlan[];
        }
        return [];
    } catch (e) {
        console.error("Itinerary Generation Error", e);
        return [];
    }
};

export const getSafetyAdvice = async (location: string, time: string): Promise<string> => {
    try {
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Give 3 very brief, bulleted safety tips for a tourist in ${location} at ${time}. Focus on tourist traps or areas to avoid.`
        });
        return response.text || "Stay alert and keep emergency numbers handy.";
    } catch (e) {
        return "Stay alert and keep emergency numbers handy.";
    }
}

export const translateText = async (text: string, targetLang: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Translate this to ${targetLang} (keep it simple for a traveler): "${text}"`
        });
        return response.text || "Translation failed.";
    } catch (e) {
        return "Translation failed.";
    }
}

export const describeImage = async (base64Data: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    inlineData: {
                        mimeType: 'image/jpeg',
                        data: base64Data
                    }
                },
                { text: "Describe what is in this image for a visually impaired traveler. Identify currency, read menus, or describe landmarks. Be concise." }
            ]
        });
        return response.text || "I couldn't analyze the image.";
    } catch (e) {
        console.error(e);
        return "Image analysis failed.";
    }
}

/**
 * LIVE API IMPLEMENTATION FOR VOICE BOT
 */

export class VoiceAssistant {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private inputProcessor: ScriptProcessorNode | null = null;
  private outputAudioContext: AudioContext | null = null;
  private outputNode: GainNode | null = null;
  private nextStartTime = 0;
  private sources = new Set<AudioBufferSourceNode>();
  private sessionPromise: Promise<any> | null = null;

  async connect(onStatusChange: (status: string) => void) {
    onStatusChange("Connecting...");
    
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    this.outputNode = this.outputAudioContext.createGain();
    this.outputNode.connect(this.outputAudioContext.destination);

    this.sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => {
          onStatusChange("Connected");
          this.startAudioInput();
        },
        onmessage: async (message: LiveServerMessage) => {
          const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (base64Audio && this.outputAudioContext && this.outputNode) {
             const audioBuffer = await this.decodeAudioData(
                this.decode(base64Audio), 
                this.outputAudioContext, 
                24000, 
                1
             );
             this.playAudio(audioBuffer);
          }
        },
        onclose: () => onStatusChange("Disconnected"),
        onerror: (e) => console.error(e),
      },
      config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction: "You are 'TravX Voice', a polyglot Indian travel assistant. You can understand and speak English, Hindi, Tamil, Telugu, Bengali, Kannada, Malayalam, Marathi, Gujarati, and Punjabi. Detect the user's language and respond in the same language. Be helpful, warm, and concise."
      }
    });
  }

  private startAudioInput() {
    if (!this.stream || !this.audioContext || !this.sessionPromise) return;

    const source = this.audioContext.createMediaStreamSource(this.stream);
    this.inputProcessor = this.audioContext.createScriptProcessor(4096, 1, 1);
    
    this.inputProcessor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      const pcmBlob = this.createBlob(inputData);
      this.sessionPromise?.then(session => {
         session.sendRealtimeInput({ media: pcmBlob });
      });
    };

    source.connect(this.inputProcessor);
    this.inputProcessor.connect(this.audioContext.destination);
  }

  private playAudio(buffer: AudioBuffer) {
      if (!this.outputAudioContext || !this.outputNode) return;
      
      this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
      const source = this.outputAudioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.outputNode);
      source.start(this.nextStartTime);
      this.nextStartTime += buffer.duration;
      
      source.onended = () => this.sources.delete(source);
      this.sources.add(source);
  }

  disconnect() {
    this.stream?.getTracks().forEach(t => t.stop());
    this.inputProcessor?.disconnect();
    this.audioContext?.close();
    this.outputAudioContext?.close();
    this.sessionPromise?.then(session => session.close());
    this.sources.forEach(s => s.stop());
  }

  // Helpers
  private createBlob(data: Float32Array) {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: this.encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  }

  private encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  private async decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) {
     const dataInt16 = new Int16Array(data.buffer);
     const frameCount = dataInt16.length / numChannels;
     const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

     for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
           channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
     }
     return buffer;
  }
}