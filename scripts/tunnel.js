#!/usr/bin/env node

/**
 * Development server with Cloudflare tunnel for HTTPS access
 * This enables mobile testing with microphone access (requires HTTPS on iOS)
 */

const { spawn } = require('child_process');
const os = require('os');

console.log('Starting development servers with Cloudflare tunnel...\n');

// Get local IP address
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

console.log(`Local IP: ${localIP}`);
console.log('Starting frontend on port 5173...');
console.log('Starting backend on port 3001...\n');

// Start Vite dev server
const vite = spawn('npx', ['vite', '--host'], {
  stdio: 'inherit',
  shell: true
});

// Start backend server
const backend = spawn('npm', ['run', 'dev'], {
  cwd: './backend',
  stdio: 'inherit',
  shell: true
});

// Wait a bit for servers to start
setTimeout(() => {
  console.log('\n===========================================');
  console.log('Servers are running!');
  console.log('===========================================\n');
  console.log('Local access:');
  console.log(`  Frontend: http://localhost:5173`);
  console.log(`  Backend:  http://localhost:3001`);
  console.log('\nNetwork access:');
  console.log(`  Frontend: http://${localIP}:5173`);
  console.log(`  Backend:  http://${localIP}:3001`);
  console.log('\n===========================================');
  console.log('To create a Cloudflare tunnel (for HTTPS):');
  console.log('===========================================\n');
  console.log('1. Install Cloudflare tunnel:');
  console.log('   npm install -g cloudflared\n');
  console.log('2. In a new terminal, run:');
  console.log('   cloudflared tunnel --url http://localhost:5173\n');
  console.log('3. For the backend API proxy, run:');
  console.log('   cloudflared tunnel --url http://localhost:3001\n');
  console.log('4. Add the Cloudflare URLs to Supabase:');
  console.log('   https://supabase.com/dashboard/project/bbsoecocbhsdgqcwcesc/auth/url-configuration');
  console.log('   Add your-tunnel.trycloudflare.com to Redirect URLs\n');
  console.log('===========================================\n');
}, 3000);

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\nShutting down servers...');
  vite.kill();
  backend.kill();
  process.exit();
});