import React from 'react';

export type UserType = 'citizen' | 'foreigner' | null;

export interface AppSettings {
  language: string;
  currency: string;
  notifications: boolean;
  dataSaver: boolean;
  accessibility: {
      screenReader: boolean;
      highContrast: boolean;
      hapticFeedback: boolean;
      voiceFirst: boolean;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isPlan?: boolean; 
  planData?: DayPlan[];
  widget?: 'proposal' | 'doctor-list' | 'vision-result' | 'booking-suggestion'; 
  widgetData?: any;
}

export interface BookingSuggestion {
    type: 'Flight' | 'Hotel' | 'Package';
    title: string;
    subtitle: string;
    price: number;
    rating?: number;
    image?: string;
    data: any; // Original data object (TransportOption, HotelOption, etc.)
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  currency: 'INR' | 'USD';
  date: string;
  note?: string;
}

export interface EmergencyContact {
  name: string;
  number: string;
  category: 'Police' | 'Medical' | 'Embassy' | 'Transport';
}

export enum PaymentMode {
  UPI = 'UPI',
  OFFLINE_USSD = 'USSD', // *99#
  CARD = 'CARD'
}

export interface ServiceItem {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  status: 'active' | 'maintenance' | 'offline_ready';
}

export interface ItineraryItem {
  time: string;
  activity: string;
  type: 'sightseeing' | 'food' | 'transport';
  notes: string;
}

export interface DayPlan {
  day: number;
  title: string;
  items: ItineraryItem[];
}

export type TransportType = 'train' | 'bus' | 'flight' | 'cab' | 'jeep' | 'auto' | 'trek' | 'rental';

export interface TransportOption {
  id: string;
  name: string;
  type: TransportType;
  departure: string;
  arrival: string;
  price: number;
  availability: string;
  duration?: string;
}

export interface RentalVehicle {
    id: string;
    name: string;
    type: 'Bike' | 'Scooter' | 'Car' | 'SUV';
    pricePerDay: number;
    image: string;
    rating: number;
    provider: string;
    transmission: 'Manual' | 'Automatic';
    fuel: 'Petrol' | 'Diesel' | 'Electric';
}

export interface HotelOption {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  amenities: string[];
}

export interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  replies: number;
  tag: 'Review' | 'Question' | 'Tip';
  location?: string;
  coords?: { x: number; y: number }; 
}

export interface TravelGroup {
    id: string;
    name: string;
    destination: string;
    date: string;
    members: number;
    maxMembers: number;
    avatar: string;
    description: string;
}

export interface Agent {
  id: string;
  name: string;
  phone: string;
  languages: string[];
  rating: number;
  ratingCount?: number;
}

export interface TravelPackage {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  rating: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  riskAlert?: string;
  spots: { name: string; timing: string; lat: number; lng: number }[];
  agentId: string;
}

export type TimelineStep = 'search' | 'review' | 'book' | 'agent' | 'trip';

export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    hospital: string;
    distance: string;
    rating: number;
    phone: string;
}

export interface TripRecord {
    id: string;
    destination: string;
    date: string;
    status: 'Upcoming' | 'Completed' | 'Cancelled';
    totalCost: number;
    type: 'Package' | 'Transport' | 'Flight' | 'Stay' | 'Rental'; 
    bookingRef?: string;
}

export interface NewsItem {
    id: string;
    title: string;
    summary: string;
    date: string;
    type: 'alert' | 'update' | 'event';
    location?: string;
}

export interface StateInfographic {
    id: string;
    stateName: string;
    tagline: string;
    fact: string;
    icon: string;
    color: string;
}

export interface AppNotification {
    id: string;
    type: 'check-in' | 'alert' | 'info' | 'agent';
    title: string;
    message: string;
    time: string;
    priority: 'high' | 'normal';
    actionLabel?: string;
    actionType?: 'call' | 'navigate' | 'ticket';
    details?: {
        platform?: string;
        pnr?: string;
        agentNumber?: string;
        roomNumber?: string;
    };
}