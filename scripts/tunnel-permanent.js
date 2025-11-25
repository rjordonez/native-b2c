#!/usr/bin/env node

/**
 * Permanent Cloudflare tunnel setup for consistent URL
 * This creates a named tunnel that keeps the same URL across sessions
 */

const { spawn } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

console.log('Setting up permanent Cloudflare tunnel...\n');

// Configuration
const TUNNEL_NAME = 'my-react-app-dev';
const CONFIG_DIR = path.join(os.homedir(), '.cloudflared');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.yml');

console.log('===========================================');
console.log('PERMANENT CLOUDFLARE TUNNEL SETUP');
console.log('===========================================\n');

console.log('To create a permanent tunnel with a fixed URL:\n');

console.log('1. First time setup (run once):');
console.log('   cloudflared tunnel login');
console.log(`   cloudflared tunnel create ${TUNNEL_NAME}`);
console.log('   cloudflared tunnel route dns ${TUNNEL_NAME} <your-subdomain>.example.com\n');

console.log('2. Create config file at ~/.cloudflared/config.yml:');
console.log(`
tunnel: ${TUNNEL_NAME}
credentials-file: ~/.cloudflared/<tunnel-id>.json

ingress:
  - hostname: your-subdomain.example.com
    service: http://localhost:5173
  - hostname: api-your-subdomain.example.com  
    service: http://localhost:3001
  - service: http_status:404
`);

console.log('\n3. Run the tunnel:');
console.log('   cloudflared tunnel run\n');

console.log('4. Your URLs will always be:');
console.log('   Frontend: https://your-subdomain.example.com');
console.log('   Backend:  https://api-your-subdomain.example.com\n');

console.log('===========================================');
console.log('ALTERNATIVE: Use Ngrok for Consistent URLs');
console.log('===========================================\n');

console.log('1. Install ngrok: npm install -g ngrok');
console.log('2. Sign up at https://ngrok.com for a free account');
console.log('3. Set auth token: ngrok authtoken <your-token>');
console.log('4. Run with custom subdomain (paid feature):');
console.log('   ngrok http 5173 --subdomain=my-app\n');

console.log('===========================================');
console.log('QUICK START (Random URL each time):');
console.log('===========================================\n');

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

console.log('For quick testing with random URLs:\n');
console.log('Terminal 1 - Start dev servers:');
console.log('  npm run dev:full\n');
console.log('Terminal 2 - Create tunnel:');
console.log('  cloudflared tunnel --url http://localhost:5173\n');
console.log('The tunnel URL will be shown in the output.');
console.log('Example: https://random-words-here.trycloudflare.com\n');

console.log('Add the URL to Supabase auth settings:');
console.log('https://supabase.com/dashboard/project/bbsoecocbhsdgqcwcesc/auth/url-configuration\n');

// Create a simple config generator
const generateConfig = () => {
  const config = {
    tunnelName: TUNNEL_NAME,
    note: 'Run "cloudflared tunnel list" to see your tunnel ID',
    configPath: CONFIG_FILE,
    commands: {
      create: `cloudflared tunnel create ${TUNNEL_NAME}`,
      list: 'cloudflared tunnel list',
      run: 'cloudflared tunnel run',
      delete: `cloudflared tunnel delete ${TUNNEL_NAME}`
    }
  };
  
  // Save config reference
  fs.writeFileSync(
    path.join(process.cwd(), 'tunnel-config.json'),
    JSON.stringify(config, null, 2)
  );
  
  console.log('Saved tunnel configuration reference to tunnel-config.json\n');
};

generateConfig();