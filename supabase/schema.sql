-- ====================================================================
-- SmartPark Cloud — Smart Cloud Parking Management System
-- PostgreSQL & Supabase Database Schema
-- Designed for Cloud Computing Technology College Presentation & Demo
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked with Supabase Auth or Demo users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    phone TEXT,
    vehicle_plate TEXT,
    vehicle_model TEXT,
    wallet_balance NUMERIC(10, 2) NOT NULL DEFAULT 500.00,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PARKING LOTS TABLE
CREATE TABLE IF NOT EXISTS public.parking_lots (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    total_slots INT NOT NULL DEFAULT 60,
    hourly_rate NUMERIC(10, 2) NOT NULL DEFAULT 40.00,
    ev_charging_rate NUMERIC(10, 2) NOT NULL DEFAULT 25.00,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'maintenance', 'closed')),
    latitude DOUBLE PRECISION DEFAULT 12.9716,
    longitude DOUBLE PRECISION DEFAULT 77.5946,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PARKING SLOTS TABLE (60 slots: A01-A20, B01-B20, C01-C20)
CREATE TABLE IF NOT EXISTS public.parking_slots (
    id TEXT PRIMARY KEY,
    lot_id TEXT REFERENCES public.parking_lots(id) ON DELETE CASCADE,
    zone TEXT NOT NULL CHECK (zone IN ('Zone A', 'Zone B', 'Zone C')),
    slot_number TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'standard' CHECK (type IN ('standard', 'ev_charging', 'vip', 'accessible')),
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved', 'maintenance')),
    floor INT NOT NULL DEFAULT 1,
    hourly_rate NUMERIC(10, 2) NOT NULL DEFAULT 40.00,
    sensor_id TEXT NOT NULL,
    sensor_health TEXT NOT NULL DEFAULT 'online' CHECK (sensor_health IN ('online', 'degraded', 'offline')),
    sensor_battery INT NOT NULL DEFAULT 98,
    last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    slot_id TEXT REFERENCES public.parking_slots(id) ON DELETE RESTRICT,
    zone TEXT NOT NULL,
    vehicle_plate TEXT NOT NULL,
    vehicle_type TEXT NOT NULL DEFAULT 'Sedan' CHECK (vehicle_type IN ('Sedan', 'SUV', 'EV', 'Motorcycle')),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    actual_check_in TIMESTAMPTZ,
    actual_check_out TIMESTAMPTZ,
    duration_hours INT NOT NULL DEFAULT 2,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 10.00,
    ev_charging_opted BOOLEAN DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'overstay')),
    qr_pass_code TEXT NOT NULL,
    entry_pin TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PAYMENTS TABLE (Simulated Cloud Billing)
CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY,
    booking_id TEXT REFERENCES public.bookings(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    method TEXT NOT NULL CHECK (method IN ('Cloud Wallet', 'Credit Card', 'Apple Pay', 'RFID Fastag')),
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'refunded', 'pending')),
    transaction_ref TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'booking' CHECK (type IN ('booking', 'check_in', 'check_out', 'alert', 'system')),
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SENSOR TELEMETRY LOGS (IoT Cloud Ingestion)
CREATE TABLE IF NOT EXISTS public.sensor_telemetry_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slot_id TEXT REFERENCES public.parking_slots(id) ON DELETE CASCADE,
    sensor_id TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('OCCUPIED', 'VACATED', 'HEARTBEAT', 'ANOMALY', 'CALIBRATION')),
    confidence_score NUMERIC(3, 2) DEFAULT 0.99,
    raw_payload JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parking_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parking_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_telemetry_logs ENABLE ROW LEVEL SECURITY;

-- Parking Lots & Slots: Public read for all users, Admin write
CREATE POLICY "Public Read Parking Lots" ON public.parking_lots FOR SELECT USING (true);
CREATE POLICY "Public Read Parking Slots" ON public.parking_slots FOR SELECT USING (true);
CREATE POLICY "Admin Modify Parking Slots" ON public.parking_slots FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Bookings: Users read their own bookings, Admins read all
CREATE POLICY "User Read Own Bookings" ON public.bookings FOR SELECT USING (
    auth.uid()::text = user_id OR
    auth.jwt() ->> 'role' = 'admin' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "User Create Booking" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "User Update Booking" ON public.bookings FOR UPDATE USING (
    auth.uid()::text = user_id OR
    auth.jwt() ->> 'role' = 'admin' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Profiles: Users manage their profile, Admins read all
CREATE POLICY "User Read Own Profile" ON public.profiles FOR SELECT USING (
    auth.uid() = id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "User Update Own Profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Notifications: User read their notifications
CREATE POLICY "User Read Notifications" ON public.notifications FOR SELECT USING (
    auth.uid()::text = user_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- ====================================================================
-- REALTIME SUBSCRIPTIONS
-- ====================================================================

-- Add tables to supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.parking_slots;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- ====================================================================
-- SEED DATA: 60 SLOTS (Zone A: EV/VIP, Zone B: Standard, Zone C: Covered)
-- ====================================================================

-- Seed primary parking lot
INSERT INTO public.parking_lots (id, name, location, total_slots, hourly_rate, ev_charging_rate, status)
VALUES ('lot-skyline-central', 'Skyline Cloud Smart Deck', 'Cyber Hub, Tech Corridor', 60, 40.00, 25.00, 'open')
ON CONFLICT (id) DO NOTHING;

-- Function to generate slots
DO $$
DECLARE
    i INT;
    slot_id_str TEXT;
BEGIN
    -- Zone A: Slots A01 to A20 (Level 1 - EV & VIP)
    FOR i IN 1..20 LOOP
        slot_id_str := 'A' || LPAD(i::TEXT, 2, '0');
        INSERT INTO public.parking_slots (
            id, lot_id, zone, slot_number, type, status, floor, hourly_rate, sensor_id, sensor_health, sensor_battery
        ) VALUES (
            slot_id_str,
            'lot-skyline-central',
            'Zone A',
            slot_id_str,
            CASE 
                WHEN i <= 10 THEN 'ev_charging'
                WHEN i <= 15 THEN 'vip'
                ELSE 'standard'
            END,
            CASE 
                WHEN i IN (2, 5, 8, 14) THEN 'occupied'
                WHEN i IN (3, 11) THEN 'reserved'
                ELSE 'available'
            END,
            1,
            CASE WHEN i <= 10 THEN 60.00 WHEN i <= 15 THEN 80.00 ELSE 50.00 END,
            'IOT-SN-' || slot_id_str,
            'online',
            95 + (i % 5)
        ) ON CONFLICT (id) DO NOTHING;
    END LOOP;

    -- Zone B: Slots B01 to B20 (Level 2 - Standard Fleet)
    FOR i IN 1..20 LOOP
        slot_id_str := 'B' || LPAD(i::TEXT, 2, '0');
        INSERT INTO public.parking_slots (
            id, lot_id, zone, slot_number, type, status, floor, hourly_rate, sensor_id, sensor_health, sensor_battery
        ) VALUES (
            slot_id_str,
            'lot-skyline-central',
            'Zone B',
            slot_id_str,
            CASE WHEN i <= 4 THEN 'accessible' ELSE 'standard' END,
            CASE 
                WHEN i IN (1, 4, 7, 12, 16, 19) THEN 'occupied'
                WHEN i IN (6, 15) THEN 'reserved'
                ELSE 'available'
            END,
            2,
            40.00,
            'IOT-SN-' || slot_id_str,
            'online',
            90 + (i % 9)
        ) ON CONFLICT (id) DO NOTHING;
    END LOOP;

    -- Zone C: Slots C01 to C20 (Level 3 - Covered & Oversized)
    FOR i IN 1..20 LOOP
        slot_id_str := 'C' || LPAD(i::TEXT, 2, '0');
        INSERT INTO public.parking_slots (
            id, lot_id, zone, slot_number, type, status, floor, hourly_rate, sensor_id, sensor_health, sensor_battery
        ) VALUES (
            slot_id_str,
            'lot-skyline-central',
            'Zone C',
            slot_id_str,
            'standard',
            CASE 
                WHEN i IN (3, 9, 13, 17) THEN 'occupied'
                WHEN i IN (8) THEN 'reserved'
                ELSE 'available'
            END,
            3,
            30.00,
            'IOT-SN-' || slot_id_str,
            'online',
            92 + (i % 7)
        ) ON CONFLICT (id) DO NOTHING;
    END LOOP;
END $$;
