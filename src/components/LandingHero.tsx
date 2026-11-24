import React from 'react';
import { useParking } from '../context/ParkingContext';
import { useAuth } from '../context/AuthContext';
import { 
  Car, 
  Zap, 
  Shield, 
  Radio, 
  Clock, 
  MapPin, 
  ArrowRight, 
  CheckCircle, 
  Sparkles,
  Server
} from 'lucide-react';

interface LandingHeroProps {
  onExploreSlots: () => void;
  onOpenAdmin: () => void;
  onOpenArchitecture: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onExploreSlots,
  onOpenAdmin,
  onOpenArchitecture,
}) => {
  const { stats, isSimulating, toggleSimulation, cloudMetrics } = useParking();
  const { role, switchRole } = useAuth();

  return (
    <div className="relative overflow-hidden pt-6 pb-12">
      {/* Background radial glowing effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-cyan-500/15 via-emerald-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Announcement Tag */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-glow-cyan">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>COLLEGE CLOUD COMPUTING CAPSTONE • IOT MESH + POSTGRESQL + CLOUDFLARE EDGE</span>
          </div>
        </div>

        {/* Hero Title & Subtext */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Autonomous Cloud Parking for{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Smart Cities
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Eliminate parking hunting with real-time IoT sensor telemetry, instant contactless reservation, dynamic cloud edge billing, and automated barrier RFID check-in.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onExploreSlots}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-navy-950 font-bold text-sm shadow-glow-cyan hover:shadow-glow-cyan-lg hover:scale-[1.02] transition-all flex items-center gap-2 group"
            >
              <Car className="w-4 h-4 text-navy-950" />
              <span>Reserve a Slot Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                switchRole('admin');
                onOpenAdmin();
              }}
              className="px-5 py-3 rounded-xl glass-panel text-slate-200 border border-slate-700 hover:border-cyan-500/40 hover:text-cyan-300 text-sm font-semibold transition-all flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Admin Control Room</span>
            </button>

            <button
              onClick={onOpenArchitecture}
              className="px-4 py-3 rounded-xl bg-navy-900/80 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 text-sm font-mono transition-all flex items-center gap-2"
            >
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Cloud Architecture</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Ticker Grid */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          
          {/* Metric 1: Available Spots */}
          <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 relative overflow-hidden group hover:border-emerald-400/60 transition-all shadow-glow-emerald">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>AVAILABLE SPOTS</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                {stats.availableCount}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ {stats.totalSlots}</span>
            </div>
            <div className="mt-2 text-[11px] text-emerald-300/80 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span>{Math.round((stats.availableCount / stats.totalSlots) * 100)}% Capacity Free</span>
            </div>
          </div>

          {/* Metric 2: Occupied / Active */}
          <div className="glass-panel p-4 rounded-2xl border border-rose-500/30 relative overflow-hidden group hover:border-rose-400/60 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>OCCUPIED</span>
              <Car className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-rose-400 font-mono">
                {stats.occupiedCount}
              </span>
              <span className="text-xs text-slate-400 font-mono">slots parked</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 font-mono">
              Live Sensor Ingestion Active
            </div>
          </div>

          {/* Metric 3: EV Chargers */}
          <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 relative overflow-hidden group hover:border-cyan-400/60 transition-all shadow-glow-cyan">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>EV CHARGERS</span>
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-cyan-400 font-mono">
                {stats.evAvailableCount}
              </span>
              <span className="text-xs text-slate-400 font-mono">ready (22 kW)</span>
            </div>
            <div className="mt-2 text-[11px] text-cyan-300/80">
              Ultra-fast charging available
            </div>
          </div>

          {/* Metric 4: Cloud Latency */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>EDGE LATENCY</span>
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">
                {cloudMetrics.edgeLatencyMs}
              </span>
              <span className="text-xs text-slate-400 font-mono">ms</span>
            </div>
            <div className="mt-2 text-[11px] text-emerald-400 font-mono flex items-center justify-between">
              <span>{cloudMetrics.eventsProcessed} events</span>
              <button 
                onClick={toggleSimulation}
                className="underline hover:text-white"
              >
                {isSimulating ? '12s Auto' : 'Manual'}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
