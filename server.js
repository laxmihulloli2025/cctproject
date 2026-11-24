import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Request logging middleware for cloud telemetry
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api')) {
      console.log(`[CloudServer] ${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Cloud Health and Status Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'SmartPark Cloud Server Node',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
    memory: {
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
    },
    cloudSpecs: {
      provider: process.env.CLOUD_PROVIDER || 'Free Cloud Tier (Linux Container)',
      region: process.env.REGION || 'ap-south-1 / Global Edge',
      currency: 'INR (₹)',
      freeTierCost: '₹0.00 / Free Forever'
    }
  });
});

// IoT Sensor Telemetry Aggregation API
app.get('/api/telemetry/summary', (req, res) => {
  res.json({
    network: 'LoRaWAN 915MHz Mesh + BLE 5.2 Sensor Gateways',
    totalSlots: 60,
    zones: {
      A: { name: 'Level 1 Deck (EV & VIP)', count: 20, ratePerHour: '₹60 - ₹80' },
      B: { name: 'Level 2 Deck (Fleet)', count: 20, ratePerHour: '₹40' },
      C: { name: 'Level 3 Deck (Covered)', count: 20, ratePerHour: '₹30' },
    },
    batteryHealthAverage: '94.2%',
    telemetryHeartbeatIntervalSeconds: 12,
    cloudSyncProtocol: 'WebSocket + PostgreSQL WAL CDC'
  });
});

// Serve static assets from dist
app.use('/cctproject', express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'dist')));

// SPA Fallback for all client-side routes (Express 5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(` ⚡ SmartPark Cloud Server Node is running!`);
  console.log(` 📍 Local / Cloud Port: ${PORT}`);
  console.log(` 🌐 Health Check: http://localhost:${PORT}/api/health`);
  console.log(` 💰 Cloud Tier Cost: ₹0.00 (Free Tier Compute)`);
  console.log(`=======================================================`);
});
