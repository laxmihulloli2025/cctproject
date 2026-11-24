import React, { useState } from 'react';
import { useParking } from '../context/ParkingContext';
import { useAuth } from '../context/AuthContext';
import { Booking, BookingStatus } from '../types';
import { 
  Layers, 
  Clock, 
  Calendar, 
  Car, 
  Zap, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  QrCode, 
  Download, 
  Search,
  Filter
} from 'lucide-react';

interface HistoryViewProps {
  onOpenPass: (booking: Booking) => void;
  onExploreSlots: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  onOpenPass,
  onExploreSlots,
}) => {
  const { bookings } = useParking();
  const { currentUser } = useAuth();

  const [filterStatus, setFilterStatus] = useState<'all' | BookingStatus>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // User's bookings
  const userBookings = bookings.filter((b) => {
    // If logged in as admin, show all or user's
    const isOwner = b.user_id === currentUser?.id || currentUser?.role === 'admin';
    if (!isOwner) return false;

    if (filterStatus !== 'all' && b.status !== filterStatus) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        b.id.toLowerCase().includes(q) ||
        b.slot_id.toLowerCase().includes(q) ||
        b.vehicle_plate.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalSpent = userBookings.reduce((sum, b) => (b.status !== 'cancelled' ? sum + b.total_amount : sum), 0);
  const totalHours = userBookings.reduce((sum, b) => (b.status !== 'cancelled' ? sum + b.duration_hours : sum), 0);

  return (
    <div className="space-y-6">
      
      {/* Header & Stats Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Smart Parking Sessions & Invoices</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Complete verifiable log of your barrier access, telemetry timestamps, and cloud receipts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-navy-900 border border-slate-800 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Sessions</span>
              <span className="text-base font-extrabold font-mono text-cyan-400">{userBookings.length}</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-navy-900 border border-slate-800 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Hours Parked</span>
              <span className="text-base font-extrabold font-mono text-emerald-400">{totalHours}h</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-navy-900 border border-slate-800 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Paid</span>
              <span className="text-base font-extrabold font-mono text-white">₹{totalSpent.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {(['all', 'active', 'completed', 'cancelled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold capitalize transition-all ${
                  filterStatus === status
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                    : 'bg-navy-900 text-slate-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="relative sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by pass, slot, plate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-navy-900 border border-slate-800 text-xs text-white rounded-xl pl-8 pr-3 py-2 outline-none font-mono focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {userBookings.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800">
          <Car className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No parking sessions found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            You haven't made any reservations matching this filter yet.
          </p>
          <button
            onClick={onExploreSlots}
            className="mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-navy-950 text-xs font-bold font-mono shadow-glow-cyan"
          >
            Find & Reserve a Slot
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {userBookings.map((b) => (
            <div
              key={b.id}
              className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* Left slot pill and details */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-navy-900 border border-slate-700 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] font-mono text-cyan-400 uppercase">SLOT</span>
                  <span className="text-base font-extrabold font-mono text-white">{b.slot_id}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white">
                      Pass #{b.id}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold border ${
                      b.status === 'active' ? 'bg-cyan-950 text-cyan-400 border-cyan-500/40' :
                      b.status === 'completed' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' :
                      'bg-rose-950 text-rose-400 border-rose-500/40'
                    }`}>
                      {b.status}
                    </span>
                    {b.ev_charging_opted && (
                      <span className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                        <Zap className="w-3 h-3" /> EV 22kW
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                    <span>Plate: <strong className="text-slate-200">{b.vehicle_plate}</strong></span>
                    <span>Zone: <strong className="text-slate-200">{b.zone}</strong></span>
                    <span>Duration: <strong className="text-slate-200">{b.duration_hours}h</strong></span>
                    <span>
                      Date: {new Date(b.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right price and pass action */}
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Amount</span>
                  <span className="text-base font-extrabold font-mono text-emerald-400">
                    ₹{b.total_amount.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => onOpenPass(b)}
                  className="px-3.5 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 border border-slate-700 hover:border-cyan-500/40 text-xs font-mono text-cyan-300 flex items-center gap-1.5 transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Pass / QR</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
