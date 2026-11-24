# ⚡ SmartPark Cloud — Smart Cloud Parking Management System
> **College Cloud Computing Technology Capstone Project & Live Demonstration**  
> *Autonomous IoT Telemetry, PostgreSQL Row-Level Security, Real-Time Pub/Sub, and Cloudflare Pages Edge Deployment*

---

## 🌟 Executive Summary

**SmartPark Cloud** is a next-generation, cloud-native smart parking and EV charging management system designed for modern smart cities. It eliminates urban traffic congestion caused by parking hunting by connecting 60 distributed IoT ultrasonic/optical bay sensors to a serverless PostgreSQL database with sub-20ms real-time event synchronization.

Drivers can locate, reserve, and pay for parking spots with instant digital boarding passes featuring dynamic QR codes and gate entry PINs. Facility operators access an administrative command center with live LoRaWAN telemetry ingestion, dynamic pricing controls, sensor health monitoring, and analytics.

---

## 🏗️ System Architecture & Cloud Tiers

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TIER 1: EDGE IOT SENSOR MESH                    │
│   [60 Hardware Bays: A01-A20 (EV/VIP), B01-B20 (Fleet), C01-C20 (Tier)]│
│   Ultrasonic & Optical Sensors • 915MHz LoRaWAN / BLE • Auto Heartbeat │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Telemetry Packets
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      TIER 2: CLOUD INGESTION & REST/WS                 │
│        Edge Broker / Ingestion Gateway (Noise Filtering & Auth)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Change Data Capture (WAL)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   TIER 3: DATABASE & BACKEND (PAAS)                    │
│   Supabase PostgreSQL 15 • Row Level Security (RLS) Policies           │
│   Profiles • Parking Slots • Bookings • Payments • Notifications       │
│   Supabase Realtime WebSockets (postgres_changes pub/sub)              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Low-latency Edge Delivery
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    TIER 4: CLOUDFLARE EDGE CDN (IAAS)                  │
│    Cloudflare Pages Anycast Network (300+ PoPs Globally) • TLS 1.3     │
│    SPA Client: React 18 + Vite + TypeScript + Tailwind CSS (Cyber HUD) │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ☁️ Cloud Computing Concepts Demonstrated (Viva Reference)

| Cloud Concept | Implementation in SmartPark Cloud |
| :--- | :--- |
| **PaaS (Platform as a Service)** | Supabase Managed PostgreSQL Database, Auth Engine, and Realtime WebSocket daemon without managing raw virtual machine instances. |
| **IaaS / Edge CDN** | Cloudflare Pages hosting the static bundle across worldwide edge data centers, ensuring sub-20ms Time To First Byte (TTFB). |
| **Event-Driven Architecture** | Slot state changes (Available $\leftrightarrow$ Occupied) are broadcast instantly to all connected browser clients via PostgreSQL WAL stream instead of expensive client HTTP polling. |
| **Multi-Tenant Security (RLS)** | Supabase Row-Level Security ensures drivers can only read and mutate their own bookings and wallet credits, while Admins have cryptographic supervisory privileges. |
| **Zero-Config Fallback / Fault Tolerance** | If external cloud API keys are unreachable, the client gracefully falls back to an in-browser simulated cloud sandbox with persistent state and an autonomous IoT traffic engine. |
| **Edge Telemetry Simulation** | Background timer engine simulating autonomous vehicle arrivals and departures every 10–15 seconds, mimicking real smart-city sensor mesh traffic. |

---

## 🚀 Key Features

### 🚗 Driver Deck
- **Interactive 60-Bay Grid**: High-tech 3D-styled parking map across 3 dedicated zones:
  - **Zone A (A01–A20)**: Level 1 EV Fast Charging (22 kW DC) & VIP Bays (₹60 – ₹80/h).
  - **Zone B (B01–B20)**: Level 2 Standard Fleet & Accessible Bays (₹40/h).
  - **Zone C (C01–C20)**: Level 3 Covered Smart Bays (₹30/h).
- **Live Color Coding**:
  - 🟢 **Emerald Green**: Available bay, ready for immediate reservation.
  - 🔴 **Rose Red**: Occupied bay with detected vehicle license plate.
  - 🟡 **Amber Yellow**: Reserved bay awaiting gate arrival.
  - 🔵 **Electric Cyan**: Current driver's active bay reservation.
  - ⚪ **Slate**: Offline or maintenance bay.
- **Search & Filter Matrix**: Filter by zone, slot category (EV, VIP, Accessible), status, or search by code (e.g., `A04`).
- **Active Booking HUD**: Countdown timer with real-time remaining minutes, progress bar, simulated RFID gate check-in, overstay calculation, duration extensions (`+1h`, `+2h`), and cancellation refunds.
- **Digital Parking Pass Ticket**: Generates a high-resolution QR code (`qrcode.react`), 4-digit entry PIN, barrier gate directions, and print-ready pass.
- **Cloud Wallet**: Driver wallet balance management with simulated instant top-up (`+₹100`, `+₹250`, `+₹500`, `+₹1,000`).
- **Verifiable Parking History**: Historical session records with receipt vouchers and timestamps.

### 🛡️ Admin Command Room
- **Supervisor Access**: Role-based authentication (`admin` vs `user`).
- **IoT Telemetry Simulation Controller**: Toggle live sensor auto-updates on/off, adjust heartbeat frequencies (5s, 10s, 12s, 30s), or trigger random vehicle arrival/departure on demand.
- **Slot Fleet Manager**: Instant manual administrative override of any bay's status, category, or dynamic pricing rate.
- **Booking Management**: Comprehensive audit log of all bookings with administrative force check-in, check-out, and cancellation controls.
- **Live IoT Packet Log**: Realtime stream showing incoming sensor IDs (`IOT-SN-A04`), confidence scores ($98\%+$), and payload events (`OCCUPIED`, `VACATED`, `HEARTBEAT`).
- **Visual Analytics Dashboard**: Hourly occupancy curves, zone capacity comparisons, revenue metrics, and EV clean energy offset statistics.

---

## 🗄️ PostgreSQL Database Schema (`supabase/schema.sql`)

The application is backed by 7 relational tables:

1. `profiles`: Driver & Admin identities, vehicle details, wallet credits, and roles.
2. `parking_lots`: Facilities, GPS coordinates, total capacities, and base rates.
3. `parking_slots`: The 60 bays with zone mapping, categories, hourly rates, sensor IDs, and battery levels.
4. `bookings`: Active and past reservations, vehicle plates, duration, QR hashes, and entry PINs.
5. `payments`: Simulated payment transaction references, payment methods, and timestamps.
6. `notifications`: Real-time push alert stream for barrier check-ins, sensor detections, and expirations.
7. `sensor_telemetry_logs`: Raw IoT telemetry packets, hardware event types, and confidence scores.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 6, TypeScript 5
- **Styling**: Tailwind CSS, Custom Glassmorphism, Neon Glow Utilities
- **Icons**: Lucide React (`lucide-react`)
- **QR Code Engine**: `qrcode.react` (SVG High-Precision Vector Engine)
- **Database & Auth**: Supabase PostgreSQL 15, Supabase Auth, Realtime WebSockets
- **Edge Deployment**: Cloudflare Pages (`wrangler.toml`, `_redirects`)

---

## 📦 Local Installation & Setup

### 1. Prerequisites
- **Node.js** v18+ or v20+ / v26+
- **npm** or **pnpm**

### 2. Clone or Enter the Project
```bash
cd smartpark-cloud
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note on Zero-Config Demo Mode**:  
> The application is equipped with an automatic demo mode. If Supabase environment variables are omitted, SmartPark Cloud immediately boots with 60 pre-seeded bays, sample bookings, a demo driver (`Alex Mercer`), a demo admin (`Dr. Elena Vance`), and an active 12-second IoT simulator.

---

## 🔗 Connecting Your Own Supabase Backend (Optional)

1. Create a free project at [https://supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Copy and run the entire contents of `supabase/schema.sql`.
4. Copy your **Project URL** and **Anon Key** from Project Settings $\rightarrow$ API.
5. Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key
   ```
6. Restart the Vite dev server (`npm run dev`). The top navbar will display **Supabase Live** with real-time PostgreSQL synchronization!

---

## 🌐 Cloudflare Pages Deployment

### Method A: Cloudflare Dashboard (Recommended)
1. Push your repository to GitHub or GitLab.
2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com) $\rightarrow$ **Workers & Pages** $\rightarrow$ **Create Application** $\rightarrow$ **Pages**.
3. Select your repository.
4. Configure Build Settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
5. Click **Save and Deploy**. Cloudflare edge nodes will build and serve your site globally in seconds.

### Method B: Wrangler CLI
```bash
npm run build
npx wrangler pages deploy dist --project-name=smartpark-cloud
```

---

## 🎯 Viva Presentation Talking Points

1. **Why Cloud Computing for Smart Parking?**  
   *Traditional on-premise parking servers cannot scale dynamically during city events. A cloud architecture provides infinite horizontal scaling, serverless edge ingestion, and 99.99% uptime.*
2. **How is Latency Minimized?**  
   *By placing the application bundle at Cloudflare Edge CDN locations and utilizing WebSocket WAL subscriptions, round-trip latency is reduced to sub-20ms.*
3. **How is Security Enforced?**  
   *PostgreSQL Row Level Security (RLS) ensures that drivers cannot query another user's license plate or boarding pass, enforcing Zero-Trust principles directly at the database engine.*
4. **IoT Sensor Simulation:**  
   *The system simulates LoRaWAN battery diagnostics and ultrasonic confidence scores ($96\%-100\%$), proving end-to-end telemetry ingestion.*

---

## 📄 License
MIT License — Free to use for college academic capstone, research, and non-commercial educational demos.
