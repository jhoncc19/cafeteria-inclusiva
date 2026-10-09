const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  recordNoise,
  getCurrentNoise,
  getNoiseMap,
  getQuietestHours
} = require('../controllers/noiseController');

// Público
router.get('/current', getCurrentNoise);
router.get('/map', getNoiseMap);
router.get('/quietest-hours', getQuietestHours);

// Solo admin/barista puede registrar ruido
router.post('/', protect, authorize('admin', 'barista'), recordNoise);

module.exports = router;