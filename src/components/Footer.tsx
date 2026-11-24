import React from 'react';
import { Cloud, Cpu, Radio, ShieldCheck, Heart } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface FooterProps {
  openArchitectureModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ openArchitectureModal }) => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-navy-950/90 text-slate-400 py-8 px-4 sm:px-6 lg:px-8 mt-16 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Side: Project details */}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-white">SmartPark Cloud</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              v1.0.0 CLOUD EDITION
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            Next-Gen Smart Cloud Parking Management System. Final Year Engineering / College Cloud Computing Capstone Project.
          </p>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">
            React + Vite + TypeScript • Tailwind CSS • Supabase PostgreSQL • Cloudflare Pages Edge
          </p>
        </div>

        {/* Center: Live Architecture Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-900 border border-slate-800 text-[11px] font-mono text-slate-300">
            <Cloud className="w-3.5 h-3.5 text-cyan-400" />
            <span>Edge: Cloudflare Pages</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-900 border border-slate-800 text-[11px] font-mono text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Database: {isSupabaseConfigured ? 'Supabase PostgreSQL' : 'Cloud Demo Mock'}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-900 border border-slate-800 text-[11px] font-mono text-slate-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>IoT Sensors: 60/60 Online</span>
          </div>

          <button
            onClick={openArchitectureModal}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-[11px] font-mono text-cyan-300 hover:bg-cyan-900 transition-colors shadow-glow-cyan"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>View Cloud Viva Architecture</span>
          </button>
        </div>

        {/* Right Side */}
        <div className="text-xs text-slate-500 text-center md:text-right font-mono">
          <div>Built with <span className="text-cyan-400 font-bold">Cloud Computing & IoT</span></div>
          <div className="text-[11px] text-slate-600 mt-0.5">Automated Sensor Heartbeat Active</div>
        </div>
      </div>
    </footer>
  );
};
