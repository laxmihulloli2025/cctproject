import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  ParkingSlot, 
  Booking, 
  SlotStatus, 
  VehicleType, 
  PaymentMethod, 
  CloudSystemMetrics,
  SensorTelemetryEvent 
} from '../types';
import { generateInitialSlots, INITIAL_BOOKINGS } from '../lib/mockData';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

interface ReserveSlotParams {
  slotId: string;
  vehiclePlate: string;
  vehicleType: VehicleType;
  durationHours: number;
  evCharging: boolean;
  paymentMethod: PaymentMethod;
}

interface ParkingContextType {
  slots: ParkingSlot[];
  bookings: Booking[];
  activeBooking: Booking | null;
  cloudMetrics: CloudSystemMetrics;
  recentTelemetry: SensorTelemetryEvent[];
  isSimulating: boolean;
  simulationIntervalSec: number;
  selectedZone: 'All' | 'Zone A' | 'Zone B' | 'Zone C';
  setSelectedZone: (zone: 'All' | 'Zone A' | 'Zone B' | 'Zone C') => void;
  reserveSlot: (params: ReserveSlotParams) => Promise<Booking | null>;
  checkInBooking: (bookingId: string) => Promise<boolean>;
  checkOutBooking: (bookingId: string) => Promise<boolean>;
  extendBooking: (bookingId: string, extraHours: number) => Promise<boolean>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
  updateSlotAdmin: (slotId: string, updates: Partial<ParkingSlot>) => Promise<boolean>;
  toggleSimulation: () => void;
  setSimulationSpeed: (seconds: number) => void;
  triggerManualSensorEvent: (slotId?: string) => void;
  resetToDefaultData: () => void;
  stats: {
    totalSlots: number;
    availableCount: number;
    occupiedCount: number;
    reservedCount: number;
    maintenanceCount: number;
    occupancyRate: number;
    evAvailableCount: number;
    estimatedRevenueToday: number;
  };
}

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export const ParkingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, topUpWallet } = useAuth();
  const { addToast, addNotification } = useNotifications();

  // Selected Zone filter
  const [selectedZone, setSelectedZone] = useState<'All' | 'Zone A' | 'Zone B' | 'Zone C'>('All');

  // Slots State
  const [slots, setSlots] = useState<ParkingSlot[]>(() => {
    const saved = localStorage.getItem('smartpark_slots');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return generateInitialSlots();
      }
    }
    return generateInitialSlots();
  });

  // Bookings State
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('smartpark_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_BOOKINGS;
      }
    }
    return INITIAL_BOOKINGS;
  });

  // IoT Simulation settings
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simulationIntervalSec, setSimulationIntervalSec] = useState<number>(12);

  // Cloud Telemetry and Edge Metrics
  const [cloudMetrics, setCloudMetrics] = useState<CloudSystemMetrics>({
    edgeLatencyMs: 18,
    replicationLagMs: 4,
    eventsProcessed: 42180,
    cloudHealthPercentage: 99.98,
    uptimeHours: 342,
    connectedSensorsCount: 60,
  });

  const [recentTelemetry, setRecentTelemetry] = useState<SensorTelemetryEvent[]>([
    {
      id: 'tel-1',
      slot_id: 'A04',
      sensor_id: 'IOT-SN-A04',
      event_type: 'OCCUPIED',
      confidence_score: 0.99,
      timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    },
    {
      id: 'tel-2',
      slot_id: 'B12',
      sensor_id: 'IOT-SN-B12',
      event_type: 'OCCUPIED',
      confidence_score: 0.98,
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: 'tel-3',
      slot_id: 'C03',
      sensor_id: 'IOT-SN-C03',
      event_type: 'HEARTBEAT',
      confidence_score: 1.0,
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    }
  ]);

  // Persist Slots & Bookings to localStorage
  useEffect(() => {
    localStorage.setItem('smartpark_slots', JSON.stringify(slots));
  }, [slots]);

  useEffect(() => {
    localStorage.setItem('smartpark_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Compute active booking for current user
  const activeBooking = bookings.find(
    (b) => b.user_id === currentUser?.id && b.status === 'active'
  ) || null;

  // Supabase Realtime Listener (when connected to real Supabase)
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Fetch initial slots from Supabase
    supabase.from('parking_slots').select('*').then(({ data, error }) => {
      if (!error && data && data.length > 0) {
        setSlots(data as ParkingSlot[]);
      }
    });

    // Realtime channel
    const channel = supabase
      .channel('smartpark_realtime_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'parking_slots' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            const updated = payload.new as ParkingSlot;
            setSlots((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookings((prev) => [payload.new as Booking, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Booking;
            setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Simulated IoT Sensor Engine (Fires every 10-15s)
  const triggerManualSensorEvent = useCallback((targetSlotId?: string) => {
    setSlots((prevSlots) => {
      // Find candidate slot (do not touch user's active booking slot)
      const protectedSlotId = activeBooking?.slot_id;
      const candidates = targetSlotId
        ? prevSlots.filter((s) => s.id === targetSlotId)
        : prevSlots.filter((s) => s.id !== protectedSlotId && s.status !== 'maintenance');

      if (candidates.length === 0) return prevSlots;

      // Pick a random slot
      const selected = candidates[Math.floor(Math.random() * candidates.length)];
      const isCurrentlyOccupied = selected.status === 'occupied';
      const newStatus: SlotStatus = isCurrentlyOccupied ? 'available' : 'occupied';

      const randomPlate = !isCurrentlyOccupied 
        ? `SIM-${Math.floor(100 + Math.random() * 900)}` 
        : undefined;

      const updatedSlots = prevSlots.map((s) => {
        if (s.id === selected.id) {
          return {
            ...s,
            status: newStatus,
            last_heartbeat: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            occupiedByPlate: randomPlate,
          };
        }
        return s;
      });

      // Telemetry log entry
      const eventType = newStatus === 'occupied' ? 'OCCUPIED' : 'VACATED';
      const newTelemetry: SensorTelemetryEvent = {
        id: `tel-${Date.now()}`,
        slot_id: selected.id,
        sensor_id: selected.sensor_id,
        event_type: eventType,
        confidence_score: Number((0.96 + Math.random() * 0.04).toFixed(2)),
        timestamp: new Date().toISOString(),
      };

      setRecentTelemetry((prev) => [newTelemetry, ...prev.slice(0, 9)]);

      // Update cloud metrics
      setCloudMetrics((prev) => ({
        ...prev,
        eventsProcessed: prev.eventsProcessed + 1,
        edgeLatencyMs: Math.floor(14 + Math.random() * 10),
        replicationLagMs: Math.floor(2 + Math.random() * 5),
      }));

      // Subtle toast in dashboard
      addToast(
        `IoT Sensor Update: Slot ${selected.id}`,
        `Sensor ${selected.sensor_id} reported: ${eventType} (${selected.zone})`,
        'sensor',
        3000
      );

      return updatedSlots;
    });
  }, [activeBooking?.slot_id, addToast]);

  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      triggerManualSensorEvent();
    }, simulationIntervalSec * 1000);

    return () => clearInterval(interval);
  }, [isSimulating, simulationIntervalSec, triggerManualSensorEvent]);

  // Reserve a Slot
  const reserveSlot = async ({
    slotId,
    vehiclePlate,
    vehicleType,
    durationHours,
    evCharging,
    paymentMethod,
  }: ReserveSlotParams): Promise<Booking | null> => {
    const targetSlot = slots.find((s) => s.id === slotId);
    if (!targetSlot || targetSlot.status !== 'available') {
      addToast('Slot Unavailable', `Slot ${slotId} is no longer available.`, 'error');
      return null;
    }

    const hourlyRate = targetSlot.hourly_rate;
    const evFee = evCharging ? 25.00 * durationHours : 0;
    const totalAmount = Number((hourlyRate * durationHours + evFee).toFixed(2));

    // Check Cloud Wallet balance if paid with wallet
    if (paymentMethod === 'Cloud Wallet' && currentUser) {
      if (currentUser.wallet_balance < totalAmount) {
        addToast(
          'Insufficient Cloud Balance',
          `Your wallet balance (₹${currentUser.wallet_balance.toFixed(2)}) is less than required (₹${totalAmount.toFixed(2)}). Please top up.`,
          'warning'
        );
        return null;
      }
      // Deduct balance
      topUpWallet(-totalAmount);
    }

    const bookingId = `SPK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const pin = String(Math.floor(1000 + Math.random() * 9000));
    const nowIso = new Date().toISOString();
    const endIso = new Date(Date.now() + durationHours * 3600 * 1000).toISOString();

    const newBooking: Booking = {
      id: bookingId,
      user_id: currentUser?.id || 'usr-guest',
      user_name: currentUser?.full_name || 'Guest Driver',
      user_email: currentUser?.email || 'guest@smartpark.io',
      slot_id: slotId,
      zone: targetSlot.zone,
      vehicle_plate: vehiclePlate || currentUser?.vehicle_plate || 'CA-9999',
      vehicle_type: vehicleType,
      start_time: nowIso,
      end_time: endIso,
      actual_check_in: nowIso, // Initial simulated auto-arrival
      actual_check_out: null,
      duration_hours: durationHours,
      total_amount: totalAmount,
      ev_charging_opted: evCharging,
      status: 'active',
      qr_pass_code: `SPK-PASS-${slotId}-${bookingId}-${pin}`,
      entry_pin: pin,
      created_at: nowIso,
    };

    // Update slot status to reserved/occupied
    setSlots((prev) =>
      prev.map((s) =>
        s.id === slotId
          ? {
              ...s,
              status: 'reserved',
              occupiedByPlate: newBooking.vehicle_plate,
              updated_at: nowIso,
            }
          : s
      )
    );

    // Save booking
    setBookings((prev) => [newBooking, ...prev]);

    // If Supabase is connected
    if (isSupabaseConfigured) {
      supabase.from('parking_slots').update({ status: 'reserved' }).eq('id', slotId).then();
      supabase.from('bookings').insert([newBooking]).then();
    }

    addNotification(
      `Slot ${slotId} Reserved Successfully`,
      `Pass #${bookingId} issued for ${vehiclePlate} (${durationHours}h). Entry PIN: ${pin}`,
      'booking'
    );

    return newBooking;
  };

  // Check In to an active booking
  const checkInBooking = async (bookingId: string): Promise<boolean> => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return false;

    const checkInTime = new Date().toISOString();

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, actual_check_in: checkInTime } : b
      )
    );

    setSlots((prev) =>
      prev.map((s) =>
        s.id === booking.slot_id
          ? { ...s, status: 'occupied', updated_at: checkInTime }
          : s
      )
    );

    if (isSupabaseConfigured) {
      supabase.from('bookings').update({ actual_check_in: checkInTime }).eq('id', bookingId).then();
      supabase.from('parking_slots').update({ status: 'occupied' }).eq('id', booking.slot_id).then();
    }

    addNotification(
      `Checked In at Slot ${booking.slot_id}`,
      `RFID barrier opened. Vehicle ${booking.vehicle_plate} verified. Enjoy your stay!`,
      'check_in'
    );

    return true;
  };

  // Check Out from active booking
  const checkOutBooking = async (bookingId: string): Promise<boolean> => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return false;

    const checkOutTime = new Date().toISOString();

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, status: 'completed', actual_check_out: checkOutTime }
          : b
      )
    );

    setSlots((prev) =>
      prev.map((s) =>
        s.id === booking.slot_id
          ? { ...s, status: 'available', occupiedByPlate: undefined, updated_at: checkOutTime }
          : s
      )
    );

    if (isSupabaseConfigured) {
      supabase
        .from('bookings')
        .update({ status: 'completed', actual_check_out: checkOutTime })
        .eq('id', bookingId)
        .then();
      supabase
        .from('parking_slots')
        .update({ status: 'available' })
        .eq('id', booking.slot_id)
        .then();
    }

    addNotification(
      `Checked Out from Slot ${booking.slot_id}`,
      `Gate exit sensor confirmed vehicle ${booking.vehicle_plate} departure. Thank you for using SmartPark Cloud!`,
      'check_out'
    );

    return true;
  };

  // Extend duration
  const extendBooking = async (bookingId: string, extraHours: number): Promise<boolean> => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return false;

    const currentEnd = new Date(booking.end_time).getTime();
    const newEnd = new Date(currentEnd + extraHours * 3600 * 1000).toISOString();
    const targetSlot = slots.find((s) => s.id === booking.slot_id);
    const hourly = targetSlot?.hourly_rate || 5.0;
    const additionalCost = Number((hourly * extraHours).toFixed(2));

    if (currentUser && currentUser.wallet_balance < additionalCost) {
      addToast('Insufficient Balance', 'Please top up your wallet to extend reservation.', 'warning');
      return false;
    }

    if (currentUser) {
      topUpWallet(-additionalCost);
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              end_time: newEnd,
              duration_hours: b.duration_hours + extraHours,
              total_amount: Number((b.total_amount + additionalCost).toFixed(2)),
            }
          : b
      )
    );

    addNotification(
      `Booking Extended (+${extraHours}h)`,
      `Slot ${booking.slot_id} reservation extended. New end time: ${new Date(newEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      'booking'
    );

    return true;
  };

  // Cancel booking
  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return false;

    // Refund
    if (currentUser) {
      topUpWallet(booking.total_amount);
    }

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );

    setSlots((prev) =>
      prev.map((s) =>
        s.id === booking.slot_id
          ? { ...s, status: 'available', occupiedByPlate: undefined }
          : s
      )
    );

    addNotification(
      `Booking Cancelled`,
      `Reservation for Slot ${booking.slot_id} cancelled. ₹${booking.total_amount.toFixed(2)} refunded to Cloud Wallet.`,
      'alert'
    );

    return true;
  };

  // Admin update slot
  const updateSlotAdmin = async (slotId: string, updates: Partial<ParkingSlot>): Promise<boolean> => {
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, ...updates, updated_at: new Date().toISOString() } : s))
    );

    if (isSupabaseConfigured) {
      supabase.from('parking_slots').update(updates).eq('id', slotId).then();
    }

    addToast('Admin Override Applied', `Slot ${slotId} updated.`, 'info');
    return true;
  };

  const toggleSimulation = () => {
    setIsSimulating((prev) => {
      const next = !prev;
      addToast(
        next ? 'IoT Simulation Activated' : 'IoT Simulation Paused',
        next
          ? `Sensors will simulate slot traffic every ${simulationIntervalSec}s.`
          : 'Live sensor auto-updates paused.',
        'info'
      );
      return next;
    });
  };

  const setSimulationSpeed = (sec: number) => {
    setSimulationIntervalSec(sec);
    addToast('Simulation Frequency Adjusted', `Telemetry heartbeat set to ${sec} seconds.`, 'info');
  };

  const resetToDefaultData = () => {
    localStorage.removeItem('smartpark_slots');
    localStorage.removeItem('smartpark_bookings');
    setSlots(generateInitialSlots());
    setBookings(INITIAL_BOOKINGS);
    addToast('Reset Complete', 'Restored pristine 60-slot seed dataset.', 'success');
  };

  // Computed aggregate stats
  const totalSlots = slots.length;
  const availableCount = slots.filter((s) => s.status === 'available').length;
  const occupiedCount = slots.filter((s) => s.status === 'occupied').length;
  const reservedCount = slots.filter((s) => s.status === 'reserved').length;
  const maintenanceCount = slots.filter((s) => s.status === 'maintenance').length;
  const occupancyRate = totalSlots > 0 ? Math.round(((occupiedCount + reservedCount) / totalSlots) * 100) : 0;
  const evAvailableCount = slots.filter((s) => s.type === 'ev_charging' && s.status === 'available').length;
  
  const estimatedRevenueToday = bookings.reduce((sum, b) => {
    if (b.status === 'active' || b.status === 'completed') {
      return sum + b.total_amount;
    }
    return sum;
  }, 4850.00);

  return (
    <ParkingContext.Provider
      value={{
        slots,
        bookings,
        activeBooking,
        cloudMetrics,
        recentTelemetry,
        isSimulating,
        simulationIntervalSec,
        selectedZone,
        setSelectedZone,
        reserveSlot,
        checkInBooking,
        checkOutBooking,
        extendBooking,
        cancelBooking,
        updateSlotAdmin,
        toggleSimulation,
        setSimulationSpeed,
        triggerManualSensorEvent,
        resetToDefaultData,
        stats: {
          totalSlots,
          availableCount,
          occupiedCount,
          reservedCount,
          maintenanceCount,
          occupancyRate,
          evAvailableCount,
          estimatedRevenueToday,
        },
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};
