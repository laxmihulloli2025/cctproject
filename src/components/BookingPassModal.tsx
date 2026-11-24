import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Booking } from '../types';
import { useParking } from '../context/ParkingContext';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Car, 
  Zap, 
  MapPin, 
  Share2, 
  Download,
  KeyRound
} from 'lucide-react';

interface BookingPassModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const BookingPassModal: React.FC<BookingPassModalProps> = ({
  booking,
  onClose,
}) => {
  const { checkInBooking } = useParking();

  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCheckInNow = async () => {
    await checkInBooking(booking.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md animate-in fade-in">
      <div 
        className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-7 border border-cyan-500/40 shadow-2xl relative overflow-hidden print:p-0 print:border-none print:shadow-none print:bg-white print:text-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Neon Glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 rounded-full blur-3xl pointer-events-none print:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-extrabold text-white font-mono uppercase tracking-wider">
              Smart Parking Digital Pass
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-navy-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Digital Boarding Pass Ticket */}
        <div className="mt-4 bg-navy-900/90 rounded-2xl border border-slate-800 p-5 relative overflow-hidden print:bg-white print:text-black print:border-gray-300">
          
          {/* Top Notch Barcode Ticket Header */}
          <div className="flex items-start justify-between border-b border-dashed border-slate-700/80 pb-4">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest block uppercase print:text-blue-600">
                SMARTPARK CLOUD PASS
              </span>
              <h2 className="text-xl font-extrabold text-white print:text-black font-mono">
                {booking.slot_id}
              </h2>
              <p className="text-xs text-slate-400 print:text-gray-600 font-mono">
                {booking.zone} • Level {booking.slot_id.startsWith('A') ? '1' : booking.slot_id.startsWith('B') ? '2' : '3'}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">PASS ID</span>
              <span className="text-xs font-mono font-bold text-white print:text-black">
                {booking.id}
              </span>
              <div className="mt-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30 print:bg-green-100 print:text-green-800">
                  CONFIRMED
                </span>
              </div>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="my-5 flex flex-col items-center justify-center">
            <div className="p-3 rounded-2xl bg-white shadow-lg border-2 border-cyan-400 print:border-black">
              <QRCodeSVG
                value={booking.qr_pass_code}
                size={160}
                level="H"
                includeMargin={false}
              />
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-2 print:text-gray-600 text-center">
              Scan at Barrier Gate or Scan on Mobile App
            </p>
          </div>

          {/* Ticket Information Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-3 border-t border-dashed border-slate-700/80 print:border-gray-300">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">VEHICLE PLATE</span>
              <span className="font-bold text-white print:text-black text-sm">
                {booking.vehicle_plate}
              </span>
              <span className="text-[11px] text-slate-400 block">{booking.vehicle_type}</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase block">GATE ENTRY PIN</span>
              <span className="font-extrabold text-emerald-400 print:text-green-700 text-base flex items-center justify-end gap-1">
                <KeyRound className="w-3.5 h-3.5" />
                {booking.entry_pin}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase block">VALID FROM</span>
              <span className="text-slate-200 print:text-black">
                {new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase block">VALID UNTIL</span>
              <span className="text-slate-200 print:text-black">
                {new Date(booking.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Direction notes */}
          <div className="mt-4 p-2.5 rounded-xl bg-navy-950/60 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-2 print:bg-gray-100 print:text-gray-800">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Follow Neon Bay Markers to Section {booking.slot_id.slice(0, 1)}. Gate barrier auto-opens on QR scan.</span>
          </div>

        </div>

        {/* Pass Actions (Hidden in Print) */}
        <div className="mt-5 flex items-center justify-between gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 border border-slate-700 text-xs text-slate-200 font-mono transition-colors"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Print Pass</span>
          </button>

          {!booking.actual_check_in ? (
            <button
              onClick={handleCheckInNow}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-navy-950 text-xs font-bold font-mono shadow-glow-emerald transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simulate Check In</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold font-mono transition-colors"
            >
              Done / Return
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
