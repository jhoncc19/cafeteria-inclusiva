const NoiseLevel = require('../models/NoiseLevel');

/**
 * Registrar nivel de ruido actual.
 * POST /api/noise
 */
const recordNoise = async (req, res) => {
  try {
    const { decibels, occupancy, locationId } = req.body;
    
    // Determinar categoría según decibeles
    let category;
    if (decibels < 50) category = 'silencioso';
    else if (decibels < 65) category = 'moderado';
    else if (decibels < 80) category = 'concurrido';
    else category = 'ruidoso';
    
    const now = new Date();
    
    const noise = await NoiseLevel.create({
      locationId: locationId || 'principal',
      decibels,
      category,
      occupancy: occupancy || 0,
      dayOfWeek: now.getDay(),
      hourOfDay: now.getHours()
    });
    
    res.status(201).json({
      success: true,
      data: noise
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener nivel de ruido actual.
 * GET /api/noise/current
 */
const getCurrentNoise = async (req, res) => {
  try {
    const locationId = req.query.locationId || 'principal';
    
    const latest = await NoiseLevel.findOne({ locationId })
      .sort('-timestamp')
      .lean();
    
    if (!latest) {
      return res.json({
        success: true,
        data: {
          category: 'desconocido',
          decibels: 0,
          message: 'Sin datos disponibles'
        }
      });
    }
    
    res.json({
      success: true,
      data: latest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener mapa de ruido por hora del día.
 * GET /api/noise/map
 */
const getNoiseMap = async (req, res) => {
  try {
    // Promedio de ruido por hora del día (últimos 7 días)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const map = await NoiseLevel.aggregate([
      { $match: { timestamp: { $gte: weekAgo } } },
      {
        $group: {
          _id: { hour: '$hourOfDay', category: '$category' },
          avgDecibels: { $avg: '$decibels' },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.hour',
          data: {
            $push: {
              category: '$_id.category',
              avgDecibels: '$avgDecibels',
              count: '$count'
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      success: true,
      data: map
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener las horas más tranquilas.
 * GET /api/noise/quietest-hours
 */
const getQuietestHours = async (req, res) => {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const quietest = await NoiseLevel.aggregate([
      { $match: { timestamp: { $gte: weekAgo } } },
      {
        $group: {
          _id: { day: '$dayOfWeek', hour: '$hourOfDay' },
          avgDecibels: { $avg: '$decibels' },
          avgOccupancy: { $avg: '$occupancy' }
        }
      },
      { $sort: { avgDecibels: 1 } },
      { $limit: 5 }
    ]);
    
    res.json({
      success: true,
      data: quietest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  recordNoise,
  getCurrentNoise,
  getNoiseMap,
  getQuietestHours
};