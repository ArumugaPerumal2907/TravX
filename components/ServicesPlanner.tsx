import React, { useState, useEffect } from 'react';
import { Train, Bus, Calendar as CalIcon, MapPin, AlertTriangle, ArrowRight, Star, IndianRupee, Package, Map, Phone, Clock, Info, CheckCircle, X, User as UserIcon, Plane, Car, Mountain, Bed, Wifi, Coffee, Sparkles, Droplets, Truck, Container, Search, Users, ChevronLeft, ChevronRight, Calendar, Mic, Bike, Fuel, Gauge } from 'lucide-react';
import { UserType, TransportOption, TravelPackage, TimelineStep, TransportType, TripRecord, HotelOption, AppSettings, RentalVehicle } from '../types';
import { MOCK_PACKAGES, MOCK_AGENTS, MOCK_FLIGHT_RESULTS, MOCK_LOCAL_RESULTS, MOCK_HOTELS, MOCK_RENTALS } from '../constants';
import { ForeignerLogisticsLogin } from './ForeignerLogisticsLogin';
import { LogisticsLogin } from './LogisticsLogin';
import { PaymentGatewayModal } from './PaymentGatewayModal';
import { DigiLockerVerificationModal } from './DigiLockerVerificationModal';

interface ServicesPlannerProps {
  userType: UserType;
  addBooking?: (booking: TripRecord) => void;
  bookings?: TripRecord[];
  initialTab?: 'transport' | 'packages' | 'stays' | 'calendar';
  settings?: AppSettings;
}

export const ServicesPlanner: React.FC<ServicesPlannerProps> = ({ userType, addBooking, bookings = [], initialTab, settings }) => {
  const [activeTab, setActiveTab] = useState<'transport' | 'packages' | 'stays' | 'calendar'>('packages');
  const [bookingStep, setBookingStep] = useState<TimelineStep>('search');
  
  // Selection States
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<HotelOption | null>(null);
  const [assignedAgentId, setAssignedAgentId] = useState<string | null>(null);
  
  // Modals & Logins
  const [showAgentPopup, setShowAgentPopup] = useState(false);
  const [isForeignerVerified, setIsForeignerVerified] = useState(false);
  const [isLogisticsVerified, setIsLogisticsVerified] = useState(false);
  const [showLogisticsLogin, setShowLogisticsLogin] = useState(false);
  const [showDigiLockerModal, setShowDigiLockerModal] = useState(false);
  
  // Verification States
  const [isDLVerified, setIsDLVerified] = useState(false);
  
  // Payment Flow State
  const [pendingBooking, setPendingBooking] = useState<TripRecord | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Transport Search State
  const [transportType, setTransportType] = useState<TransportType | 'all' | 'logistics'>('train');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [results, setResults] = useState<TransportOption[] | null>(null);
  const [rentalResults, setRentalResults] = useState<RentalVehicle[] | null>(null);

  // Stays Search State
  const [stayLocation, setStayLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [stayResults, setStayResults] = useState<HotelOption[] | null>(null);

  // My Trip Calendar State
  const [calendarDate, setCalendarDate] = useState(new Date());

  const getCurrencySymbol = () => {
      if (settings?.currency === 'USD') return '$';
      if (settings?.currency === 'EUR') return '€';
      return '₹';
  };

  const convertPrice = (price: number) => {
      if (settings?.currency === 'USD') return Math.round(price / 84);
      if (settings?.currency === 'EUR') return Math.round(price / 90);
      return price;
  };

  useEffect(() => {
    if (initialTab) {
        setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTransportModeChange = (mode: string) => {
      setResults(null);
      setRentalResults(null);
      
      if (mode === 'logistics') {
          if (!isLogisticsVerified) {
              setShowLogisticsLogin(true);
          } else {
              setTransportType('logistics');
          }
      } else {
          setTransportType(mode as any);
      }
  };

  const handleVoiceInput = () => {
      alert("Listening... (Simulating Voice Input: 'Mumbai to Goa tomorrow')");
      setTimeout(() => {
          setFrom('Mumbai');
          setTo('Goa');
          const tmrw = new Date();
          tmrw.setDate(tmrw.getDate() + 1);
          setTravelDate(tmrw.toISOString().split('T')[0]);
      }, 1000);
  };

  const mockSearch = () => {
    if (transportType === 'flight') {
        setResults(MOCK_FLIGHT_RESULTS);
    } else if (['jeep', 'auto', 'trek'].includes(transportType)) {
        // Renamed Jeep/Taxi to Local Operators implies finding specific operators
        setResults(MOCK_LOCAL_RESULTS.map(res => ({
            ...res,
            availability: 'Available in 5 mins' // Locality Operator specific status
        })));
    } else if (transportType === 'rental') {
        setRentalResults(MOCK_RENTALS);
    } else if (transportType === 'logistics') {
        const logisticsMock: TransportOption[] = [
            { id: 'lg1', name: 'Tata Ace (Mini Truck)', type: 'jeep', departure: 'Available', arrival: 'On Demand', price: 800, availability: 'Available', duration: 'Per Trip' },
            { id: 'lg2', name: 'Eicher Pro (Heavy)', type: 'jeep', departure: 'Scheduled', arrival: 'Inter-city', price: 4500, availability: '2 Trucks', duration: 'Full Day' }
        ];
        setResults(logisticsMock);
    } else {
        const mockResults: TransportOption[] = [
            { id: '1', name: 'Vande Bharat Exp', type: 'train', departure: '06:00 AM', arrival: '10:00 AM', price: 1250, availability: 'Available' },
            { id: '2', name: 'Shatabdi Express', type: 'train', departure: '07:30 AM', arrival: '12:00 PM', price: 980, availability: 'WL 12' },
            { id: '3', name: 'Intercity Volvo', type: 'bus', departure: '09:00 AM', arrival: '02:00 PM', price: 750, availability: '12 Seats' },
        ];
        setResults(mockResults);
    }
  };

  const mockStaySearch = () => {
      // Simulate API filtering
      setStayResults(MOCK_HOTELS);
  };

  // Payment Integration Logic
  const initiatePayment = (booking: TripRecord) => {
      setPendingBooking(booking);
      setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
      if (pendingBooking && addBooking) {
          addBooking(pendingBooking);
          // Cleanup
          setShowPaymentModal(false);
          setPendingBooking(null);
          setSelectedHotel(null);
          setResults(null);
          setRentalResults(null);
          setShowAgentPopup(false);
          setBookingStep('search');
          setActiveTab('calendar'); // Redirect to My Trip
      }
  };

  const handleTransportBook = (option: TransportOption) => {
      const newBooking: TripRecord = {
          id: Date.now().toString(),
          destination: transportType === 'flight' || transportType === 'train' || transportType === 'bus' ? `${to || 'Destination'} via ${option.name}` : option.name,
          date: travelDate || new Date().toISOString().split('T')[0],
          status: 'Upcoming',
          totalCost: option.price,
          type: transportType === 'flight' ? 'Flight' : 'Transport',
          bookingRef: `${transportType.toUpperCase().slice(0,3)}-${Math.floor(Math.random() * 10000)}`
      };
      initiatePayment(newBooking);
  };

  const handleRentalBook = (vehicle: RentalVehicle) => {
      if (!isDLVerified) {
          setShowDigiLockerModal(true);
          return;
      }

      const newBooking: TripRecord = {
          id: Date.now().toString(),
          destination: `Rental: ${vehicle.name}`,
          date: travelDate || new Date().toISOString().split('T')[0],
          status: 'Upcoming',
          totalCost: vehicle.pricePerDay, // Assuming 1 day for demo
          type: 'Rental',
          bookingRef: `RNT-${Math.floor(Math.random() * 10000)}`
      };
      initiatePayment(newBooking);
  };

  const handleDLVerified = () => {
      setIsDLVerified(true);
      setShowDigiLockerModal(false);
      // Can't auto-continue because we need the specific vehicle, user has to click book again.
      // Alternatively, we could store pending vehicle but for simplicity asking to click again is fine or:
      // alert("Verification Successful! You can now book the vehicle.");
  };

  const handleStayBook = (hotel: HotelOption) => {
      const newBooking: TripRecord = {
          id: Date.now().toString(),
          destination: hotel.name,
          date: checkIn || new Date().toISOString().split('T')[0],
          status: 'Upcoming',
          totalCost: hotel.price,
          type: 'Stay',
          bookingRef: `HTL-${Math.floor(Math.random() * 10000)}`
      };
      initiatePayment(newBooking);
  };

  const handleBookPackage = (pkg: TravelPackage) => {
      setSelectedPackage(pkg);
      setBookingStep('review');
  };

  const confirmBooking = () => {
      // Package booking requires Agent popup first, then payment
      setBookingStep('book');
      setTimeout(() => {
          const agentId = selectedPackage?.agentId || 'a1';
          setAssignedAgentId(agentId);
          setBookingStep('agent');
          setShowAgentPopup(true);
      }, 1500);
  };

  const finalizePackagePayment = () => {
      if (selectedPackage) {
          const newBooking: TripRecord = {
            id: Date.now().toString(),
            destination: selectedPackage.title,
            date: new Date().toISOString().split('T')[0],
            status: 'Upcoming',
            totalCost: selectedPackage.price,
            type: 'Package',
            bookingRef: `PKG-${Math.floor(Math.random() * 10000)}`
        };
        initiatePayment(newBooking);
      }
  };

  const renderTimeline = () => {
      const steps: {id: TimelineStep, label: string}[] = [
          {id: 'search', label: 'Explore'},
          {id: 'review', label: 'Review'},
          {id: 'book', label: 'Book'},
          {id: 'agent', label: 'Agent'},
      ];

      const currentIndex = steps.findIndex(s => s.id === bookingStep);

      return (
          <div className="bg-white/80 backdrop-blur border-b border-slate-100 p-4 sticky top-0 z-20">
              <div className="flex justify-between items-center relative max-w-xs mx-auto">
                  {steps.map((step, idx) => (
                      <div key={step.id} className="flex flex-col items-center z-10 w-1/4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 shadow-md ${idx <= currentIndex ? 'bg-violet-600 text-white scale-110' : 'bg-slate-100 text-slate-400'}`}>
                              {idx < currentIndex ? <CheckCircle size={14}/> : idx + 1}
                          </div>
                          <span className={`text-[9px] mt-2 font-bold uppercase tracking-wide ${idx <= currentIndex ? 'text-violet-600' : 'text-slate-400'}`}>{step.label}</span>
                      </div>
                  ))}
                  <div className="absolute top-4 left-0 w-full h-0.5 bg-slate-100 -z-0">
                      <div className="h-full bg-violet-600 transition-all duration-500" style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}></div>
                  </div>
              </div>
          </div>
      );
  };

  const renderHotelDetails = () => {
    if (!selectedHotel) return null;
    return (
        <div className="p-5 space-y-6 animate-fade-in-up pb-24">
            <button onClick={() => setSelectedHotel(null)} className="text-xs text-slate-500 flex items-center mb-2 hover:text-slate-800 font-bold group">
                  <ArrowRight className="rotate-180 mr-1 transition-transform group-hover:-translate-x-1" size={14}/> Back to Results
            </button>
            
            <div className="relative rounded-[32px] overflow-hidden shadow-2xl h-72 bg-slate-200">
                  <img src={selectedHotel.image} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
                      <div className="w-full">
                          <h2 className="text-3xl font-bold text-white leading-tight">{selectedHotel.name}</h2>
                          <p className="text-white/90 text-sm flex items-center mt-2 font-medium"><MapPin size={16} className="mr-2 text-violet-400"/> {selectedHotel.location}</p>
                      </div>
                  </div>
            </div>

            <div className="flex justify-between items-center bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wide">Price per night</span>
                    <div className="text-3xl font-black text-slate-800 mt-1">{getCurrencySymbol()}{convertPrice(selectedHotel.price)}</div>
                </div>
                <div className="text-right">
                    <div className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-xl font-bold flex items-center shadow-sm">
                        <Star size={16} className="fill-amber-600 mr-1.5"/> {selectedHotel.rating}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1.5 block font-medium">1.2k reviews</span>
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-5 text-sm uppercase tracking-wide">Amenities</h3>
                <div className="grid grid-cols-4 gap-4">
                    {selectedHotel.amenities.map(am => (
                        <div key={am} className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-violet-50 transition-colors">
                            {am === 'WiFi' ? <Wifi size={24} className="text-violet-500 mb-2"/> :
                             am === 'Pool' ? <Droplets size={24} className="text-blue-400 mb-2"/> :
                             am === 'Spa' ? <Sparkles size={24} className="text-pink-500 mb-2"/> :
                             <Coffee size={24} className="text-amber-500 mb-2"/>}
                            <span className="text-[10px] font-bold text-slate-600">{am}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-4 rounded-t-3xl border-t border-slate-100 sticky bottom-0 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-10">
                 <button 
                    onClick={() => handleStayBook(selectedHotel)}
                    className="w-full bg-violet-600 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-violet-700 active:scale-95 transition-all flex justify-center items-center text-sm"
                 >
                     Book Room <ArrowRight size={18} className="ml-2"/>
                 </button>
            </div>
        </div>
    )
  }

  const renderPackageDetails = () => {
      if (!selectedPackage) return null;
      
      return (
          <div className="p-5 space-y-6 animate-fade-in-up pb-24">
              <button onClick={() => { setSelectedPackage(null); setBookingStep('search'); setAssignedAgentId(null); }} className="text-xs text-slate-500 flex items-center mb-2 hover:text-slate-800 font-bold group">
                  <ArrowRight className="rotate-180 mr-1 transition-transform group-hover:-translate-x-1" size={14}/> Back to Packages
              </button>
              
              <div className="relative rounded-[32px] overflow-hidden shadow-2xl h-64 bg-slate-200">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                      <div>
                          <h2 className="text-3xl font-bold text-white leading-tight">{selectedPackage.title}</h2>
                          <div className="flex items-center text-white/90 text-sm mt-3 space-x-3">
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full font-semibold border border-white/10">{selectedPackage.duration}</span>
                            <span className="flex items-center font-bold text-amber-300"><Star size={14} className="mr-1 fill-amber-300"/> {selectedPackage.rating}</span>
                          </div>
                      </div>
                  </div>
              </div>

              {selectedPackage.riskLevel === 'High' && (
                  <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex gap-4 shadow-sm">
                      <div className="bg-rose-100 p-2.5 rounded-full h-fit text-rose-600">
                        <AlertTriangle size={20} />
                      </div>
                      <div>
                          <h3 className="font-bold text-rose-800 text-sm">Travel Caution</h3>
                          <p className="text-xs text-rose-700 mt-1 leading-relaxed font-medium">{selectedPackage.riskAlert || "High risk area due to weather conditions. Check official advisory."}</p>
                      </div>
                  </div>
              )}

              <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-6">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center text-sm uppercase tracking-wide">
                      <Map size={18} className="mr-2 text-violet-600"/> Itinerary Map
                  </h3>
                  <div className="bg-slate-100 rounded-2xl h-48 relative flex items-center justify-center border border-slate-200 overflow-hidden group">
                      <div className="absolute inset-0 opacity-40 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Google_Maps_Logo_2020.svg/2275px-Google_Maps_Logo_2020.svg.png')] bg-center bg-cover transition-transform duration-1000 group-hover:scale-105"></div>
                      <span className="bg-white/90 px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 z-10 shadow-lg backdrop-blur border border-white/50">GPS Preview</span>
                      {selectedPackage.spots.map((spot, i) => (
                          <div key={i} className="absolute flex flex-col items-center group/pin" style={{ top: `${30 + i * 20}%`, left: `${20 + i * 30}%` }}>
                              <MapPin size={28} className="text-rose-500 drop-shadow-xl fill-rose-100 animate-bounce group-hover/pin:scale-110 transition-transform" style={{animationDelay: `${i * 0.2}s`}} />
                              <span className="bg-white px-2 py-0.5 text-[10px] font-bold rounded shadow-sm text-slate-800 whitespace-nowrap mt-1 opacity-0 group-hover/pin:opacity-100 transition-opacity absolute top-8">{spot.name}</span>
                          </div>
                      ))}
                  </div>
                  <div className="mt-5 space-y-3">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Spot Timings</h4>
                      {selectedPackage.spots.map((spot, i) => (
                          <div key={i} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                              <span className="text-slate-700 font-bold">{spot.name}</span>
                              <span className="text-emerald-600 font-bold text-[10px] flex items-center bg-emerald-50 px-2.5 py-1 rounded-full"><Clock size={12} className="mr-1"/> {spot.timing}</span>
                          </div>
                      ))}
                  </div>
              </div>

              {assignedAgentId ? (
                   <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-[32px] p-6 shadow-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><UserIcon size={100}/></div>
                        <div className="flex justify-between items-start mb-5 relative z-10">
                             <h3 className="font-bold text-emerald-900">Your Assigned Guide</h3>
                             <span className="bg-white text-emerald-700 text-[10px] px-2.5 py-1 rounded-full font-bold shadow-sm flex items-center"><CheckCircle size={12} className="mr-1"/>Verified</span>
                        </div>
                        <div className="flex items-center space-x-4 relative z-10">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm font-bold text-xl border-2 border-emerald-100">
                                {MOCK_AGENTS[assignedAgentId].name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">{MOCK_AGENTS[assignedAgentId].name}</h4>
                                <div className="flex items-center text-xs text-slate-500 mt-1 space-x-2">
                                    <span className="flex items-center text-amber-500"><Star size={10} className="fill-current mr-0.5"/> {MOCK_AGENTS[assignedAgentId].rating}</span>
                                    <span>•</span>
                                    <span>{MOCK_AGENTS[assignedAgentId].languages.join(', ')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex space-x-3 relative z-10">
                            <button className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center shadow-lg active:scale-95 transition-all">
                                <Phone size={14} className="mr-2"/> Call Guide
                            </button>
                            <button 
                                onClick={finalizePackagePayment}
                                className="flex-1 bg-white text-slate-900 py-3 rounded-xl font-bold text-xs flex items-center justify-center shadow-sm border border-slate-200 active:scale-95 transition-all"
                            >
                                Pay Now
                            </button>
                        </div>
                   </div>
              ) : (
                  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-[0_-5px_30px_rgba(0,0,0,0.05)] sticky bottom-4 z-10">
                      <div className="flex justify-between items-center mb-5">
                          <span className="text-slate-500 text-sm font-semibold">Total Price</span>
                          <span className="text-3xl font-black text-slate-800">{getCurrencySymbol()}{convertPrice(selectedPackage.price).toLocaleString()}</span>
                      </div>
                      <button onClick={confirmBooking} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95 flex items-center justify-center">
                          Confirm Booking <ArrowRight size={18} className="ml-2" />
                      </button>
                  </div>
              )}
          </div>
      );
  };

  const renderMyTripCalendar = () => {
      // Basic Calendar Logic
      const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      const firstDayOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay();
      
      const prevMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
      const nextMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));

      return (
          <div className="p-5 space-y-6 pb-24 animate-fade-in">
              <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-6 bg-violet-600 text-white flex justify-between items-center">
                      <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ChevronLeft size={20}/></button>
                      <h2 className="font-bold text-lg">{calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                      <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ChevronRight size={20}/></button>
                  </div>
                  <div className="p-4">
                      <div className="grid grid-cols-7 text-center mb-4">
                          {['S','M','T','W','T','F','S'].map(d => <span key={d} className="text-xs font-bold text-slate-400">{d}</span>)}
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                          {Array(firstDayOfMonth).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
                          {Array(getDaysInMonth(calendarDate)).fill(null).map((_, i) => {
                              const day = i + 1;
                              const dateStr = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                              const hasBooking = bookings?.some(b => b.date.startsWith(dateStr));
                              
                              return (
                                  <div key={day} className="flex flex-col items-center justify-center h-10 rounded-xl hover:bg-slate-50 transition-colors relative cursor-pointer group">
                                      <span className={`text-sm font-bold ${hasBooking ? 'text-violet-600' : 'text-slate-600'}`}>{day}</span>
                                      {hasBooking && <div className="w-1.5 h-1.5 bg-violet-600 rounded-full mt-1 group-hover:scale-125 transition-transform"></div>}
                                  </div>
                              )
                          })}
                      </div>
                  </div>
              </div>

              <div>
                  <h3 className="font-bold text-slate-800 text-lg mb-4">Upcoming Trips</h3>
                  {bookings && bookings.filter(b => b.status === 'Upcoming').length > 0 ? (
                      <div className="space-y-4">
                          {bookings.filter(b => b.status === 'Upcoming').map(b => (
                              <div key={b.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
                                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${
                                      b.type === 'Flight' ? 'bg-blue-500' :
                                      b.type === 'Stay' ? 'bg-purple-500' :
                                      b.type === 'Package' ? 'bg-pink-500' : 
                                      b.type === 'Rental' ? 'bg-cyan-500' : 'bg-orange-500'
                                  }`}>
                                      {b.type === 'Flight' ? <Plane size={24}/> :
                                       b.type === 'Stay' ? <Bed size={24}/> :
                                       b.type === 'Package' ? <Package size={24}/> : 
                                       b.type === 'Rental' ? <Bike size={24}/> : <Train size={24}/>}
                                  </div>
                                  <div className="flex-1">
                                      <h4 className="font-bold text-slate-800 text-sm leading-tight">{b.destination}</h4>
                                      <p className="text-xs text-slate-400 font-medium mt-1">{b.date}</p>
                                  </div>
                                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-bold uppercase">{b.status}</span>
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="text-center py-10 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
                          <p className="text-slate-400 text-sm font-bold">No upcoming trips planned.</p>
                          <button onClick={() => setActiveTab('packages')} className="mt-2 text-violet-600 text-xs font-bold hover:underline">Explore Packages</button>
                      </div>
                  )}
              </div>
          </div>
      );
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {(activeTab === 'packages' && bookingStep !== 'search') && renderTimeline()}

      {/* Tabs / Header - visible only on main Search screens */}
      {(bookingStep === 'search' && !selectedHotel && !showLogisticsLogin && !showDigiLockerModal) && (
        <div className="bg-white px-4 pt-4 pb-2 sticky top-0 z-10">
            <div className="flex p-1 bg-slate-100 rounded-xl overflow-hidden shadow-inner">
                {[
                    {id: 'packages', label: 'Packages'},
                    {id: 'transport', label: 'Transport'},
                    {id: 'stays', label: 'Stays'},
                    {id: 'calendar', label: 'My Trip'}
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-300 ${
                            activeTab === tab.id 
                            ? 'bg-white text-violet-600 shadow-sm' 
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {/* Packages Tab */}
        {activeTab === 'packages' && (
            bookingStep === 'search' ? (
                <div className="p-5 space-y-6 animate-fade-in pb-24">
                    <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-[32px] p-8 text-white shadow-xl shadow-violet-500/20 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h2 className="font-black text-2xl mb-1">Curated for You</h2>
                            <p className="text-sm text-violet-100 mb-6 font-medium opacity-90">Personalized picks based on your profile</p>
                            <button className="bg-white/20 hover:bg-white/30 px-5 py-2.5 rounded-xl text-xs font-bold backdrop-blur-md transition-all active:scale-95 border border-white/20">
                                View Preferences
                            </button>
                        </div>
                        <div className="absolute -right-6 -bottom-6 opacity-20 transform rotate-12 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6">
                            <Package size={140} />
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-slate-800 text-lg mb-4 px-1">Recommended Packages</h3>
                        <div className="space-y-5">
                        {MOCK_PACKAGES.map(pkg => (
                            <div key={pkg.id} onClick={() => handleBookPackage(pkg)} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer group active:scale-[0.98] transition-all hover:shadow-xl hover:shadow-slate-200/50">
                                <div className="h-44 bg-slate-200 relative overflow-hidden">
                                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                                     <div className="absolute bottom-4 left-4 z-20">
                                         <h4 className="font-bold text-white text-xl shadow-sm leading-tight mb-1">{pkg.title}</h4>
                                         <span className="bg-white/20 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold px-2.5 py-1 rounded-lg">{pkg.duration}</span>
                                     </div>
                                </div>
                                <div className="p-5">
                                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed font-medium">{pkg.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-black text-slate-800">{getCurrencySymbol()}{convertPrice(pkg.price)}</span>
                                        <div className="flex items-center text-xs font-bold text-violet-600 group-hover:underline">
                                            View Details <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            ) : renderPackageDetails()
        )}

        {/* Transport Tab */}
        {activeTab === 'transport' && (
            (userType === 'foreigner' && !isForeignerVerified) ? (
                <ForeignerLogisticsLogin onVerified={() => setIsForeignerVerified(true)} />
            ) : showLogisticsLogin ? (
                <LogisticsLogin 
                    onVerified={() => { setIsLogisticsVerified(true); setShowLogisticsLogin(false); setTransportType('logistics'); }} 
                    onCancel={() => { setShowLogisticsLogin(false); setTransportType('train'); }}
                />
            ) : (
                <div className="p-5 space-y-6 pb-24 animate-fade-in">
                    {/* Mode Selector */}
                    <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2">
                        {[
                            {id: 'flight', icon: Plane, label: 'Flights'},
                            {id: 'train', icon: Train, label: 'Trains'},
                            {id: 'bus', icon: Bus, label: 'Buses'},
                            {id: 'jeep', icon: Car, label: 'Local Cabs'},
                            {id: 'rental', icon: Bike, label: 'Rentals'}, // Added
                            {id: 'trek', icon: Mountain, label: 'Trekking'},
                            {id: 'logistics', icon: Truck, label: 'Logistics'},
                        ].map(mode => (
                            <button
                                key={mode.id}
                                onClick={() => handleTransportModeChange(mode.id)}
                                className={`flex flex-col items-center justify-center p-3 rounded-2xl min-w-[80px] transition-all border ${
                                    transportType === mode.id 
                                    ? 'bg-violet-600 text-white border-violet-600 shadow-lg scale-105' 
                                    : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
                                }`}
                            >
                                <mode.icon size={20} strokeWidth={2} className="mb-2"/> 
                                <span className="text-[10px] font-bold">{mode.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Search Box */}
                    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                        <h2 className="font-bold text-slate-800 mb-6 text-lg">
                           {transportType === 'rental' ? 'Rent a Vehicle' : ['jeep', 'auto'].includes(transportType) ? 'Locality Operators' : transportType === 'trek' ? 'Adventure Search' : 'Ticket Search'}
                        </h2>
                        
                        <div className="space-y-4">
                             <div className="bg-slate-50 p-1.5 rounded-2xl border border-slate-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-100 focus-within:border-violet-200 transition-all flex items-center">
                                 <div className="p-3 text-slate-400"><MapPin size={18}/></div>
                                 <input 
                                    value={from}
                                    onChange={e => setFrom(e.target.value)}
                                    placeholder={transportType === 'rental' ? "Pick-up City" : ['jeep', 'auto'].includes(transportType) ? "Pickup Location" : "From"}
                                    className="bg-transparent w-full text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 placeholder:font-medium"
                                 />
                                 <button onClick={handleVoiceInput} className="p-2 text-violet-600 hover:bg-violet-50 rounded-full transition-colors">
                                     <Mic size={18} />
                                 </button>
                             </div>
                             
                             {transportType !== 'rental' && (
                                <div className="bg-slate-50 p-1.5 rounded-2xl border border-slate-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-100 focus-within:border-violet-200 transition-all flex items-center">
                                    <div className="p-3 text-slate-400"><MapPin size={18}/></div>
                                    <input 
                                        value={to}
                                        onChange={e => setTo(e.target.value)}
                                        placeholder={['jeep', 'auto'].includes(transportType) ? "Drop Location (Optional)" : "To"}
                                        className="bg-transparent w-full text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 placeholder:font-medium"
                                    />
                                </div>
                             )}

                             {/* Added Date Picker */}
                             <div className="bg-slate-50 p-1.5 rounded-2xl border border-slate-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-100 focus-within:border-violet-200 transition-all flex items-center">
                                 <div className="p-3 text-slate-400"><Calendar size={18}/></div>
                                 <input 
                                    type="date"
                                    value={travelDate}
                                    onChange={e => setTravelDate(e.target.value)}
                                    className="bg-transparent w-full text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 placeholder:font-medium"
                                 />
                             </div>

                             <button 
                                onClick={mockSearch}
                                className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all mt-2"
                             >
                                {transportType === 'rental' ? 'Find Vehicles' : ['jeep', 'auto'].includes(transportType) ? 'Check Availability' : 'Search Options'}
                            </button>
                        </div>
                    </div>

                    {results && (
                        <div className="space-y-4 pb-20 animate-slide-up">
                            {['jeep', 'auto'].includes(transportType) && (
                                <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-xl">
                                    <CheckCircle size={16}/>
                                    <span className="text-xs font-bold">3 Local Operators found nearby</span>
                                </div>
                            )}

                            {results.map(r => (
                                <div key={r.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center group cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-slate-100 p-3 rounded-2xl text-slate-600 group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors">
                                            {r.type === 'flight' ? <Plane size={24}/> : 
                                             ['jeep', 'auto'].includes(transportType) ? <Car size={24}/> : <Train size={24}/>}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-base">{r.name}</h4>
                                            <div className="text-xs text-slate-500 mt-1 font-medium">
                                                {r.departure} 
                                                {r.availability && <span className="text-green-600 ml-1">• {r.availability}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleTransportBook(r)} 
                                        className="bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md active:scale-95 transition-all"
                                    >
                                        {['jeep', 'auto'].includes(transportType) ? 'Book Cab' : 'Book'} <br/>
                                        <span className="text-[10px] font-normal">{getCurrencySymbol()}{convertPrice(r.price)}</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {rentalResults && (
                        <div className="space-y-5 pb-20 animate-slide-up">
                            {rentalResults.map(vehicle => (
                                <div key={vehicle.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden group cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1">
                                    <div className="h-40 bg-slate-200 relative">
                                        <img src={vehicle.image} className="w-full h-full object-cover" />
                                        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-white shadow-sm">
                                            {vehicle.type}
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-slate-800 text-lg leading-tight">{vehicle.name}</h3>
                                            <div className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md font-bold text-xs flex items-center">
                                                <Star size={10} className="fill-current mr-1"/> {vehicle.rating}
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-3 text-xs text-slate-500 font-medium mb-4">
                                            <span className="flex items-center"><Fuel size={12} className="mr-1"/> {vehicle.fuel}</span>
                                            <span className="flex items-center"><Gauge size={12} className="mr-1"/> {vehicle.transmission}</span>
                                            <span className="flex items-center"><UserIcon size={12} className="mr-1"/> {vehicle.provider}</span>
                                        </div>

                                        <div className="flex justify-between items-center border-t border-slate-50 pt-3">
                                            <div>
                                                <span className="text-xl font-black text-slate-800">{getCurrencySymbol()}{convertPrice(vehicle.pricePerDay)}</span>
                                                <span className="text-xs text-slate-400 font-bold"> / Day</span>
                                            </div>
                                            <button 
                                                onClick={() => handleRentalBook(vehicle)}
                                                className="bg-cyan-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-cyan-700 transition-colors shadow-md active:scale-95"
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )
        )}

        {/* Stays Tab */}
        {activeTab === 'stays' && (
            !selectedHotel ? (
                <div className="p-5 space-y-6 pb-24 animate-fade-in">
                    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                        <h2 className="font-bold text-slate-800 mb-6 text-lg flex items-center"><Bed className="mr-2 text-violet-600"/> Find Stays</h2>
                        <div className="space-y-4">
                             <div className="bg-slate-50 p-1.5 rounded-2xl border border-slate-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-100 focus-within:border-violet-200 transition-all flex items-center">
                                 <div className="p-3 text-slate-400"><Search size={18}/></div>
                                 <input 
                                    value={stayLocation}
                                    onChange={e => setStayLocation(e.target.value)}
                                    placeholder="Where do you want to stay?"
                                    className="bg-transparent w-full text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 placeholder:font-medium"
                                 />
                             </div>
                             <div className="flex space-x-3">
                                 <div className="flex-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-100 transition-all">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-3">Check-in</label>
                                    <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="w-full bg-transparent px-3 pb-1 text-sm font-bold text-slate-800 outline-none"/>
                                 </div>
                                 <div className="flex-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-100 transition-all">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-3">Check-out</label>
                                    <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="w-full bg-transparent px-3 pb-1 text-sm font-bold text-slate-800 outline-none"/>
                                 </div>
                             </div>
                             <div className="bg-slate-50 p-1.5 rounded-2xl border border-slate-100 flex items-center justify-between px-4">
                                 <div className="flex items-center space-x-2">
                                     <Users size={18} className="text-slate-400"/>
                                     <span className="text-sm font-bold text-slate-700">Guests</span>
                                 </div>
                                 <div className="flex items-center space-x-3">
                                     <button onClick={() => setGuests(Math.max(1, guests-1))} className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow text-slate-600 hover:bg-slate-100">-</button>
                                     <span className="font-bold text-slate-800">{guests}</span>
                                     <button onClick={() => setGuests(guests+1)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow text-slate-600 hover:bg-slate-100">+</button>
                                 </div>
                             </div>

                             <button onClick={mockStaySearch} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all mt-2">
                                Search Hotels
                            </button>
                        </div>
                    </div>

                    {stayResults && (
                        <div className="space-y-5 animate-slide-up">
                            {stayResults.map(hotel => (
                                <div key={hotel.id} onClick={() => setSelectedHotel(hotel)} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer group hover:shadow-xl transition-all hover:-translate-y-1">
                                    <div className="h-40 bg-slate-200 relative">
                                        <img src={hotel.image} className="w-full h-full object-cover" />
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold flex items-center shadow-sm">
                                            <Star size={12} className="fill-amber-400 text-amber-400 mr-1"/> {hotel.rating}
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">{hotel.name}</h3>
                                        <p className="text-xs text-slate-500 font-medium mb-3 flex items-center"><MapPin size={12} className="mr-1"/> {hotel.location}</p>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <span className="text-xl font-black text-slate-800">{getCurrencySymbol()}{convertPrice(hotel.price)}</span>
                                                <span className="text-xs text-slate-400 ml-1">/ night</span>
                                            </div>
                                            <button className="bg-violet-50 text-violet-600 px-4 py-2 rounded-xl text-xs font-bold group-hover:bg-violet-600 group-hover:text-white transition-colors">
                                                View Deal
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : renderHotelDetails()
        )}

        {/* My Trip (Calendar) Tab */}
        {activeTab === 'calendar' && renderMyTripCalendar()}
      </div>

      {/* Payment Gateway Modal */}
      {showPaymentModal && pendingBooking && (
          <PaymentGatewayModal 
            amount={pendingBooking.totalCost}
            itemName={pendingBooking.destination}
            onSuccess={handlePaymentSuccess}
            onClose={() => setShowPaymentModal(false)}
          />
      )}

      {/* DigiLocker Verification Modal */}
      {showDigiLockerModal && (
          <DigiLockerVerificationModal 
            onSuccess={handleDLVerified}
            onClose={() => setShowDigiLockerModal(false)}
          />
      )}
    </div>
  );
};