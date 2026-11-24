import React, { useState, useMemo } from 'react';
import { useParking } from '../context/ParkingContext';
import { ParkingSlot, SlotZone, SlotStatus, SlotType } from '../types';
import { SlotCard } from './SlotCard';
import { 
  Search, 
  Filter, 
  Layers, 
  Zap, 
  CheckCircle2, 
  Radio, 
  RefreshCw, 
  Info,
  Car
} from 'lucide-react';

interface ParkingGridProps {
  onSelectSlot: (slot: ParkingSlot) => void;
  onDirectBook: (slot: ParkingSlot) => void;
  selectedSlot: ParkingSlot | null;
}

export const ParkingGrid: React.FC<ParkingGridProps> = ({
  onSelectSlot,
  onDirectBook,
  selectedSlot,
}) => {
  const { slots, activeBooking, triggerManualSensorEvent, isSimulating } = useParking();

  // Filters state
  const [activeZone, setActiveZone] = useState<'All' | SlotZone>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | SlotStatus>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | SlotType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtered slots calculation
  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => {
      // Zone match
      if (activeZone !== 'All' && slot.zone !== activeZone) {
        return false;
      }
      // Status match
      if (statusFilter !== 'all' && slot.status !== statusFilter) {
        return false;
      }
      // Type match
      if (typeFilter !== 'all' && slot.type !== typeFilter) {
        return false;
      }
      // Search query (e.g. "A04", "B", "04")
      if (searchQuery.trim() !== '') {
        const query = searchQuery.trim().toLowerCase();
        const matchesNumber = slot.slot_number.toLowerCase().includes(query);
        const matchesPlate = slot.occupiedByPlate?.toLowerCase().includes(query);
        const matchesZone = slot.zone.toLowerCase().includes(query);
        if (!matchesNumber && !matchesPlate && !matchesZone) {
          return false;
        }
      }
      return true;
    });
  }, [slots, activeZone, statusFilter, typeFilter, searchQuery]);

  // Zone specific counts
  const zoneStats = useMemo(() => {
    const currentPool = activeZone === 'All' ? slots : slots.filter((s) => s.zone === activeZone);
    const available = currentPool.filter((s) => s.status === 'available').length;
    const occupied = currentPool.filter((s) => s.status === 'occupied').length;
    const reserved = currentPool.filter((s) => s.status === 'reserved').length;
    const evReady = currentPool.filter((s) => s.type === 'ev_charging' && s.status === 'available').length;
    return { available, occupied, reserved, evReady, total: currentPool.length };
  }, [slots, activeZone]);

  return (
    <div className="space-y-6">
      
      {/* Control Bar: Zone Tabs + Search + Action */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Zone Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-navy-900 border border-slate-800 overflow-x-auto scrollbar-none">
            {(['All', 'Zone A', 'Zone B', 'Zone C'] as const).map((zone) => {
              const isActive = activeZone === zone;
              return (
                <button
                  key={zone}
                  onClick={() => setActiveZone(zone)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-navy-950 shadow-glow-cyan'
                      : 'text-slate-400 hover:text-white hover:bg-navy-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>
                    {zone === 'All'
                      ? 'All Zones (60)'
                      : zone === 'Zone A'
                      ? 'Zone A: EV & VIP (A01–A20)'
                      : zone === 'Zone B'
                      ? 'Zone B: Fleet (B01–B20)'
                      : 'Zone C: Covered (C01–C20)'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box & Manual Sensor Trigger */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search slot (e.g. A04, B12)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-navy-900 border border-slate-800 focus:border-cyan-400 text-xs text-white rounded-xl pl-9 pr-3 py-2 outline-none transition-colors placeholder:text-slate-500 font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  ×
                </button>
              )}
            </div>

            <button
              onClick={() => triggerManualSensorEvent()}
              title="Simulate random IoT vehicle arrival/departure"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-navy-900 border border-slate-800 hover:border-cyan-500/40 text-cyan-400 text-xs font-mono flex items-center gap-1.5 transition-all hover:bg-navy-800 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5 hover:rotate-180 transition-transform" />
              <span className="hidden sm:inline">Simulate Sensor Event</span>
            </button>
          </div>

        </div>

        {/* Filter Pills & Legend Row */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Status & Type Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px] font-mono uppercase mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyan-400" /> Filter:
            </span>

            {/* Status pills */}
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all ${
                statusFilter === 'all'
                  ? 'bg-slate-700 text-white'
                  : 'bg-navy-900 text-slate-400 hover:text-white'
              }`}
            >
              All Status
            </button>

            <button
              onClick={() => setStatusFilter('available')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all flex items-center gap-1.5 ${
                statusFilter === 'available'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-glow-emerald'
                  : 'bg-navy-900 text-slate-400 hover:text-emerald-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Available ({zoneStats.available})</span>
            </button>

            <button
              onClick={() => setStatusFilter('occupied')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all flex items-center gap-1.5 ${
                statusFilter === 'occupied'
                  ? 'bg-rose-950 text-rose-300 border border-rose-500/50'
                  : 'bg-navy-900 text-slate-400 hover:text-rose-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>Occupied ({zoneStats.occupied})</span>
            </button>

            <button
              onClick={() => setStatusFilter('reserved')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all flex items-center gap-1.5 ${
                statusFilter === 'reserved'
                  ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                  : 'bg-navy-900 text-slate-400 hover:text-amber-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Reserved ({zoneStats.reserved})</span>
            </button>

            <div className="h-4 w-[1px] bg-slate-800 mx-1 hidden sm:block" />

            {/* EV Only pill */}
            <button
              onClick={() => setTypeFilter(typeFilter === 'ev_charging' ? 'all' : 'ev_charging')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all flex items-center gap-1 ${
                typeFilter === 'ev_charging'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-glow-cyan'
                  : 'bg-navy-900 text-slate-400 hover:text-cyan-400'
              }`}
            >
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>EV Ready ({zoneStats.evReady})</span>
            </button>
          </div>

          {/* Color Legend */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-glow-emerald" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Occupied</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Reserved</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-glow-cyan" />
              <span>Your Spot</span>
            </div>
          </div>

        </div>

      </div>

      {/* Grid Status Banner */}
      <div className="flex items-center justify-between text-xs px-2">
        <div className="flex items-center gap-2 text-slate-400 font-mono">
          <Car className="w-4 h-4 text-cyan-400" />
          <span>
            Displaying <strong className="text-white">{filteredSlots.length}</strong> of{' '}
            <strong className="text-white">{slots.length}</strong> smart bays
          </span>
          {activeZone !== 'All' && (
            <span className="text-cyan-400 font-bold">• {activeZone}</span>
          )}
        </div>

        <div className="text-[11px] text-slate-500 font-mono hidden sm:block">
          Click any bay for telemetry & sensor diagnostics
        </div>
      </div>

      {/* Parking Bays Grid Display */}
      {filteredSlots.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800">
          <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-white">No parking bays match your filter</h4>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search query, zone, or status filters.
          </p>
          <button
            onClick={() => {
              setActiveZone('All');
              setStatusFilter('all');
              setTypeFilter('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-navy-900 border border-slate-700 text-xs font-mono text-cyan-400 hover:bg-navy-800"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {filteredSlots.map((slot) => {
            const isUsersBooking = activeBooking?.slot_id === slot.id;
            const isSelected = selectedSlot?.id === slot.id;

            return (
              <SlotCard
                key={slot.id}
                slot={slot}
                isSelected={isSelected}
                isUsersBooking={isUsersBooking}
                onSelectSlot={onSelectSlot}
                onDirectBook={onDirectBook}
              />
            );
          })}
        </div>
      )}

    </div>
  );
};
