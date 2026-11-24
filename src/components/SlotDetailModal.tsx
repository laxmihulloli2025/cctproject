import React from 'react';
import { ParkingSlot } from '../types';
import { 
  X, 
  Zap, 
  Battery, 
  Radio, 
  Clock, 
  ShieldCheck, 
  Car, 
  Layers, 
  DollarSign, 
  Cpu, 
  ArrowRight
} from 'lucide-react';

interface SlotDetailModalProps {
  slot: ParkingSlot | null;
  onClose: () => void;
  onOpenBooking: (slot: ParkingSlot) => void;
  isUsersBooking: boolean;
}

export const SlotDetailModal: React.FC<SlotDetailModalProps> = ({
  slot,
  onClose,
  onOpenBooking,
  isUsersBooking,
}) => {
  if (!slot) return null;

  const isAvailable = slot.status === 'available';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-cyan-500/30 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1.5px] shadow-glow-cyan">
              <div className="w-full h-full bg-navy-950 rounded-[14px] flex flex-col items-center justify-center">
                <span className="text-[10px] text-cyan-400 font-mono font-bold">SLOT</span>
                <span className="text-lg font-mono font-extrabold text-white">{slot.slot_number}</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white">Slot Details & Telemetry</h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold border ${
                  slot.status === 'available' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' :
                  slot.status === 'occupied' ? 'bg-rose-950 text-rose-400 border-rose-500/40' :
                  slot.status === 'reserved' ? 'bg-amber-950 text-amber-400 border-amber-500/40' :
                  'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {slot.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {slot.zone} • Level {slot.floor} Deck
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-navy-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Specifications Grid */}
        <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
          
          <div className="p-3 rounded-xl bg-navy-900/60 border border-slate-800">
            <span className="text-slate-400 font-mono block text-[10px] uppercase">SLOT CATEGORY</span>
            <div className="mt-1 flex items-center gap-2 font-bold text-white capitalize">
              {slot.type === 'ev_charging' ? (
                <>
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>EV 22kW Fast Charger</span>
                </>
              ) : slot.type === 'vip' ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>VIP Executive Bay</span>
                </>
              ) : slot.type === 'accessible' ? (
                <>
                  <Car className="w-4 h-4 text-blue-400" />
                  <span>Accessible Bay</span>
                </>
              ) : (
                <>
                  <Car className="w-4 h-4 text-slate-300" />
                  <span>Standard Vehicle Bay</span>
                </>
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-navy-900/60 border border-slate-800">
            <span className="text-slate-400 font-mono block text-[10px] uppercase">HOURLY PARKING RATE</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-mono font-extrabold text-emerald-400">
                ₹{slot.hourly_rate.toFixed(2)}
              </span>
              <span className="text-slate-400 text-xs font-mono">/ hour</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-navy-900/60 border border-slate-800">
            <span className="text-slate-400 font-mono block text-[10px] uppercase">IOT SENSOR HARDWARE</span>
            <div className="mt-1 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-slate-200">{slot.sensor_id}</span>
            </div>
            <div className="mt-1 text-[11px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Telemetry: {slot.sensor_health}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-navy-900/60 border border-slate-800">
            <span className="text-slate-400 font-mono block text-[10px] uppercase">SENSOR BATTERY & SIGNAL</span>
            <div className="mt-1 flex items-center gap-2">
              <Battery className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-slate-200">{slot.sensor_battery}% Charged</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400 font-mono flex items-center gap-1">
              <Radio className="w-3 h-3 text-cyan-400" />
              <span>915MHz LoRaWAN / BLE</span>
            </div>
          </div>

        </div>

        {/* Current Vehicle Plate if Occupied */}
        {slot.status === 'occupied' && (
          <div className="mt-4 p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-rose-400 uppercase font-bold block">
                CURRENTLY OCCUPIED BY
              </span>
              <span className="text-sm font-mono font-bold text-white">
                License Plate: {slot.occupiedByPlate || 'VERIFIED PARKED'}
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Sensor detected weight / ultrasound
            </span>
          </div>
        )}

        {/* Footer CTAs */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl glass-panel text-slate-300 hover:text-white text-xs font-semibold"
          >
            Close
          </button>

          {isAvailable && (
            <button
              onClick={() => {
                onClose();
                onOpenBooking(slot);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-navy-950 font-bold text-xs shadow-glow-cyan hover:shadow-glow-cyan-lg hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <Car className="w-4 h-4" />
              <span>Reserve Slot {slot.slot_number}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
