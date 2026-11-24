import React from 'react';
import { 
  X, 
  Server, 
  Cloud, 
  Cpu, 
  ShieldCheck, 
  Radio, 
  Layers, 
  Workflow, 
  Database, 
  Globe, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

interface CloudArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudArchitectureModal: React.FC<CloudArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md animate-in fade-in">
      <div 
        className="glass-panel w-full max-w-4xl rounded-3xl p-6 sm:p-8 border border-cyan-500/40 shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute -top-16 -right-16 w-60 h-60 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1.5px] shadow-glow-cyan">
              <div className="w-full h-full bg-navy-950 rounded-[11px] flex items-center justify-center">
                <Cloud className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">
                Cloud Computing System Architecture & Viva Guide
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Technical Blueprint • Capstone Defense Presentation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-navy-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="mt-5 space-y-6 overflow-y-auto pr-2 text-xs leading-relaxed">
          
          {/* Architecture Pipeline Visual Diagram */}
          <div className="p-5 rounded-2xl bg-navy-900/80 border border-slate-800">
            <h3 className="text-sm font-bold text-cyan-300 font-mono uppercase mb-4 flex items-center gap-2">
              <Workflow className="w-4 h-4 text-cyan-400" />
              <span>Multi-Tier Cloud IoT Architecture Flow</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              
              {/* Stage 1 */}
              <div className="p-3.5 rounded-xl bg-navy-950/70 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 mb-2">
                    <span>TIER 1</span>
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <h4 className="font-bold text-white text-xs">Edge IoT Sensor Mesh</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Ultrasonic & optical vehicle presence detectors (A01-C20) emitting 915MHz telemetry packets.
                  </p>
                </div>
                <div className="mt-3 text-[10px] font-mono text-emerald-400">
                  Latency: &lt;5ms
                </div>
              </div>

              {/* Stage 2 */}
              <div className="p-3.5 rounded-xl bg-navy-950/70 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 mb-2">
                    <span>TIER 2</span>
                    <Server className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="font-bold text-white text-xs">Cloud Ingestion Gateway</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Edge broker validates signatures, filters sensor noise, and batches event payloads.
                  </p>
                </div>
                <div className="mt-3 text-[10px] font-mono text-cyan-400">
                  Real-time WebSockets
                </div>
              </div>

              {/* Stage 3 */}
              <div className="p-3.5 rounded-xl bg-navy-950/70 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-amber-400 mb-2">
                    <span>TIER 3</span>
                    <Database className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="font-bold text-white text-xs">PostgreSQL + Realtime Pub/Sub</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Supabase PostgreSQL with Row Level Security (RLS) and WAL change-data-capture broadcasting.
                  </p>
                </div>
                <div className="mt-3 text-[10px] font-mono text-amber-300">
                  ACID Transactions
                </div>
              </div>

              {/* Stage 4 */}
              <div className="p-3.5 rounded-xl bg-navy-950/70 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 mb-2">
                    <span>TIER 4</span>
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="font-bold text-white text-xs">Cloudflare Edge CDN Client</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    React + TypeScript SPA delivered globally across 300+ Edge Data Centers with sub-20ms TTFB.
                  </p>
                </div>
                <div className="mt-3 text-[10px] font-mono text-emerald-400">
                  Edge Cached Assets
                </div>
              </div>

            </div>
          </div>

          {/* Key Cloud Computing Concepts for Presentation Viva */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Core Cloud Computing Concepts Explained (Viva Ready)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              
              <div className="p-4 rounded-xl bg-navy-900/60 border border-slate-800">
                <h4 className="font-bold text-cyan-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>1. Cloud Service Models: PaaS & SaaS</span>
                </h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  SmartPark Cloud combines Platform-as-a-Service (Supabase PostgreSQL, Edge Functions, Auth) and Software-as-a-Service (Smart City Driver and Operator Portals), reducing operational infrastructure management overhead.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-navy-900/60 border border-slate-800">
                <h4 className="font-bold text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>2. Event-Driven Real-Time Synchronization</span>
                </h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  Instead of wasteful client HTTP polling, the cloud database utilizes Postgres Write-Ahead Logs (WAL) and WebSocket event streams to push slot occupancy changes to clients within 20 milliseconds.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-navy-900/60 border border-slate-800">
                <h4 className="font-bold text-amber-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>3. Multi-Tenant Row Level Security (RLS)</span>
                </h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  Security policies are enforced at the database layer. Drivers can only view their own digital boarding passes and wallet balances, whereas Cloud Supervisors (Admins) have cryptographic authorization to override slot telemetry.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-navy-900/60 border border-slate-800">
                <h4 className="font-bold text-cyan-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>4. Cloud Edge CDN Deployment (Cloudflare)</span>
                </h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  The frontend application is built via Vite and statically routed across Cloudflare's global Anycast Edge Network with TLS 1.3 encryption, automatic DDoS mitigation, and instantaneous zero-downtime deployment.
                </p>
              </div>

            </div>
          </div>

          {/* Database Schema Overview */}
          <div className="p-4 rounded-xl bg-navy-900/60 border border-slate-800">
            <h4 className="font-bold text-white text-xs font-mono uppercase mb-2 flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>PostgreSQL Relational Schema Tables</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono text-slate-300">
              <div className="p-2 rounded bg-navy-950 border border-slate-800">
                <strong className="text-cyan-300 block">profiles</strong>
                <span>User & Admin auth identities, wallet credits, plates</span>
              </div>
              <div className="p-2 rounded bg-navy-950 border border-slate-800">
                <strong className="text-emerald-300 block">parking_slots</strong>
                <span>60 bays (A01-C20), status, rates, sensor IDs</span>
              </div>
              <div className="p-2 rounded bg-navy-950 border border-slate-800">
                <strong className="text-amber-300 block">bookings</strong>
                <span>Pass IDs, QR hashes, durations, RFID check-in/out</span>
              </div>
              <div className="p-2 rounded bg-navy-950 border border-slate-800">
                <strong className="text-cyan-300 block">payments</strong>
                <span>Simulated Cloud Wallet, Fastag & Card transactions</span>
              </div>
              <div className="p-2 rounded bg-navy-950 border border-slate-800">
                <strong className="text-emerald-300 block">notifications</strong>
                <span>Realtime alerts, sensor events, barrier triggers</span>
              </div>
              <div className="p-2 rounded bg-navy-950 border border-slate-800">
                <strong className="text-amber-300 block">sensor_telemetry</strong>
                <span>IoT heartbeat logs, confidence scores, battery telemetry</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
          <span>College Cloud Computing Presentation Mode</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-navy-950 font-bold"
          >
            Close Viva Guide
          </button>
        </div>

      </div>
    </div>
  );
};
