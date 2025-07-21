const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { AccessToken } = require('livekit-server-sdk');

const app = express();
app.use(cors());
app.use(express.json());

// LiveKit token creation function
async function createParticipantToken(userInfo, roomName, apiKey, apiSecret) {
  const at = new AccessToken(apiKey, apiSecret, {
    ...userInfo,
    ttl: '15m',
  });
  const grant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  };
  at.addGrant(grant);
  return await at.toJwt();
}

app.get("/", (req, res) => {
  res.send("✅ Node.js server is working!");
});

app.post("/proxy", async (req, res) => {
  const { audio_urls, submission_url } = req.body;

  console.log("📩 Incoming /proxy request:");
  console.log("🔗 submission_url:", submission_url);
  console.log("🎵 audio_urls:", audio_urls);

  if (!audio_urls || !submission_url) {
    return res.status(400).json({ error: "Missing audio_urls or submission_url" });
  }

  try {
    const response = await axios.post(
      "https://classconnect-staging-107872842385.us-west2.run.app/api/v1/submission/submit",
      {
        audio_urls,
        submission_url,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("✅ Submission forwarded successfully.");
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("🔥 Error calling submission API:", {
      message: error.message,
      data: error.response?.data,
    });

    return res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || "Unknown server error",
    });
  }
});

// LiveKit connection endpoint
app.get("/api/connection-details", async (req, res) => {
  console.log('🔥 Connection details request received');
  
  // Hardcoded LiveKit credentials for testing
  const API_KEY = "APIMeKq8mrmU6n5";
  const API_SECRET = "fHdueZwHo6zaRv1Y9jxm7fXmFiliLe9xLlfWhAPn53kB";
  const LIVEKIT_URL = "wss://nativewebserver-534nsmp8.livekit.cloud";

  try {
    if (LIVEKIT_URL === undefined) {
      throw new Error('LIVEKIT_URL is not defined');
    }
    if (API_KEY === undefined) {
      throw new Error('LIVEKIT_API_KEY is not defined');
    }
    if (API_SECRET === undefined) { 
      throw new Error('LIVEKIT_API_SECRET is not defined');
    }

    // Generate participant token with special naming convention
    const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const customGreeting = req.query.greeting || "Hi I am Luna";
    const scenario = req.query.scenario || "";
   
    const conversationScript = req.query.conversationScript || "";
    const scenarioLevel = req.query.scenarioLevel || "";
    const scenarioTurns = req.query.scenarioTurns || "";
    const participantName = `user_${randomDigits}_say_${customGreeting.replace(/\s+/g, '_').toLowerCase()}`;
    const participantIdentity = `voice_assistant_user_${Math.floor(Math.random() * 10_000)}`;
    const roomName = `voice_assistant_room_${Math.floor(Math.random() * 10_000)}`;
    const participantToken = await createParticipantToken(
      { identity: participantIdentity, name: participantName },
      roomName
    );

    // Return connection details
    const data = {
      serverUrl: LIVEKIT_URL,
      roomName,
      participantToken: participantToken,
      participantName,
    };
    
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log("🚀 Server running on http://localhost:3001");
  console.log("🎙️ LiveKit connection endpoint: http://localhost:3001/api/connection-details");
});

