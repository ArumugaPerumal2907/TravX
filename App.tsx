import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { TravelAssistant } from './components/TravelAssistant';
import { PaymentModule } from './components/PaymentModule';
import { SafetyModule } from './components/SafetyModule';
import { ServicesPlanner } from './components/ServicesPlanner';
import { Community } from './components/Community';
import { Navigation } from './components/Navigation';
import { TripOrganizer } from './components/TripOrganizer';
import { MedicalAssistant } from './components/MedicalAssistant';
import { BookingsHistory } from './components/BookingsHistory';
import { NewsFeed } from './components/NewsFeed';
import { NotificationCenter } from './components/NotificationCenter';
import { DocumentsVault } from './components/DocumentsVault';
import { UserType, TripRecord, AppSettings, Expense } from './types';
import { initializeChat } from './services/geminiService';
import { MOCK_HISTORY, MOCK_EXPENSES } from './constants';
import { Settings } from './components/Settings';
import { LoadingScreen } from './components/LoadingScreen';

const App: React.FC = () => {
  const [userType, setUserType] = useState<UserType>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Global App Settings
  const [settings, setSettings] = useState<AppSettings>({
      language: 'English',
      currency: 'INR',
      notifications: true,
      dataSaver: false,
      accessibility: {
          screenReader: false,
          highContrast: false,
          hapticFeedback: true,
          voiceFirst: false
      }
  });

  // Simulated Loading Sequence
  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 2500); // 2.5s loading screen
    return () => clearTimeout(timer);
  }, []);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
      setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  // Global Bookings State for End-to-End Workflow
  const [bookings, setBookings] = useState<TripRecord[]>(MOCK_HISTORY);
  
  // Global Expenses State
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);

  const addBooking = (newBooking: TripRecord) => {
      setBookings(prev => [newBooking, ...prev]);
  };

  const handleCancelBooking = (bookingId: string) => {
      setBookings(prev => prev.map(b => 
          b.id === bookingId ? { ...b, status: 'Cancelled' } : b
      ));
  };
  
  const addExpense = (newExpense: Expense) => {
      setExpenses(prev => [newExpense, ...prev]);
  };

  const handleUserSelect = (type: UserType) => {
    setUserType(type);
    initializeChat(type);
    // Smooth transition
    setTimeout(() => setShowOnboarding(false), 300);
  };

  // Mock checking if we are offline
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isLoading) {
      return <LoadingScreen loadingMessage="Initializing TravEx..." />;
  }

  if (showOnboarding) {
    return <Onboarding onSelect={handleUserSelect} />;
  }

  const renderContent = () => {
    // Check for deep links in activeTab (e.g. services-stays)
    if (activeTab.startsWith('services')) {
        let initialTab: 'transport' | 'packages' | 'stays' | 'calendar' | undefined = undefined;
        if (activeTab.includes('stays')) initialTab = 'stays';
        else if (activeTab.includes('transport')) initialTab = 'transport';
        else if (activeTab.includes('calendar')) initialTab = 'calendar';
        
        return <ServicesPlanner userType={userType} addBooking={addBooking} bookings={bookings} initialTab={initialTab} settings={settings} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard userType={userType} onNavigate={setActiveTab} />;
      case 'assistant':
        return <TravelAssistant userType={userType} settings={settings} addBooking={addBooking} />;
      case 'payments':
        return <PaymentModule />;
      case 'safety':
        return <SafetyModule userType={userType} onNavigate={setActiveTab} />;
      case 'community':
        return <Community onNavigate={setActiveTab} />;
      case 'navigation':
        return <Navigation />;
      case 'organizer':
        return <TripOrganizer bookings={bookings} expenses={expenses} />;
      case 'medical':
        return <MedicalAssistant onBack={() => setActiveTab('safety')} />;
      case 'history':
        return <BookingsHistory bookings={bookings} onCancelBooking={handleCancelBooking} settings={settings} />;
      case 'vault':
        return <DocumentsVault bookings={bookings} />;
      case 'news':
        return <NewsFeed />;
      case 'settings':
        return <Settings settings={settings} onUpdateSettings={updateSettings} />;
      default:
        return <Dashboard userType={userType} onNavigate={setActiveTab} />;
    }
  };

  return (
    <>
        <Layout 
            activeTab={activeTab.split('-')[0]} 
            onTabChange={setActiveTab} 
            userType={userType || 'citizen'}
            onNotificationClick={() => setShowNotifications(true)}
        >
        {isOffline && (
            <div className="bg-amber-100 text-amber-800 text-xs px-4 py-1 text-center font-medium">
            You are currently offline. Accessing cached mode.
            </div>
        )}
        {renderContent()}
        </Layout>

        {/* Global Notification Center Overlay */}
        {showNotifications && (
            <NotificationCenter onClose={() => setShowNotifications(false)} />
        )}
    </>
  );
};

export default App;