const express = require('express');
const pronunciationRoutes = require('./pronunciation');
const transcriptionRoutes = require('./transcription');
const proxyRoutes = require('./proxy');
const enhancementRoutes = require('./enhancement');
const ttsRoutes = require('./tts');
const ieltsRoutes = require('./ielts');

const router = express.Router();

// API routes
router.use('/pronunciation', pronunciationRoutes);
router.use('/transcription', transcriptionRoutes);
router.use('/proxy', proxyRoutes);
router.use('/enhancement', enhancementRoutes);
router.use('/tts', ttsRoutes);
router.use('/ielts', ieltsRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'IELTS Practice API',
    version: '1.0.0',
    endpoints: {
      pronunciation: '/api/pronunciation',
      transcription: '/api/transcription',
      proxy: '/api/proxy',
      enhancement: '/api/enhancement',
      tts: '/api/tts',
      ielts: '/api/ielts',
      health: '/health'
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;