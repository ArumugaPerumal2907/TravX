import { EmergencyContact, ServiceItem, CommunityPost, TravelPackage, Agent, Doctor, TripRecord, TravelGroup, TransportOption, HotelOption, NewsItem, StateInfographic, AppNotification, RentalVehicle } from './types';
import { Train, Bus, Map, CloudSun, ShieldAlert, Languages, Navigation, FileText, Plane, Mountain, Car, Bike, RefreshCw, Hotel } from 'lucide-react';

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { name: 'Police Control Room', number: '100', category: 'Police' },
  { name: 'Ambulance', number: '108', category: 'Medical' },
  { name: 'Women Helpline', number: '1091', category: 'Police' },
  { name: 'Tourist Helpline', number: '1363', category: 'Transport' },
];

export const FOREIGN_EMBASSIES: EmergencyContact[] = [
  { name: 'US Embassy (Delhi)', number: '+91-11-2419-8000', category: 'Embassy' },
  { name: 'UK High Commission', number: '+91-11-2419-2100', category: 'Embassy' },
  { name: 'German Embassy', number: '+91-11-4419-9199', category: 'Embassy' },
];

export const APP_SERVICES: ServiceItem[] = [
  { id: 'irctc', name: 'Trains (IRCTC)', icon: Train, description: 'Book train tickets', status: 'active' },
  { id: 'bus', name: 'State Bus', icon: Bus, description: 'Inter-state bus services', status: 'active' },
  { id: 'nav', name: 'Navigation', icon: Navigation, description: 'Live Maps', status: 'active' },
  { id: 'weather', name: 'Weather', icon: CloudSun, description: 'Forecast & Alerts', status: 'active' },
  { id: 'safety', name: 'Safety Shield', icon: ShieldAlert, description: 'SOS & Location', status: 'offline_ready' },
  { id: 'organizer', name: 'Organizer', icon: FileText, description: 'Track Expenses', status: 'active' },
  { id: 'translator', name: 'Translator', icon: Languages, description: 'Language Help', status: 'active' },
  { id: 'exchange', name: 'Currency', icon: RefreshCw, description: 'Exchange Rates', status: 'active' },
];

export const MOCK_EXPENSES = [
  { id: 'e1', category: 'Stay', amount: 12000, currency: 'INR' as const, date: '2023-10-12', note: 'Hotel Taj' },
  { id: 'e2', category: 'Transport', amount: 2500, currency: 'INR' as const, date: '2023-10-12', note: 'Train Ticket' },
  { id: 'e3', category: 'Food', amount: 800, currency: 'INR' as const, date: '2023-10-13', note: 'Local Food' },
  { id: 'e4', category: 'Entry', amount: 1500, currency: 'INR' as const, date: '2023-10-14', note: 'Entry Fees' },
];

export const MOCK_POSTS: CommunityPost[] = [
    {
        id: '1',
        author: 'Riya S.',
        avatar: 'RS',
        content: 'Had an amazing time in Varanasi! The evening Aarti is a must-watch. Just be careful of the monkeys near the ghats.',
        likes: 124,
        replies: 12,
        tag: 'Review',
        location: 'Varanasi',
        coords: { x: 65, y: 40 }
    },
    {
        id: '2',
        author: 'John Doe',
        avatar: 'JD',
        content: 'Is it safe to travel to Manali right now considering the rain forecast?',
        likes: 45,
        replies: 8,
        tag: 'Question',
        location: 'Manali',
        coords: { x: 30, y: 15 }
    },
    {
        id: '3',
        author: 'TravelBug',
        avatar: 'TB',
        content: 'Found a great hidden cafe in Pondicherry called "Le Cafe". Best coffee!',
        likes: 89,
        replies: 5,
        tag: 'Tip',
        location: 'Pondicherry',
        coords: { x: 45, y: 85 }
    },
    {
        id: '4',
        author: 'Amit V.',
        avatar: 'AV',
        content: 'Mumbai traffic is crazy today near Marine Drive. Avoid if possible!',
        likes: 210,
        replies: 45,
        tag: 'Tip',
        location: 'Mumbai',
        coords: { x: 25, y: 60 }
    }
];

export const MOCK_GROUPS: TravelGroup[] = [
    { id: 'g1', name: 'Himalayan Trekkers', destination: 'Manali', date: '25 Oct 2023', members: 12, maxMembers: 15, avatar: '🏔️', description: 'Join us for a 5-day trek to Hampta Pass. Beginners welcome!' },
    { id: 'g2', name: 'Goa Chill Squad', destination: 'North Goa', date: '10 Nov 2023', members: 4, maxMembers: 8, avatar: '🏖️', description: 'Looking for 4 more people to share a villa and explore cafes.' },
    { id: 'g3', name: 'Temple Run South', destination: 'Madurai & Rameswaram', date: '05 Dec 2023', members: 18, maxMembers: 20, avatar: '🛕', description: 'Spiritual journey through the great temples of Tamil Nadu.' },
];

export const MOCK_AGENTS: Record<string, Agent> = {
    'a1': { id: 'a1', name: 'Rajesh Kumar', phone: '+91-98765-43210', languages: ['Hindi', 'English'], rating: 4.8, ratingCount: 124 },
    'a2': { id: 'a2', name: 'Priya Singh', phone: '+91-99887-76655', languages: ['English', 'French', 'Spanish'], rating: 4.9, ratingCount: 89 },
};

export const MOCK_PACKAGES: TravelPackage[] = [
    {
        id: 'p1',
        title: 'Spiritual Varanasi & Kashi',
        description: 'Experience the divine Ganga Aarti and ancient temples.',
        price: 15000,
        duration: '3 Days',
        rating: 4.7,
        riskLevel: 'Low',
        spots: [
            { name: 'Kashi Vishwanath', timing: '04:00 AM - 11:00 PM', lat: 25.31, lng: 83.01 },
            { name: 'Dashashwamedh Ghat', timing: 'Open 24 Hrs', lat: 25.30, lng: 83.01 }
        ],
        agentId: 'a1'
    },
    {
        id: 'p2',
        title: 'Himalayan Adventure Manali',
        description: 'Trekking, paragliding and snow points.',
        price: 22000,
        duration: '5 Days',
        rating: 4.5,
        riskLevel: 'High',
        riskAlert: 'Heavy Rainfall Warning: Landslide risk in upper valley.',
        spots: [
            { name: 'Solang Valley', timing: '09:00 AM - 06:00 PM', lat: 32.24, lng: 77.18 },
            { name: 'Rohtang Pass', timing: 'Closed on Tuesdays', lat: 32.37, lng: 77.24 }
        ],
        agentId: 'a2'
    },
     {
        id: 'p3',
        title: 'Golden Triangle (Delhi-Agra-Jaipur)',
        description: 'The perfect introduction to India for first-timers.',
        price: 35000,
        duration: '6 Days',
        rating: 4.9,
        riskLevel: 'Low',
        spots: [
            { name: 'Taj Mahal', timing: '06:00 AM - 06:30 PM (Closed Friday)', lat: 27.17, lng: 78.04 },
            { name: 'Amber Fort', timing: '08:00 AM - 05:30 PM', lat: 26.98, lng: 75.85 }
        ],
        agentId: 'a2'
    }
];

export const MOCK_DOCTORS: Doctor[] = [
    { id: 'd1', name: 'Dr. Anjali Gupta', specialty: 'General Physician', hospital: 'Apollo Clinic', distance: '1.2 km', rating: 4.8, phone: '+91-11-2345-6789' },
    { id: 'd2', name: 'Dr. Sameer Khan', specialty: 'Orthopedist', hospital: 'Max Hospital', distance: '3.5 km', rating: 4.6, phone: '+91-11-9876-5432' },
    { id: 'd3', name: 'City Hospital Emergency', specialty: '24/7 Trauma Center', hospital: 'City Hospital', distance: '0.8 km', rating: 4.2, phone: '102' }
];

export const MOCK_HISTORY: TripRecord[] = [
    { id: 't1', destination: 'Jaipur, Rajasthan', date: '12 Oct 2023', status: 'Upcoming', totalCost: 15400, type: 'Package', bookingRef: 'PKG-8821' },
    { id: 't2', destination: 'Rishikesh, Uttarakhand', date: '05 Sep 2023', status: 'Completed', totalCost: 8500, type: 'Transport', bookingRef: 'TRN-9901' },
    { id: 't3', destination: 'Goa', date: '15 Aug 2023', status: 'Cancelled', totalCost: 0, type: 'Flight', bookingRef: 'FLT-1120' },
];

export const MOCK_FLIGHT_RESULTS: TransportOption[] = [
    { id: 'f1', name: 'IndiGo 6E-204', type: 'flight', departure: '06:00 AM', arrival: '08:00 AM', price: 4500, availability: 'Available', duration: '2h 00m' },
    { id: 'f2', name: 'Air India AI-809', type: 'flight', departure: '10:00 AM', arrival: '12:15 PM', price: 5200, availability: 'Available', duration: '2h 15m' },
    { id: 'f3', name: 'Vistara UK-990', type: 'flight', departure: '04:30 PM', arrival: '06:45 PM', price: 6100, availability: 'Few Seats', duration: '2h 15m' },
];

export const MOCK_LOCAL_RESULTS: TransportOption[] = [
    { id: 'l1', name: 'Private Jeep', type: 'jeep', departure: 'Flexible', arrival: 'N/A', price: 2500, availability: 'Available', duration: 'Full Day' },
    { id: 'l2', name: 'Auto Rickshaw', type: 'auto', departure: 'Instant', arrival: 'N/A', price: 150, availability: 'Available', duration: 'Per Trip' },
    { id: 'l3', name: 'Trekking Guide', type: 'trek', departure: '06:00 AM', arrival: '04:00 PM', price: 1200, availability: 'Available', duration: '8 Hours' },
];

export const MOCK_HOTELS: HotelOption[] = [
    { id: 'h1', name: 'The Royal Heritage', location: 'City Center, Jaipur', price: 4500, rating: 4.7, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400', amenities: ['WiFi', 'Pool', 'Breakfast'] },
    { id: 'h2', name: 'Zostel Hostel', location: 'Old City, Jaipur', price: 899, rating: 4.5, image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=400', amenities: ['WiFi', 'Social', 'AC'] },
    { id: 'h3', name: 'Taj Rambagh Palace', location: 'Bhawani Singh Rd', price: 25000, rating: 4.9, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=400', amenities: ['Luxury', 'Spa', 'Heritage'] },
];

export const MOCK_RENTALS: RentalVehicle[] = [
    { id: 'r1', name: 'Honda Activa 6G', type: 'Scooter', pricePerDay: 450, rating: 4.8, provider: 'GoBikes', image: 'https://images.unsplash.com/photo-1625043484555-47841a750399?auto=format&fit=crop&q=80&w=400', transmission: 'Automatic', fuel: 'Petrol' },
    { id: 'r2', name: 'Royal Enfield Classic 350', type: 'Bike', pricePerDay: 1200, rating: 4.9, provider: 'WheelStreet', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=400', transmission: 'Manual', fuel: 'Petrol' },
    { id: 'r3', name: 'Maruti Swift', type: 'Car', pricePerDay: 2200, rating: 4.7, provider: 'ZoomCar', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400', transmission: 'Manual', fuel: 'Diesel' },
    { id: 'r4', name: 'Tata Nexon EV', type: 'SUV', pricePerDay: 3500, rating: 4.9, provider: 'Revv', image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=400', transmission: 'Automatic', fuel: 'Electric' },
];

export const MOCK_NEWS: NewsItem[] = [
    { id: 'n1', title: 'Heavy Rainfall Alert in Kerala', summary: 'IMD has issued an orange alert for 3 districts. Travelers advised to avoid hilly areas.', date: '2 Hours Ago', type: 'alert', location: 'Kerala' },
    { id: 'n2', title: 'Taj Mahal Night Viewing Open', summary: 'Night viewing for the upcoming full moon has been opened for booking.', date: '1 Day Ago', type: 'event', location: 'Agra' },
    { id: 'n3', title: 'New Metro Line in Bangalore', summary: 'Purple line extension is now operational connecting Whitefield.', date: '2 Days Ago', type: 'update', location: 'Bangalore' },
];

export const STATE_INFOGRAPHICS: StateInfographic[] = [
    { id: 'kl', stateName: 'Kerala', tagline: "God's Own Country", fact: 'Home to the world’s richest temple, Padmanabhaswamy.', icon: '🌴', color: 'bg-green-600' },
    { id: 'rj', stateName: 'Rajasthan', tagline: 'The Land of Kings', fact: 'Jaipur is home to the world’s largest stone sundial.', icon: '🏰', color: 'bg-orange-600' },
    { id: 'ga', stateName: 'Goa', tagline: 'Pearl of the Orient', fact: 'Goa has the only naval aviation museum in Asia.', icon: '🏖️', color: 'bg-blue-500' },
    { id: 'hp', stateName: 'Himachal', tagline: 'Land of Gods', fact: 'Home to the highest cricket ground in the world at Chail.', icon: '🏔️', color: 'bg-indigo-600' },
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
    { 
        id: 'n1', 
        type: 'check-in', 
        title: 'Upcoming Flight: Indigo 6E-204', 
        message: 'Web check-in is open. Boarding starts at 05:20 AM.', 
        time: 'Tomorrow, 06:00 AM', 
        priority: 'high',
        actionLabel: 'Check-in Now',
        details: { pnr: 'IX-8829', platform: 'Gate 4' }
    },
    { 
        id: 'n2', 
        type: 'info', 
        title: 'Hotel Check-in', 
        message: 'Your room at The Royal Heritage is confirmed. Standard Check-in time is 12:00 PM.', 
        time: 'Fri, 12 Oct', 
        priority: 'normal',
        details: { roomNumber: 'Pending Allocation' }
    },
    { 
        id: 'n3', 
        type: 'agent', 
        title: 'Guide Assigned: Rajesh Kumar', 
        message: 'Your guide for the Amber Fort tour will meet you at the main gate.', 
        time: 'Sat, 13 Oct, 09:00 AM', 
        priority: 'normal',
        actionType: 'call',
        details: { agentNumber: '+91-98765-43210' }
    }
];