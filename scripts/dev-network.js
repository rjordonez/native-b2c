#!/usr/bin/env node

const { execSync } = require('child_process');
const os = require('os');

// Get local network IP
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();
console.log(`🌐 Network IP: ${localIP}`);

// Set environment variable for API URL
process.env.VITE_API_BASE_URL = `https://${localIP}:3001/api`;

console.log(`📱 Frontend: https://${localIP}:5173`);
console.log(`🔌 Backend API: https://${localIP}:3001/api`);
console.log('\n⚠️  Note: You\'ll need to accept the self-signed certificate warning in your browser');
console.log('📱 On iOS: Settings > General > About > Certificate Trust Settings\n');

// Run the dev command
execSync('npm run dev:network', { stdio: 'inherit' });