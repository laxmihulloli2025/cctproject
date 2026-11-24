import { ParkingSlot, Booking, AppNotification, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr-demo-001',
  email: 'alex.mercer@cybercity.edu',
  full_name: 'Alex Mercer',
  role: 'user',
  phone: '+91 98765 43210',
  vehicle_plate: 'KA-01-EQ-7799',
  vehicle_model: 'Tata Nexon EV Max',
  wallet_balance: 550.00,
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
};

export const INITIAL_ADMIN: UserProfile = {
  id: 'adm-demo-999',
  email: 'admin.elena@smartpark.cloud',
  full_name: 'Dr. Elena Vance',
  role: 'admin',
  phone: '+91 98111 22233',
  vehicle_plate: 'DL-01-CLOUD-1',
  vehicle_model: 'Audi e-tron GT',
  wallet_balance: 2500.00,
  avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
  created_at: new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString(),
};

const SAMPLE_PLATES = [
  'KA-05-MH-2026', 'MH-02-EV-4412', 'DL-3C-TX-7819', 'TN-09-CA-5501', 'HR-26-WA-2390', 
  'KA-03-MA-8812', 'TS-08-OR-1940', 'GJ-01-CO-6721', 'UP-16-FL-9034', 'KL-07-NV-3129',
  'AP-10-AZ-8491', 'WB-02-IL-6023', 'CH-01-MI-4591', 'RJ-14-OH-1284', 'GA-03-TR-7832'
];

export const generateInitialSlots = (): ParkingSlot[] => {
  const slots: ParkingSlot[] = [];

  // Zone A: A01 to A20 (EV Fast Charging & VIP Deck)
  for (let i = 1; i <= 20; i++) {
    const id = `A${String(i).padStart(2, '0')}`;
    const isOccupied = [2, 5, 8, 14, 18].includes(i);
    const isReserved = [4, 11].includes(i);
    const isEv = i <= 10;
    const isVip = i > 10 && i <= 15;

    slots.push({
      id,
      lot_id: 'lot-skyline-central',
      zone: 'Zone A',
      slot_number: id,
      type: isEv ? 'ev_charging' : isVip ? 'vip' : 'standard',
      status: isOccupied ? 'occupied' : isReserved ? 'reserved' : 'available',
      floor: 1,
      hourly_rate: isEv ? 60.00 : isVip ? 80.00 : 50.00,
      sensor_id: `IOT-SN-${id}`,
      sensor_health: i === 18 ? 'degraded' : 'online',
      sensor_battery: Math.min(100, 92 + (i % 8)),
      last_heartbeat: new Date(Date.now() - (i * 12) * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      occupiedByPlate: isOccupied ? SAMPLE_PLATES[i % SAMPLE_PLATES.length] : undefined,
    });
  }

  // Zone B: B01 to B20 (Standard Fleet & Accessible)
  for (let i = 1; i <= 20; i++) {
    const id = `B${String(i).padStart(2, '0')}`;
    const isOccupied = [1, 4, 7, 12, 16, 19].includes(i);
    const isReserved = [6, 15].includes(i);
    const isAccessible = i <= 4;

    slots.push({
      id,
      lot_id: 'lot-skyline-central',
      zone: 'Zone B',
      slot_number: id,
      type: isAccessible ? 'accessible' : 'standard',
      status: isOccupied ? 'occupied' : isReserved ? 'reserved' : 'available',
      floor: 2,
      hourly_rate: 40.00,
      sensor_id: `IOT-SN-${id}`,
      sensor_health: 'online',
      sensor_battery: Math.min(100, 88 + (i % 12)),
      last_heartbeat: new Date(Date.now() - (i * 15) * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      occupiedByPlate: isOccupied ? SAMPLE_PLATES[(i + 4) % SAMPLE_PLATES.length] : undefined,
    });
  }

  // Zone C: C01 to C20 (Covered Smart Tier)
  for (let i = 1; i <= 20; i++) {
    const id = `C${String(i).padStart(2, '0')}`;
    const isOccupied = [3, 9, 13, 17, 20].includes(i);
    const isReserved = [8].includes(i);

    slots.push({
      id,
      lot_id: 'lot-skyline-central',
      zone: 'Zone C',
      slot_number: id,
      type: 'standard',
      status: isOccupied ? 'occupied' : isReserved ? 'reserved' : 'available',
      floor: 3,
      hourly_rate: 30.00,
      sensor_id: `IOT-SN-${id}`,
      sensor_health: i === 13 ? 'degraded' : 'online',
      sensor_battery: Math.min(100, 85 + (i % 14)),
      last_heartbeat: new Date(Date.now() - (i * 20) * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      occupiedByPlate: isOccupied ? SAMPLE_PLATES[(i + 8) % SAMPLE_PLATES.length] : undefined,
    });
  }

  return slots;
};

// Seed sample initial bookings
const now = Date.now();
export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'SPK-2026-8941',
    user_id: 'usr-demo-001',
    user_name: 'Alex Mercer',
    user_email: 'alex.mercer@cybercity.edu',
    slot_id: 'A04',
    zone: 'Zone A',
    vehicle_plate: 'KA-01-EQ-7799',
    vehicle_type: 'EV',
    start_time: new Date(now - 45 * 60 * 1000).toISOString(),
    end_time: new Date(now + 75 * 60 * 1000).toISOString(), // 75 mins left
    actual_check_in: new Date(now - 40 * 60 * 1000).toISOString(),
    actual_check_out: null,
    duration_hours: 2,
    total_amount: 170.00,
    ev_charging_opted: true,
    status: 'active',
    qr_pass_code: 'SPK-PASS-A04-8941-SECURE-HASH',
    entry_pin: '8492',
    created_at: new Date(now - 50 * 60 * 1000).toISOString(),
  },
  {
    id: 'SPK-2026-7712',
    user_id: 'usr-demo-001',
    user_name: 'Alex Mercer',
    user_email: 'alex.mercer@cybercity.edu',
    slot_id: 'B06',
    zone: 'Zone B',
    vehicle_plate: 'KA-01-EQ-7799',
    vehicle_type: 'EV',
    start_time: new Date(now - 26 * 3600 * 1000).toISOString(),
    end_time: new Date(now - 23 * 3600 * 1000).toISOString(),
    actual_check_in: new Date(now - 25 * 3600 * 1000).toISOString(),
    actual_check_out: new Date(now - 23 * 3600 * 1000).toISOString(),
    duration_hours: 3,
    total_amount: 120.00,
    ev_charging_opted: false,
    status: 'completed',
    qr_pass_code: 'SPK-PASS-B06-7712-SECURE-HASH',
    entry_pin: '1049',
    created_at: new Date(now - 27 * 3600 * 1000).toISOString(),
  },
  {
    id: 'SPK-2026-6204',
    user_id: 'usr-demo-001',
    user_name: 'Alex Mercer',
    user_email: 'alex.mercer@cybercity.edu',
    slot_id: 'C08',
    zone: 'Zone C',
    vehicle_plate: 'KA-01-EQ-7799',
    vehicle_type: 'EV',
    start_time: new Date(now - 74 * 3600 * 1000).toISOString(),
    end_time: new Date(now - 70 * 3600 * 1000).toISOString(),
    actual_check_in: new Date(now - 73 * 3600 * 1000).toISOString(),
    actual_check_out: new Date(now - 70 * 3600 * 1000).toISOString(),
    duration_hours: 4,
    total_amount: 120.00,
    ev_charging_opted: false,
    status: 'completed',
    qr_pass_code: 'SPK-PASS-C08-6204-SECURE-HASH',
    entry_pin: '5921',
    created_at: new Date(now - 75 * 3600 * 1000).toISOString(),
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    user_id: 'usr-demo-001',
    title: 'Slot A04 Active Session',
    message: 'Your EV is currently plugged in at Slot A04. Charging rate: 22 kW.',
    type: 'check_in',
    read: false,
    created_at: new Date(now - 38 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-2',
    user_id: 'usr-demo-001',
    title: 'Cloud Realtime Sync Active',
    message: 'Edge IoT sensor IOT-SN-A04 calibrated with 99.8% precision.',
    type: 'system',
    read: false,
    created_at: new Date(now - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-3',
    user_id: 'usr-demo-001',
    title: 'Past Reservation Receipt',
    message: 'Booking SPK-2026-7712 invoice ready. ₹120.00 deducted from Cloud Wallet.',
    type: 'booking',
    read: true,
    created_at: new Date(now - 23 * 3600 * 1000).toISOString(),
  }
];
