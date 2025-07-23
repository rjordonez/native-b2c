const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

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

app.listen(3001, () => {
  console.log("🚀 Server running on http://localhost:3001");
});

