#!/usr/bin/env node

/**
 * Get current Cloudflare tunnel URL
 * This script helps you find and save the current tunnel URL
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Finding active Cloudflare tunnel...\n');

// Check for running cloudflared process
exec('ps aux | grep cloudflared | grep -v grep', (error, stdout, stderr) => {
  if (error || !stdout) {
    console.log('No active Cloudflare tunnel found.');
    console.log('\nTo start a tunnel:');
    console.log('  cloudflared tunnel --url http://localhost:5173');
    console.log('\nThe URL will be displayed when the tunnel starts.');
    console.log('Look for: "Your quick tunnel has been created! Visit it at..."');
    return;
  }

  console.log('Cloudflared is running, but URLs are shown only at startup.');
  console.log('\nTo see your tunnel URL:');
  console.log('1. Check the terminal where you started cloudflared');
  console.log('2. Look for the line with your *.trycloudflare.com URL');
  console.log('\n===========================================');
  console.log('TIP: Save your tunnel URL when you start it');
  console.log('===========================================\n');
  
  // Create a URL tracker file
  const urlFile = path.join(process.cwd(), '.tunnel-url');
  
  console.log('You can save your URL for reference:');
  console.log(`  echo "https://your-url.trycloudflare.com" > .tunnel-url`);
  console.log('\nThen read it anytime with:');
  console.log('  cat .tunnel-url');
  
  // Check if URL was previously saved
  if (fs.existsSync(urlFile)) {
    const savedUrl = fs.readFileSync(urlFile, 'utf8').trim();
    console.log('\n===========================================');
    console.log('LAST SAVED TUNNEL URL:');
    console.log(savedUrl);
    console.log('===========================================');
    console.log('Note: This may not be current if you restarted the tunnel.');
  }
});

// Also provide a helper to save URLs
console.log('\n===========================================');
console.log('AUTOMATION TIP');
console.log('===========================================');
console.log('Start tunnel and capture URL automatically:');
console.log('\nCreate start-tunnel.sh:');
console.log(`
#!/bin/bash
cloudflared tunnel --url http://localhost:5173 2>&1 | tee tunnel.log &
sleep 3
URL=$(grep -o 'https://.*\.trycloudflare\.com' tunnel.log | head -1)
echo "Tunnel URL: $URL"
echo $URL > .tunnel-url
`);
console.log('\nThen run: chmod +x start-tunnel.sh && ./start-tunnel.sh');