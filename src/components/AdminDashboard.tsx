import React, { useState } from 'react';
import { useParking } from '../context/ParkingContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { ParkingSlot, Booking, SlotStatus, SlotType } from '../types';
import { AnalyticsCharts } from './AnalyticsCharts';
import { 
  Shield, 
  Radio, 
  Settings, 
  Layers, 
  Users, 
  Database, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Zap, 
  Activity, 
  Edit3, 
  Trash2, 
  Search,
  Filter,
  LogOut,
  Sliders
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    slots, 
    bookings, 
    cloudMetrics, 
    recentTelemetry, 
    isSimulating, 
    simulationIntervalSec, 
    toggleSimulation, 
    setSimulationSpeed, 
    triggerManualSensorEvent, 
    updateSlotAdmin,
    checkInBooking,
    checkOutBooking,
    cancelBooking,
    resetToDefaultData
  } = useParking();

  const { currentUser } = useAuth();
  const { addToast } = useNotifications();

  // Admin sub-tabs
  const [adminTab, setAdminTab] = useState<'analytics' | 'slots' | 'bookings' | 'telemetry' | 'users'>('analytics');

  // Search & filter in tables
  const [slotSearch, setSlotSearch] = useState<string>('');
  const [bookingSearch, setBookingSearch] = useState<string>('');
  const [editingSlot, setEditingSlot] = useState<ParkingSlot | null>(null);

  // Edit slot modal/state
  const [editStatus, setEditStatus] = useState<SlotStatus>('available');
  const [editRate, setEditRate] = useState<number>(5.0);
  const [editType, setEditType] = useState<SlotType>('standard');

  const openSlotEdit = (slot: ParkingSlot) => {
    setEditingSlot(slot);
    setEditStatus(slot.status);
    setEditRate(slot.hourly_rate);
    setEditType(slot.type);
  };

  const handleSaveSlotEdit = async () => {
    if (!editingSlot) return;
    await updateSlotAdmin(editingSlot.id, {
      status: editStatus,
      hourly_rate: editRate,
      type: editType,
    });
    setEditingSlot(null);
  };

  // Filtered slots
  const filteredSlots = slots.filter((s) => {
    if (!slotSearch) return true;
    const q = slotSearch.toLowerCase();
    return s.id.toLowerCase().includes(q) || s.zone.toLowerCase().includes(q) || s.status.toLowerCase().includes(q);
  });

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    if (!bookingSearch) return true;
    const q = bookingSearch.toLowerCase();
    return (
      b.id.toLowerCase().includes(q) ||
      b.slot_id.toLowerCase().includes(q) ||
      b.vehicle_plate.toLowerCase().includes(q) ||
      b.user_name.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Admin Top Command Header */}
      <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30 shadow-glow-cyan">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1.5px] shadow-glow-cyan">
              <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">Cloud Command Control Room</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 uppercase font-bold">
                  SUPERVISOR ACCESS
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Operator: {currentUser?.full_name} • Cloudflare Edge • PostgreSQL Pub/Sub
              </p>
            </div>
          </div>

          {/* IoT Telemetry Simulation Master Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={toggleSimulation}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                isSimulating
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-glow-emerald'
                  : 'bg-amber-950 text-amber-300 border border-amber-500/50'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isSimulating ? 'animate-pulse text-emerald-400' : 'text-amber-400'}`} />
              <span>{isSimulating ? 'SIMULATOR ACTIVE' : 'SIMULATOR PAUSED'}</span>
            </button>

            {/* Frequency Selector */}
            <select
              value={simulationIntervalSec}
              onChange={(e) => setSimulationSpeed(Number(e.target.value))}
              className="bg-navy-900 border border-slate-800 text-xs text-slate-200 font-mono rounded-xl px-2.5 py-2 outline-none cursor-pointer"
            >
              <option value={5}>Freq: 5s (Fast)</option>
              <option value={10}>Freq: 10s</option>
              <option value={12}>Freq: 12s (Default)</option>
              <option value={20}>Freq: 20s</option>
              <option value={30}>Freq: 30s</option>
            </select>

            {/* Manual pulse button */}
            <button
              onClick={() => triggerManualSensorEvent()}
              className="px-3 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 border border-slate-700 text-cyan-400 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Trigger Event</span>
            </button>

            {/* Reset data */}
            <button
              onClick={resetToDefaultData}
              title="Reset all 60 slots and bookings to clean seed state"
              className="px-3 py-2 rounded-xl bg-navy-900 hover:bg-rose-950/40 border border-slate-700 text-slate-400 hover:text-rose-400 text-xs font-mono transition-colors"
            >
              Reset Seed
            </button>
          </div>

        </div>

        {/* Sub-tabs navigation */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { id: 'analytics', label: 'Analytics & KPIs', icon: Activity },
            { id: 'slots', label: 'Slot Fleet Management (60)', icon: Layers },
            { id: 'bookings', label: 'All Cloud Bookings', icon: CheckCircle },
            { id: 'telemetry', label: 'Live IoT Stream', icon: Radio },
            { id: 'users', label: 'Users & Roles', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                    : 'text-slate-400 hover:text-white hover:bg-navy-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-tab 1: Analytics */}
      {adminTab === 'analytics' && <AnalyticsCharts />}

      {/* Sub-tab 2: Slot Fleet Management Table */}
      {adminTab === 'slots' && (
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Parking Slot Fleet (A01 – C20)</h3>
              <p className="text-xs text-slate-400 font-mono">
                Override bay statuses, adjust dynamic pricing, and monitor sensor battery levels.
              </p>
            </div>

            <div className="relative sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search slot ID or zone..."
                value={slotSearch}
                onChange={(e) => setSlotSearch(e.target.value)}
                className="w-full bg-navy-900 border border-slate-800 text-xs text-white rounded-xl pl-8 pr-3 py-2 outline-none font-mono"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3">Slot ID</th>
                  <th className="py-2.5 px-3">Zone / Deck</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Current Status</th>
                  <th className="py-2.5 px-3">Hourly Rate (₹)</th>
                  <th className="py-2.5 px-3">IoT Hardware</th>
                  <th className="py-2.5 px-3">Battery</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredSlots.slice(0, 30).map((s) => (
                  <tr key={s.id} className="hover:bg-navy-900/40 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-white">{s.slot_number}</td>
                    <td className="py-2.5 px-3 text-slate-300">{s.zone}</td>
                    <td className="py-2.5 px-3 text-cyan-300 capitalize">{s.type.replace('_', ' ')}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        s.status === 'available' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' :
                        s.status === 'occupied' ? 'bg-rose-950 text-rose-400 border-rose-500/40' :
                        s.status === 'reserved' ? 'bg-amber-950 text-amber-400 border-amber-500/40' :
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-emerald-400">₹{s.hourly_rate.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-slate-400">{s.sensor_id}</td>
                    <td className="py-2.5 px-3 text-slate-300">{s.sensor_battery}%</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => openSlotEdit(s)}
                        className="px-2.5 py-1 rounded-lg bg-navy-900 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-500/40 text-cyan-300 transition-colors"
                      >
                        Edit / Override
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredSlots.length > 30 && (
            <p className="text-[11px] text-slate-500 font-mono text-center pt-2">
              Showing first 30 of {filteredSlots.length} bays. Use search bar to filter.
            </p>
          )}
        </div>
      )}

      {/* Sub-tab 3: Booking Management Table */}
      {adminTab === 'bookings' && (
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">All Active & Historical Reservations</h3>
              <p className="text-xs text-slate-400 font-mono">
                Audit cloud passes, force check-in/out, or cancel overstay bookings.
              </p>
            </div>

            <div className="relative sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search booking ID or plate..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="w-full bg-navy-900 border border-slate-800 text-xs text-white rounded-xl pl-8 pr-3 py-2 outline-none font-mono"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3">Pass ID</th>
                  <th className="py-2.5 px-3">Driver</th>
                  <th className="py-2.5 px-3">Slot</th>
                  <th className="py-2.5 px-3">Vehicle Plate</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Total Paid</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-navy-900/40 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-white">{b.id}</td>
                    <td className="py-2.5 px-3 text-slate-300">{b.user_name}</td>
                    <td className="py-2.5 px-3 font-bold text-cyan-300">{b.slot_id}</td>
                    <td className="py-2.5 px-3 text-white">{b.vehicle_plate}</td>
                    <td className="py-2.5 px-3 text-slate-400">{b.duration_hours}h</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">₹{b.total_amount.toFixed(2)}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        b.status === 'active' ? 'bg-cyan-950 text-cyan-400 border-cyan-500/40' :
                        b.status === 'completed' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' :
                        'bg-rose-950 text-rose-400 border-rose-500/40'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right space-x-1.5">
                      {b.status === 'active' && (
                        <>
                          {!b.actual_check_in ? (
                            <button
                              onClick={() => checkInBooking(b.id)}
                              className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900"
                            >
                              Check In
                            </button>
                          ) : (
                            <button
                              onClick={() => checkOutBooking(b.id)}
                              className="px-2 py-1 rounded bg-rose-950 text-rose-300 border border-rose-500/40 hover:bg-rose-900"
                            >
                              Check Out
                            </button>
                          )}
                          <button
                            onClick={() => cancelBooking(b.id)}
                            className="px-2 py-1 rounded bg-navy-900 text-slate-400 hover:text-rose-400 border border-slate-700"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 4: Live IoT Telemetry Stream */}
      {adminTab === 'telemetry' && (
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>Live Edge IoT Telemetry Stream</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Incoming LoRaWAN sensor payloads ingested from parking bays.
              </p>
            </div>
            <button
              onClick={() => triggerManualSensorEvent()}
              className="px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Simulate Packet</span>
            </button>
          </div>

          <div className="space-y-2">
            {recentTelemetry.map((tel) => (
              <div
                key={tel.id}
                className="p-3 rounded-xl bg-navy-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${
                    tel.event_type === 'OCCUPIED' ? 'bg-rose-500' :
                    tel.event_type === 'VACATED' ? 'bg-emerald-400' : 'bg-cyan-400'
                  } animate-ping`} />
                  <span className="font-bold text-white">{tel.slot_id}</span>
                  <span className="text-slate-400">({tel.sensor_id})</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    tel.event_type === 'OCCUPIED' ? 'bg-rose-950 text-rose-300' :
                    tel.event_type === 'VACATED' ? 'bg-emerald-950 text-emerald-300' : 'bg-cyan-950 text-cyan-300'
                  }`}>
                    {tel.event_type}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                  <span>Confidence: <strong className="text-emerald-400">{(tel.confidence_score * 100).toFixed(0)}%</strong></span>
                  <span>{new Date(tel.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 5: Users & Roles */}
      {adminTab === 'users' && (
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Registered Cloud Drivers & Admins</h3>
            <p className="text-xs text-slate-400 font-mono">
              Role-Based Access Control (RBAC) managed via Supabase Row-Level Security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-2xl bg-navy-900/70 border border-cyan-500/30">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-white">Dr. Elena Vance</h4>
                  <p className="text-xs text-cyan-400 font-mono">admin.elena@smartpark.cloud</p>
                  <p className="text-xs text-slate-400 mt-1">Vehicle: AUDI E-TRON GT (CLOUD-OPS-1)</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold uppercase">
                  ADMINISTRATOR
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Wallet: ₹2,500.00</span>
                <span className="text-emerald-400">Active Session</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-navy-900/70 border border-slate-800">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-white">Alex Mercer</h4>
                  <p className="text-xs text-slate-400 font-mono">alex.mercer@cybercity.edu</p>
                  <p className="text-xs text-slate-400 mt-1">Vehicle: TATA NEXON EV MAX (KA-01-EQ-7799)</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold uppercase">
                  DRIVER
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Wallet: ₹550.00</span>
                <span className="text-cyan-400">Active Reservation A04</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Edit Slot Modal */}
      {editingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-cyan-500/40 shadow-2xl">
            <h3 className="text-base font-extrabold text-white">
              Admin Override: Slot {editingSlot.id}
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Force update database state and push realtime event to all connected clients.
            </p>

            <div className="mt-4 space-y-3 text-xs font-mono">
              <div>
                <label className="block text-slate-300 uppercase mb-1">Status Override</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as SlotStatus)}
                  className="w-full bg-navy-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                >
                  <option value="available">Available (Free)</option>
                  <option value="occupied">Occupied (Simulate Vehicle)</option>
                  <option value="reserved">Reserved</option>
                  <option value="maintenance">Maintenance (Offline)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 uppercase mb-1">Hourly Rate (₹)</label>
                <input
                  type="number"
                  step="5"
                  value={editRate}
                  onChange={(e) => setEditRate(Number(e.target.value))}
                  className="w-full bg-navy-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 uppercase mb-1">Category Type</label>
                <select
                  value={editType}
                  onChange={(e) => setEditType(e.target.value as SlotType)}
                  className="w-full bg-navy-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                >
                  <option value="standard">Standard Bay</option>
                  <option value="ev_charging">EV Fast Charging</option>
                  <option value="vip">VIP Executive</option>
                  <option value="accessible">Accessible</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingSlot(null)}
                className="px-4 py-2 rounded-xl glass-panel text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSlotEdit}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-navy-950 text-xs font-bold font-mono shadow-glow-cyan"
              >
                Save & Broadcast Realtime
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
