import React from 'react';
import { ParkingSlot } from '../types';
import { Zap, Accessibility, Crown, Car, ShieldAlert, Radio } from 'lucide-react';

interface SlotCardProps {
  slot: ParkingSlot;
  isSelected: boolean;
  isUsersBooking: boolean;
  onSelectSlot: (slot: ParkingSlot) => void;
  onDirectBook: (slot: ParkingSlot) => void;
}

export const SlotCard: React.FC<SlotCardProps> = ({
  slot,
  isSelected,
  isUsersBooking,
  onSelectSlot,
  onDirectBook,
}) => {
  const isAvailable = slot.status === 'available';
  const isOccupied = slot.status === 'occupied';
  const isReserved = slot.status === 'reserved';
  const isMaintenance = slot.status === 'maintenance';

  // Get status color palette
  const getStatusStyles = () => {
    if (isUsersBooking) {
      return {
        card: 'border-cyan-400 bg-cyan-950/40 shadow-glow-cyan',
        badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
        dot: 'bg-cyan-400',
        text: 'text-cyan-300',
        label: 'YOUR SPOT',
      };
    }
    if (isSelected) {
      return {
        card: 'border-cyan-400 bg-navy-800 shadow-glow-cyan scale-[1.02]',
        badge: 'bg-cyan-500/30 text-cyan-200 border-cyan-400',
        dot: 'bg-cyan-400',
        text: 'text-cyan-300',
        label: 'SELECTED',
      };
    }
    if (isAvailable) {
      return {
        card: 'border-emerald-500/30 bg-emerald-950/20 hover:border-emerald-400 hover:shadow-glow-emerald hover:-translate-y-1',
        badge: 'bg-emerald-950 text-emerald-400 border-emerald-500/40',
        dot: 'bg-emerald-400',
        text: 'text-emerald-400',
        label: 'AVAILABLE',
      };
    }
    if (isOccupied) {
      return {
        card: 'border-rose-500/30 bg-rose-950/20 hover:border-rose-400/60',
        badge: 'bg-rose-950 text-rose-400 border-rose-500/40',
        dot: 'bg-rose-400',
        text: 'text-rose-400',
        label: 'OCCUPIED',
      };
    }
    if (isReserved) {
      return {
        card: 'border-amber-500/30 bg-amber-950/20 hover:border-amber-400/60',
        badge: 'bg-amber-950 text-amber-400 border-amber-500/40',
        dot: 'bg-amber-400',
        text: 'text-amber-400',
        label: 'RESERVED',
      };
    }
    return {
      card: 'border-slate-800 bg-slate-900/40 opacity-60',
      badge: 'bg-slate-800 text-slate-400 border-slate-700',
      dot: 'bg-slate-500',
      text: 'text-slate-400',
      label: 'MAINTENANCE',
    };
  };

  const style = getStatusStyles();

  const getTypeIcon = () => {
    switch (slot.type) {
      case 'ev_charging':
        return <Zap className="w-3.5 h-3.5 text-cyan-400" />;
      case 'vip':
        return <Crown className="w-3.5 h-3.5 text-amber-400" />;
      case 'accessible':
        return <Accessibility className="w-3.5 h-3.5 text-blue-400" />;
      default:
        return <Car className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div
      onClick={() => onSelectSlot(slot)}
      className={`relative rounded-xl p-3 border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${style.card}`}
    >
      {/* Top row: Slot Code, Type Icon, Sensor Heartbeat */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-base font-extrabold text-white tracking-wider">
            {slot.slot_number}
          </span>
          <span title={slot.type} className="p-1 rounded bg-navy-900/80 border border-slate-800">
            {getTypeIcon()}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${style.dot} ${isAvailable ? 'animate-pulse' : ''}`} />
          <Radio className="w-3 h-3 text-slate-500 opacity-60" />
        </div>
      </div>

      {/* Middle row: Visual Parking Space Graphic or Occupied Plate */}
      <div className="my-2.5 flex items-center justify-center py-2 px-1 rounded-lg bg-navy-950/60 border border-slate-900 min-h-[46px]">
        {isOccupied ? (
          <div className="text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">VEHICLE</span>
            <span className="font-mono text-xs font-bold text-rose-300">
              {slot.occupiedByPlate || 'PARKED'}
            </span>
          </div>
        ) : isReserved ? (
          <div className="text-center">
            <span className="text-[10px] uppercase font-mono text-amber-400/80 block">RESERVED</span>
            <span className="font-mono text-xs text-slate-300">Pending Gate</span>
          </div>
        ) : isMaintenance ? (
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <ShieldAlert className="w-3 h-3" /> Offline
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-xs font-mono font-bold text-emerald-400">OPEN</span>
            <span className="text-[10px] text-slate-400 font-mono">₹{slot.hourly_rate.toFixed(2)}/h</span>
          </div>
        )}
      </div>

      {/* Bottom row: Status badge & Quick Action */}
      <div className="flex items-center justify-between mt-0.5">
        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${style.badge}`}>
          {style.label}
        </span>

        {isAvailable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDirectBook(slot);
            }}
            className="text-[10px] font-bold px-2 py-0.5 rounded bg-gradient-to-r from-cyan-500 to-emerald-500 text-navy-950 hover:opacity-90 font-mono shadow-sm transition-opacity"
          >
            BOOK
          </button>
        )}
      </div>
    </div>
  );
};
