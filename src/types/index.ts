export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  vehicle_plate?: string;
  vehicle_model?: string;
  wallet_balance: number;
  avatar_url?: string;
  created_at?: string;
}

export type SlotZone = 'Zone A' | 'Zone B' | 'Zone C';
export type SlotType = 'standard' | 'ev_charging' | 'vip' | 'accessible';
export type SlotStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

export interface ParkingSlot {
  id: string;
  lot_id: string;
  zone: SlotZone;
  slot_number: string;
  type: SlotType;
  status: SlotStatus;
  floor: number;
  hourly_rate: number;
  sensor_id: string;
  sensor_health: 'online' | 'degraded' | 'offline';
  sensor_battery: number;
  last_heartbeat: string;
  updated_at: string;
  occupiedByPlate?: string;
}

export type VehicleType = 'Sedan' | 'SUV' | 'EV' | 'Motorcycle';
export type BookingStatus = 'active' | 'completed' | 'cancelled' | 'overstay';

export interface Booking {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  slot_id: string;
  zone: SlotZone;
  vehicle_plate: string;
  vehicle_type: VehicleType;
  start_time: string;
  end_time: string;
  actual_check_in?: string | null;
  actual_check_out?: string | null;
  duration_hours: number;
  total_amount: number;
  ev_charging_opted: boolean;
  status: BookingStatus;
  qr_pass_code: string;
  entry_pin: string;
  created_at: string;
}

export type PaymentMethod = 'Cloud Wallet' | 'Credit Card' | 'Apple Pay' | 'RFID Fastag';

export interface Payment {
  id: string;
  booking_id: string;
  user_id: string;
  amount: number;
  method: PaymentMethod;
  status: 'completed' | 'refunded' | 'pending';
  transaction_ref: string;
  created_at: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'booking' | 'check_in' | 'check_out' | 'alert' | 'system';
  read: boolean;
  created_at: string;
}

export interface SensorTelemetryEvent {
  id: string;
  slot_id: string;
  sensor_id: string;
  event_type: 'OCCUPIED' | 'VACATED' | 'HEARTBEAT' | 'ANOMALY';
  confidence_score: number;
  timestamp: string;
}

export interface CloudSystemMetrics {
  edgeLatencyMs: number;
  replicationLagMs: number;
  eventsProcessed: number;
  cloudHealthPercentage: number;
  uptimeHours: number;
  connectedSensorsCount: number;
}
