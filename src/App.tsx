import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useParking } from './context/ParkingContext';
import { ParkingSlot, Booking } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingHero } from './components/LandingHero';
import { ActiveBookingCard } from './components/ActiveBookingCard';
import { ParkingGrid } from './components/ParkingGrid';
import { SlotDetailModal } from './components/SlotDetailModal';
import { BookingModal } from './components/BookingModal';
import { BookingPassModal } from './components/BookingPassModal';
import { UserProfileModal } from './components/UserProfileModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AuthModal } from './components/AuthModal';
import { CloudArchitectureModal } from './components/CloudArchitectureModal';
import { AdminDashboard } from './components/AdminDashboard';
import { HistoryView } from './components/HistoryView';
import { ToastContainer } from './components/ToastContainer';
import { 
  Shield, 
  Car, 
  Layers, 
  FileCode, 
  Radio, 
  Sparkles, 
  CheckCircle2, 
  Cloud,
  Workflow
} from 'lucide-react';

export const App: React.FC = () => {
  const { currentUser, role } = useAuth();
  const { activeBooking, slots } = useParking();

  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<'driver' | 'admin' | 'history' | 'architecture'>('driver');

  // Modals state
  const [selectedSlotForDetail, setSelectedSlotForDetail] = useState<ParkingSlot | null>(null);
  const [selectedSlotForBooking, setSelectedSlotForBooking] = useState<ParkingSlot | null>(null);
  const [passModalBooking, setPassModalBooking] = useState<Booking | null>(null);
  
  const [walletModalOpen, setWalletModalOpen] = useState<boolean>(false);
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [architectureModalOpen, setArchitectureModalOpen] = useState<boolean>(false);

  // Handle direct booking from grid or details
  const handleDirectBook = (slot: ParkingSlot) => {
    setSelectedSlotForBooking(slot);
  };

  const handleBookingSuccess = (newBooking: Booking) => {
    setSelectedSlotForBooking(null);
    setPassModalBooking(newBooking);
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col relative selection:bg-cyan-500 selection:text-navy-950 font-sans">
      
      {/* Background Ambience & Cyber Grid */}
      <div className="fixed inset-0 bg-grid-pattern opacity-60 pointer-events-none z-0" />
      <div className="fixed top-0 left-1/4 w-[600px] h-[400px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-10 right-1/4 w-[500px] h-[400px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Main High-tech Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openWalletModal={() => setWalletModalOpen(true)}
        openProfileModal={() => setProfileModalOpen(true)}
        openNotificationsModal={() => setNotificationsModalOpen(true)}
        openAuthModal={() => setAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        
        {/* VIEW 1: DRIVER DECK */}
        {currentTab === 'driver' && (
          <div className="space-y-6">
            {/* Landing Hero */}
            <LandingHero
              onExploreSlots={() => {
                const el = document.getElementById('parking-deck');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenAdmin={() => setCurrentTab('admin')}
              onOpenArchitecture={() => setArchitectureModalOpen(true)}
            />

            {/* Active Booking Countdown Card (if driver has reserved or checked in) */}
            {activeBooking && (
              <ActiveBookingCard
                booking={activeBooking}
                onOpenPass={(b) => setPassModalBooking(b)}
              />
            )}

            {/* Interactive 60-Bay Parking Grid (A01 - C20) */}
            <div id="parking-deck" className="pt-2">
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <h2 className="text-xl font-extrabold text-white tracking-tight">
                    Smart Bay Grid & Live Telemetry
                  </h2>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Select an available bay (Green) to inspect sensor diagnostics and reserve with 1-click cloud pass.
                </p>
              </div>

              <ParkingGrid
                onSelectSlot={(slot) => setSelectedSlotForDetail(slot)}
                onDirectBook={handleDirectBook}
                selectedSlot={selectedSlotForDetail}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: ADMIN CONTROL ROOM */}
        {currentTab === 'admin' && (
          <div>
            <AdminDashboard />
          </div>
        )}

        {/* VIEW 3: USER BOOKINGS & HISTORY */}
        {currentTab === 'history' && (
          <div>
            <HistoryView
              onOpenPass={(b) => setPassModalBooking(b)}
              onExploreSlots={() => setCurrentTab('driver')}
            />
          </div>
        )}

        {/* VIEW 4: CLOUD COMPUTING VIVA & ARCHITECTURE */}
        {currentTab === 'architecture' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30 shadow-glow-cyan">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                    <Cloud className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-white">
                      Cloud Computing Capstone Technical Architecture
                    </h2>
                    <p className="text-xs text-slate-400 font-mono">
                      Complete viva presentation reference for professors and reviewers.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setArchitectureModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-navy-950 text-xs font-bold font-mono shadow-glow-cyan"
                >
                  Open Fullscreen Diagram
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-navy-900/60 border border-slate-800">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block mb-1">
                    FRONTEND & EDGE CDN
                  </span>
                  <h4 className="font-bold text-white text-sm">Cloudflare Pages Edge</h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Deploying static SPA artifacts across 300+ edge PoPs with Anycast DNS, SSL termination, and sub-30ms global response.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-navy-900/60 border border-slate-800">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block mb-1">
                    DATABASE & BACKEND PAAS
                  </span>
                  <h4 className="font-bold text-white text-sm">Supabase PostgreSQL 15</h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    ACID-compliant relational schema, Row-Level Security (RLS) data isolation, and Postgres WAL publication for WebSocket subscriptions.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-navy-900/60 border border-slate-800">
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block mb-1">
                    IOT & TELEMETRY LAYER
                  </span>
                  <h4 className="font-bold text-white text-sm">Simulated Sensor Mesh</h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    60 independent nodes (A01-C20) reporting occupancy transitions, heartbeat pings, battery diagnostics, and anomaly detection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Global Interactive Modals */}
      <SlotDetailModal
        slot={selectedSlotForDetail}
        onClose={() => setSelectedSlotForDetail(null)}
        onOpenBooking={handleDirectBook}
        isUsersBooking={activeBooking?.slot_id === selectedSlotForDetail?.id}
      />

      <BookingModal
        slot={selectedSlotForBooking}
        onClose={() => setSelectedSlotForBooking(null)}
        onBookingSuccess={handleBookingSuccess}
        onOpenWallet={() => {
          setSelectedSlotForBooking(null);
          setWalletModalOpen(true);
        }}
      />

      <BookingPassModal
        booking={passModalBooking}
        onClose={() => setPassModalBooking(null)}
      />

      <UserProfileModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        defaultTab="wallet"
      />

      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        defaultTab="profile"
      />

      <NotificationsModal
        isOpen={notificationsModalOpen}
        onClose={() => setNotificationsModalOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {}}
      />

      <CloudArchitectureModal
        isOpen={architectureModalOpen}
        onClose={() => setArchitectureModalOpen(false)}
      />

      {/* Futuristic Floating Glass Toast Alerts */}
      <ToastContainer />

      {/* Project Footer */}
      <Footer openArchitectureModal={() => setArchitectureModalOpen(true)} />

    </div>
  );
};
