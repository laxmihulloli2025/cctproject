import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import { useParking } from '../context/ParkingContext';
import { 
  Clock, 
  QrCode, 
  CheckCircle, 
  LogOut, 
  Zap, 
  AlertCircle, 
  ChevronRight, 
  ShieldCheck, 
  PlusCircle, 
  X
} from 'lucide-react';

interface ActiveBookingCardProps {
  booking: Booking;
  onOpenPass: (booking: Booking) => void;
}

export const ActiveBookingCard: React.FC<ActiveBookingCardProps> = ({
  booking,
  onOpenPass,
}) => {
  const { checkInBooking, checkOutBooking, extendBooking, cancelBooking } = useParking();

  const [timeLeftStr, setTimeLeftStr] = useState<string>('');
  const [percentRemaining, setPercentRemaining] = useState<number>(100);
  const [isOverstay, setIsOverstay] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showExtendMenu, setShowExtendMenu] = useState<boolean>(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const start = new Date(booking.start_time).getTime();
      const end = new Date(booking.end_time).getTime();
      const totalDuration = Math.max(1, end - start);
      const remainingMs = end - now;

      if (remainingMs <= 0) {
        setIsOverstay(true);
        const overstayMs = Math.abs(remainingMs);
        const mins = Math.floor(overstayMs / (1000 * 60));
        setTimeLeftStr(`Expired by ${mins}m`);
        setPercentRemaining(0);
      } else {
        setIsOverstay(false);
        const hours = Math.floor(remainingMs / (1000 * 3600));
        const mins = Math.floor((remainingMs % (1000 * 3600)) / (1000 * 60));
        const secs = Math.floor((remainingMs % (1000 * 60)) / 1000);
        setTimeLeftStr(`${hours}h ${mins}m ${secs}s`);
        const pct = Math.max(0, Math.min(100, Math.round((remainingMs / totalDuration) * 100)));
        setPercentRemaining(pct);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [booking.start_time, booking.end_time]);

  const handleCheckIn = async () => {
    setIsProcessing(true);
    await checkInBooking(booking.id);
    setIsProcessing(false);
  };

  const handleCheckOut = async () => {
    setIsProcessing(true);
    await checkOutBooking(booking.id);
    setIsProcessing(false);
  };

  const handleExtend = async (hours: number) => {
    setIsProcessing(true);
    await extendBooking(booking.id, hours);
    setShowExtendMenu(false);
    setIsProcessing(false);
  };

  const handleCancel = async () => {
    if (confirm(`Cancel reservation for slot ${booking.slot_id}? ₹${booking.total_amount.toFixed(2)} will be refunded.`)) {
      setIsProcessing(true);
      await cancelBooking(booking.id);
      setIsProcessing(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-cyan-500/40 shadow-glow-cyan relative overflow-hidden mb-8">
      {/* Background glowing sweep */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        
        {/* Left: Active session details */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1.5px] shadow-glow-cyan shrink-0">
            <div className="w-full h-full bg-navy-950 rounded-[14px] flex flex-col items-center justify-center">
              <span className="text-[10px] text-cyan-400 font-mono font-bold">SLOT</span>
              <span className="text-xl font-extrabold text-white font-mono tracking-tight">
                {booking.slot_id}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                ACTIVE RESERVATION
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {booking.zone}
              </span>
              {booking.ev_charging_opted && (
                <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  <Zap className="w-3 h-3 text-emerald-400" /> EV 22kW
                </span>
              )}
            </div>

            <div className="mt-1 flex items-baseline gap-3">
              <h3 className="text-lg font-bold text-white">
                Vehicle: <span className="font-mono text-cyan-300">{booking.vehicle_plate}</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Pass ID: {booking.id}
              </span>
            </div>

            <div className="mt-1 text-xs text-slate-400 flex items-center gap-4">
              <span>PIN: <strong className="font-mono text-emerald-400">{booking.entry_pin}</strong></span>
              <span>Paid: <strong className="text-slate-200">₹{booking.total_amount.toFixed(2)}</strong></span>
              <span>
                Status:{' '}
                <strong className={booking.actual_check_in ? 'text-emerald-400' : 'text-amber-400'}>
                  {booking.actual_check_in ? 'Vehicle Present (Checked In)' : 'Reserved (Awaiting Arrival)'}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Center: Countdown Timer & Progress Bar */}
        <div className="w-full lg:w-72 bg-navy-900/80 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {isOverstay ? 'TIME OVERSTAY' : 'TIME REMAINING'}
            </span>
            <span className={`font-mono font-bold ${isOverstay ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
              {timeLeftStr}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-navy-950 overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-500 ${
                isOverstay
                  ? 'bg-rose-500'
                  : percentRemaining < 25
                  ? 'bg-amber-400'
                  : 'bg-gradient-to-r from-cyan-400 to-emerald-400'
              }`}
              style={{ width: `${percentRemaining}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Start: {new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span>End: {new Date(booking.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          
          {/* View Pass & QR Code Button */}
          <button
            onClick={() => onOpenPass(booking)}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-semibold text-xs transition-all shadow-glow-cyan"
          >
            <QrCode className="w-4 h-4 text-cyan-400" />
            <span>Digital Pass</span>
          </button>

          {/* Check In / Barrier Open Action */}
          {!booking.actual_check_in ? (
            <button
              onClick={handleCheckIn}
              disabled={isProcessing}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-navy-950 font-bold text-xs transition-all shadow-glow-emerald disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Simulate Check In</span>
            </button>
          ) : (
            <button
              onClick={handleCheckOut}
              disabled={isProcessing}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-500/50 text-rose-300 font-bold text-xs transition-all shadow-glow-rose disabled:opacity-50"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Check Out & Release</span>
            </button>
          )}

          {/* Extend Button with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExtendMenu(!showExtendMenu)}
              className="px-3 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Extend</span>
            </button>

            {showExtendMenu && (
              <div className="absolute right-0 bottom-full mb-2 w-44 glass-panel rounded-xl p-2 border border-cyan-500/30 z-30 shadow-2xl">
                <div className="text-[10px] font-mono text-slate-400 px-2 py-1 uppercase">Extend Parking:</div>
                <button
                  onClick={() => handleExtend(1)}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-slate-200 hover:bg-navy-800 rounded-lg transition-colors flex items-center justify-between"
                >
                  <span>+ 1 Hour</span>
                  <span className="text-cyan-400 font-mono">+₹40.00</span>
                </button>
                <button
                  onClick={() => handleExtend(2)}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-slate-200 hover:bg-navy-800 rounded-lg transition-colors flex items-center justify-between"
                >
                  <span>+ 2 Hours</span>
                  <span className="text-cyan-400 font-mono">+₹80.00</span>
                </button>
                <button
                  onClick={() => handleExtend(4)}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-slate-200 hover:bg-navy-800 rounded-lg transition-colors flex items-center justify-between"
                >
                  <span>+ 4 Hours</span>
                  <span className="text-cyan-400 font-mono">+₹160.00</span>
                </button>
              </div>
            )}
          </div>

          {/* Cancel button (if not checked in yet) */}
          {!booking.actual_check_in && (
            <button
              onClick={handleCancel}
              title="Cancel reservation & refund"
              className="p-2.5 rounded-xl bg-navy-900 hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
