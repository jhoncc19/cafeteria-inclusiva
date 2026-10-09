const express = require('express');
const router = express.Router();
const {
  recordNoise,
  getCurrentNoise,
  getNoiseMap,
  getQuietestHours,
  getCurrentMapByLocation,
  getBestHours,
  getNoiseByHour
} = require('../controllers/noiseController');

// Rutas existentes
router.post('/', recordNoise);
router.get('/current', getCurrentNoise);
router.get('/map', getNoiseMap);
router.get('/quietest-hours', getQuietestHours);

// Rutas nuevas para el frontend
router.get('/map-actual', getCurrentMapByLocation);
router.get('/best-hours', getBestHours);
router.get('/by-hour', getNoiseByHour);

module.exports = router;