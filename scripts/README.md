# Mobile Testing & Development Scripts

This directory contains scripts for testing the IELTS practice app on mobile devices during development.

## Quick Start

### Testing on Mobile (Same WiFi Network)

```bash
# Start servers with network access
npm run dev:network

# Your app will be available at:
# http://192.168.x.x:5173 (check terminal output for exact IP)
```

### Testing with Microphone on iPhone

```bash
# Terminal 1: Start servers
npm run dev:network

# Terminal 2: Create HTTPS tunnel
cloudflared tunnel --url http://localhost:5173

# Use the HTTPS URL shown (https://xxxx.trycloudflare.com)
```

## Why Do We Need Tunnels?

### The Problem: iOS Security Requirements

**iOS Safari blocks microphone access over HTTP** for security reasons. This means:

- ❌ `http://localhost:5173` - Microphone blocked
- ❌ `http://192.168.x.x:5173` - Microphone blocked  
- ✅ `https://anything.com` - Microphone works

### When You Need a Tunnel

| Scenario | Need Tunnel? | Why |
|----------|--------------|-----|
| Desktop Chrome/Firefox | ❌ No | Browsers allow microphone on localhost |
| Android Phone | ❌ No | Android allows microphone over HTTP on local network |
| iPhone Safari | ✅ Yes | iOS requires HTTPS for getUserMedia() |
| iPhone Chrome | ✅ Yes | All iOS browsers use Safari's engine |
| Testing OAuth on mobile | ✅ Yes | OAuth redirects work better with consistent URLs |

### How Tunnels Work

```
Your Computer          Cloudflare           iPhone
[localhost:5173] <--> [tunnel server] <--> [Safari]
     HTTP               HTTPS proxy          HTTPS
```

1. Cloudflare tunnel creates a temporary HTTPS URL
2. It proxies all requests to your localhost
3. iPhone gets HTTPS (secure) so microphone works
4. You get to test on real device with all features

## Available Scripts

### `npm run dev:network`
Starts both frontend and backend with network access enabled. Use this for:
- Testing on Android devices
- Testing on desktop browsers from another computer
- Basic mobile testing (without microphone)

### `npm run dev:tunnel`
Shows instructions for setting up Cloudflare tunnel. Use for:
- Testing microphone features on iPhone
- Testing OAuth flows on mobile
- Sharing your dev server temporarily

### `npm run tunnel:setup`
Guide for creating a permanent tunnel with fixed URL. Use if:
- You test on iPhone frequently
- You want consistent URLs
- You're tired of updating Supabase redirect URLs

### `npm run tunnel:url`
Helps find your current tunnel URL if you forgot it.

## Step-by-Step: iPhone Microphone Testing

### 1. Install Cloudflare Tunnel (One Time)

```bash
# Mac
brew install cloudflared

# Or download from
https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
```

### 2. Start Your Dev Environment

```bash
# Terminal 1
npm run dev:network
```

### 3. Create HTTPS Tunnel

```bash
# Terminal 2
cloudflared tunnel --url http://localhost:5173
```

Output will show:
```
Your quick tunnel has been created! Visit it at:
https://random-words-here.trycloudflare.com
```

### 4. Configure Supabase (Each New URL)

1. Copy the tunnel URL
2. Go to [Supabase Auth Settings](https://supabase.com/dashboard/project/bbsoecocbhsdgqcwcesc/auth/url-configuration)
3. Add to Redirect URLs: `https://your-tunnel.trycloudflare.com/*`

### 5. Test on iPhone

1. Open Safari on iPhone
2. Visit the tunnel URL
3. Sign in with Google
4. Test microphone features

## Alternatives to Cloudflare

### Ngrok (More Features, Requires Account)

```bash
# Install
brew install ngrok

# Setup (one time)
ngrok authtoken YOUR_TOKEN

# Run
ngrok http 5173
```

Pros:
- Cleaner URLs
- Better dashboard
- Stable URLs for 8 hours (free tier)

### Local HTTPS Certificate (Complex)

```bash
# Using Vite's built-in HTTPS
npm run dev -- --https

# Then accept certificate warning on phone
```

Pros:
- No external service needed
- Works offline

Cons:
- Certificate warnings on every device
- Complex setup for valid certificates

## Troubleshooting

### "Microphone access requires HTTPS on iOS"
**Solution**: You're using HTTP. Create a tunnel for HTTPS access.

### "Blocked request. This host is not allowed"
**Solution**: Restart Vite server after creating tunnel, or check `vite.config.js` allowedHosts.

### OAuth redirects to wrong URL
**Solution**: Add tunnel URL to Supabase redirect URLs.

### "503 Tunnel unavailable"
**Solution**: Tunnel expired or disconnected. Create a new tunnel.

### Can't access on phone
**Checklist**:
1. Phone on same WiFi as computer?
2. Firewall blocking connections?
3. Using correct IP from terminal output?
4. Backend running on port 3001?

## Security Notes

⚠️ **Tunnels expose your localhost to the internet temporarily**

- Anyone with the URL can access your dev server
- Cloudflare URLs expire after ~24 hours
- Don't share sensitive data over tunnels
- Close tunnel when done testing (Ctrl+C)

## Production Deployment

**You DON'T need tunnels in production!** 

- Production (Vercel): Already has HTTPS ✅
- Microphone works automatically ✅
- OAuth configured for production domain ✅

Tunnels are ONLY for local development when you need:
1. HTTPS for iOS microphone
2. Testing OAuth flows
3. Temporary sharing

## Common Workflows

### Daily Development (Desktop Only)
```bash
npm run dev:full  # Just use localhost
```

### Android Testing
```bash
npm run dev:network  # Use IP address, no tunnel needed
```

### iPhone Testing (No Microphone)
```bash
npm run dev:network  # Basic testing over WiFi
```

### iPhone Testing (With Microphone)
```bash
# Terminal 1
npm run dev:network

# Terminal 2  
cloudflared tunnel --url http://localhost:5173

# Add URL to Supabase, test on phone
```

### Quick Demo to Someone
```bash
# Create tunnel and share the URL
cloudflared tunnel --url http://localhost:5173
# Send them: https://xxxx.trycloudflare.com
```

## Tips

1. **Save tunnel URLs**: Copy them immediately when shown
2. **Use ngrok** if you test frequently (more stable URLs)
3. **Close tunnels** when done (Ctrl+C) for security
4. **Bookmark** Supabase redirect URL settings page
5. **Test Android first** - no tunnel needed, easier debugging

## Questions?

- iOS requires HTTPS for privacy/security (can't be disabled)
- Tunnels are temporary by design (security feature)
- Production doesn't need any of this (already has HTTPS)
- This is standard for web development, not unique to this app

Remember: **Tunnels are just for development. Your production app on Vercel works perfectly without any of this!**