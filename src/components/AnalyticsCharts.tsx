import React from 'react';
import { useParking } from '../context/ParkingContext';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Activity, 
  Zap, 
  DollarSign, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';

export const AnalyticsCharts: React.FC = () => {
  const { stats, slots } = useParking();

  // Zone specific metrics
  const zoneA = slots.filter((s) => s.zone === 'Zone A');
  const zoneB = slots.filter((s) => s.zone === 'Zone B');
  const zoneC = slots.filter((s) => s.zone === 'Zone C');

  const occA = Math.round((zoneA.filter((s) => s.status !== 'available').length / zoneA.length) * 100);
  const occB = Math.round((zoneB.filter((s) => s.status !== 'available').length / zoneB.length) * 100);
  const occC = Math.round((zoneC.filter((s) => s.status !== 'available').length / zoneC.length) * 100);

  // Hourly simulated traffic curve (24 hours)
  const hourlyData = [
    { hour: '00:00', occ: 15 },
    { hour: '02:00', occ: 10 },
    { hour: '04:00', occ: 12 },
    { hour: '06:00', occ: 35 },
    { hour: '08:00', occ: 82 },
    { hour: '10:00', occ: 94 },
    { hour: '12:00', occ: 88 },
    { hour: '14:00', occ: 91 },
    { hour: '16:00', occ: 85 },
    { hour: '18:00', occ: 74 },
    { hour: '20:00', occ: 52 },
    { hour: '22:00', occ: 30 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>PEAK OCCUPANCY</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-cyan-300">
            94%
          </div>
          <span className="text-[11px] text-slate-400 font-mono">10:00 AM – 02:00 PM peak</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>EST. DAILY REVENUE</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-emerald-400">
            ₹{stats.estimatedRevenueToday.toFixed(2)}
          </div>
          <span className="text-[11px] text-emerald-300/80 font-mono">+18.4% vs yesterday</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-amber-500/30">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>AVG DURATION</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-amber-300">
            2.8 hrs
          </div>
          <span className="text-[11px] text-slate-400 font-mono">EV charge sessions avg 3.5h</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>SENSOR HEALTH</span>
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-white">
            98.3%
          </div>
          <span className="text-[11px] text-emerald-400 font-mono">59/60 Nodes Optimal</span>
        </div>

      </div>

      {/* Chart 1: Hourly Occupancy Trend SVG Area Graph */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>24-Hour IoT Occupancy Telemetry</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Live aggregated sensor readings across all 60 bays
            </p>
          </div>

          <span className="text-xs font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40">
            Realtime Stream
          </span>
        </div>

        {/* SVG Area Chart */}
        <div className="h-48 w-full relative">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 600 160" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="0" y1="40" x2="600" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
            <line x1="0" y1="80" x2="600" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
            <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />

            {/* Area Fill */}
            <path
              d="M 0,140 Q 50,145 100,120 T 200,30 T 300,15 T 400,25 T 500,70 T 600,120 L 600,160 L 0,160 Z"
              fill="url(#areaGlow)"
            />

            {/* Spline Line */}
            <path
              d="M 0,140 Q 50,145 100,120 T 200,30 T 300,15 T 400,25 T 500,70 T 600,120"
              fill="none"
              stroke="#00f2fe"
              strokeWidth="2.5"
            />

            {/* Data points */}
            {hourlyData.map((d, idx) => {
              const x = (idx / (hourlyData.length - 1)) * 580 + 10;
              const y = 160 - (d.occ / 100) * 140;
              return (
                <circle
                  key={d.hour}
                  cx={x}
                  cy={y}
                  r="3.5"
                  className="fill-cyan-400 stroke-navy-950 stroke-2 hover:r-5 transition-all"
                >
                  <title>{`${d.hour}: ${d.occ}% Occupancy`}</title>
                </circle>
              );
            })}
          </svg>

          {/* Time axis */}
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2">
            {hourlyData.map((d) => (
              <span key={d.hour}>{d.hour}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Two columns: Zone Utilization & Revenue by Zone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Zone Utilization Comparison */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <PieChart className="w-4 h-4 text-emerald-400" />
            <span>Zone Utilization Breakdown</span>
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-cyan-300 font-bold">Zone A (EV & VIP Deck)</span>
                <span className="text-white">{occA}% ({zoneA.filter(s => s.status !== 'available').length}/20)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-navy-950 overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full" style={{ width: `${occA}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-emerald-300 font-bold">Zone B (Standard Fleet)</span>
                <span className="text-white">{occB}% ({zoneB.filter(s => s.status !== 'available').length}/20)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-navy-950 overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full" style={{ width: `${occB}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-amber-300 font-bold">Zone C (Covered Smart Tier)</span>
                <span className="text-white">{occC}% ({zoneC.filter(s => s.status !== 'available').length}/20)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-navy-950 overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full" style={{ width: `${occC}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Pricing & EV Stats */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Clean Energy & EV Fleet Impact</span>
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-xl bg-navy-900 border border-slate-800">
                <span className="text-slate-400">Total EV Fast Chargers:</span>
                <span className="text-cyan-300 font-bold">10 Bays (DC 22kW)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-navy-900 border border-slate-800">
                <span className="text-slate-400">Estimated Carbon Offset:</span>
                <span className="text-emerald-400 font-bold">~148.5 kg CO₂ today</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-navy-900 border border-slate-800">
                <span className="text-slate-400">Smart Grid Efficiency:</span>
                <span className="text-white font-bold">96.4% Power Factor</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
            All charging telemetry ingested and calibrated through Supabase edge functions.
          </div>
        </div>

      </div>

    </div>
  );
};
