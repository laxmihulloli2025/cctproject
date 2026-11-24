import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParking } from '../context/ParkingContext';
import { useNotifications } from '../context/NotificationContext';
import { 
  Shield, 
  Car, 
  Wallet, 
  Bell, 
  Radio, 
  Cloud, 
  Server, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Layers, 
  FileCode, 
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'driver' | 'admin' | 'history' | 'architecture';
  setCurrentTab: (tab: 'driver' | 'admin' | 'history' | 'architecture') => void;
  openWalletModal: () => void;
  openProfileModal: () => void;
  openNotificationsModal: () => void;
  openAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openWalletModal,
  openProfileModal,
  openNotificationsModal,
  openAuthModal,
}) => {
  const { currentUser, role, isSupabaseMode, logout, switchRole, loginAsDemoUser, loginAsDemoAdmin } = useAuth();
  const { isSimulating, toggleSimulation, cloudMetrics } = useParking();
  const { unreadCount } = useNotifications();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-cyan-500/20 bg-navy-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand & Smart City Badge */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setCurrentTab('driver')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1.5px] shadow-glow-cyan transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-navy-950 rounded-xl flex items-center justify-center">
                <Car className="w-5 h-5 text-cyan-400 group-hover:text-emerald-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
                  SmartPark
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 uppercase tracking-widest font-mono">
                  Cloud
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider font-mono">
                IOT CLOUD PARKING OS
              </p>
            </div>
          </div>

          {/* Cloud Telemetry Pill (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 ml-4 pl-4 border-l border-slate-800">
            <button
              onClick={toggleSimulation}
              title={isSimulating ? 'Click to pause simulation' : 'Click to start simulation'}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all ${
                isSimulating 
                  ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 shadow-glow-emerald' 
                  : 'bg-amber-950/50 border border-amber-500/30 text-amber-300'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isSimulating ? 'animate-pulse text-emerald-400' : 'text-amber-400'}`} />
              <span>{isSimulating ? 'SIMULATOR LIVE' : 'SIM PAUSED'}</span>
            </button>

            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded bg-navy-900/60 border border-slate-800">
              <Server className="w-3 h-3 text-cyan-400" />
              <span>{cloudMetrics.edgeLatencyMs}ms</span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded bg-navy-900/60 border border-slate-800">
              <Cloud className="w-3 h-3 text-emerald-400" />
              <span>{isSupabaseMode ? 'Supabase Live' : 'Demo Cloud'}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-navy-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setCurrentTab('driver')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'driver'
                ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200 hover:bg-navy-800'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Driver Deck</span>
          </button>

          <button
            onClick={() => setCurrentTab('admin')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'admin'
                ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200 hover:bg-navy-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Control Room</span>
            {role === 'admin' && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('history')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'history'
                ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200 hover:bg-navy-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>My Bookings</span>
          </button>

          <button
            onClick={() => setCurrentTab('architecture')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'architecture'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-cyan-300 hover:bg-navy-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>Viva / Cloud Architecture</span>
          </button>
        </nav>

        {/* Right Side Actions: Wallet, Notifications, Profile */}
        <div className="flex items-center gap-2.5">
          {/* Cloud Wallet Chip */}
          {currentUser && (
            <button
              onClick={openWalletModal}
              title="Click to view and top-up Cloud Wallet"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-navy-900 border border-emerald-500/30 text-emerald-400 hover:border-emerald-400 hover:shadow-glow-emerald transition-all text-xs font-mono font-bold"
            >
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>₹{currentUser.wallet_balance.toFixed(2)}</span>
              <span className="text-[10px] font-normal text-emerald-300/70 hidden sm:inline">+Topup</span>
            </button>
          )}

          {/* Notifications Button */}
          <button
            onClick={openNotificationsModal}
            className="relative p-2 rounded-xl bg-navy-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Profile Menu Dropdown */}
          <div className="relative">
            {currentUser ? (
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-navy-900 border border-slate-800 hover:border-cyan-500/40 transition-all"
              >
                <div className="w-7 h-7 rounded-lg overflow-hidden bg-gradient-to-tr from-cyan-500 to-emerald-500 p-[1px]">
                  {currentUser.avatar_url ? (
                    <img
                      src={currentUser.avatar_url}
                      alt={currentUser.full_name}
                      className="w-full h-full object-cover rounded-[7px]"
                    />
                  ) : (
                    <div className="w-full h-full bg-navy-900 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                  )}
                </div>
                <div className="hidden sm:block text-left text-xs pr-1">
                  <div className="font-semibold text-slate-200 line-clamp-1">{currentUser.full_name}</div>
                  <div className="text-[10px] text-cyan-400 font-mono uppercase">{currentUser.role}</div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-navy-950 font-bold text-xs shadow-glow-cyan hover:opacity-90 transition-opacity"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && currentUser && (
              <div 
                className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl p-2 shadow-2xl border border-cyan-500/30 z-50 animate-in fade-in slide-in-from-top-2"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <div className="p-2 border-b border-slate-800 mb-1">
                  <p className="text-xs font-bold text-white">{currentUser.full_name}</p>
                  <p className="text-[11px] text-slate-400 truncate font-mono">{currentUser.email}</p>
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Current Role:</span>
                    <span className={`font-mono px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      role === 'admin' 
                        ? 'bg-rose-950/70 text-rose-300 border border-rose-500/40' 
                        : 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/40'
                    }`}>
                      {role}
                    </span>
                  </div>
                </div>

                {/* Role Switcher in Dropdown */}
                <div className="p-1 mb-1 bg-navy-900/60 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 px-2 py-1 font-mono uppercase">Quick Demo Switch:</div>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        loginAsDemoUser();
                        setCurrentTab('driver');
                      }}
                      className={`text-xs px-2 py-1.5 rounded-lg flex items-center justify-center gap-1 ${
                        role === 'user' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Car className="w-3 h-3" /> Driver
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        loginAsDemoAdmin();
                        setCurrentTab('admin');
                      }}
                      className={`text-xs px-2 py-1.5 rounded-lg flex items-center justify-center gap-1 ${
                        role === 'admin' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Shield className="w-3 h-3" /> Admin
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => openProfileModal()}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-navy-800 rounded-xl transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Profile & Vehicles</span>
                </button>

                <button
                  onClick={() => openWalletModal()}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-navy-800 rounded-xl transition-colors"
                >
                  <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Top-up Cloud Wallet</span>
                </button>

                <div className="border-t border-slate-800 my-1" />

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-navy-900 border border-slate-800 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-slate-800 px-4 py-3 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
            <span className="text-slate-400 font-mono">SIMULATION STATUS:</span>
            <button
              onClick={toggleSimulation}
              className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${
                isSimulating ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {isSimulating ? 'ACTIVE (12s)' : 'PAUSED'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                setCurrentTab('driver');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${
                currentTab === 'driver' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-navy-900 text-slate-300'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Driver Deck</span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('admin');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${
                currentTab === 'admin' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-navy-900 text-slate-300'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin Room</span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('history');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${
                currentTab === 'history' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-navy-900 text-slate-300'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Bookings</span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('architecture');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${
                currentTab === 'architecture' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-navy-900 text-slate-300'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>Viva Docs</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
