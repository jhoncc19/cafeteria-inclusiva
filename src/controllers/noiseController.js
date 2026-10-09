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
/**
 * Obtener el estado actual por local (formato para reservar.html).
 * GET /api/noise/map-actual
 */
const getCurrentMapByLocation = async (req, res) => {
  try {
    // Buscar qué locations existen en la BD
    const locations = await NoiseLevel.distinct('locationId');
    
    // Si no hay ninguno, retornar array vacío
    if (locations.length === 0) {
      return res.json({
        success: true,
        data: [],
        timestamp: new Date()
      });
    }
    
    // Obtener la última medición de cada local
    const mapData = await Promise.all(
      locations.map(async (loc) => {
        const latest = await NoiseLevel.findOne({ locationId: loc })
          .sort('-timestamp')
          .lean();
        
        return {
          locationId: loc,
          name: getLocationName(loc),
          current: latest ? {
            decibels: latest.decibels || 0,
            category: latest.category || 'moderado',
            occupancy: latest.occupancy || 0,
            timestamp: latest.timestamp
          } : {
            decibels: 0,
            category: 'sin-datos',
            occupancy: 0
          }
        };
      })
    );
    
    res.json({
      success: true,
      data: mapData,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener las mejores horas para visitar (formato para reservar.html).
 * GET /api/noise/best-hours
 */
const getBestHours = async (req, res) => {
  try {
    const locationId = req.query.locationId || 'principal';
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const hourlyData = await NoiseLevel.aggregate([
      { 
        $match: { 
          timestamp: { $gte: weekAgo },
          locationId 
        } 
      },
      {
        $group: {
          _id: '$hourOfDay',
          avgDecibels: { $avg: '$decibels' },
          avgOccupancy: { $avg: '$occupancy' },
          samples: { $sum: 1 }
        }
      },
      { $sort: { avgDecibels: 1 } },
      { $limit: 5 }
    ]);
    
    const bestHours = hourlyData.map(h => ({
      hour: h._id,
      timeRange: `${h._id.toString().padStart(2, '0')}:00 - ${(h._id + 1).toString().padStart(2, '0')}:00`,
      avgDecibels: Math.round(h.avgDecibels),
      occupancy: Math.round(h.avgOccupancy),
      samples: h.samples,
      recommendation: h.avgDecibels < 50 
        ? 'Ideal para personas con hipersensibilidad' 
        : 'Ambiente tranquilo'
    }));
    
    res.json({
      success: true,
      data: bestHours
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener datos por hora (formato para gráfico).
 * GET /api/noise/by-hour
 */
const getNoiseByHour = async (req, res) => {
  try {
    const locationId = req.query.locationId || 'principal';
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const hourlyData = await NoiseLevel.aggregate([
      { 
        $match: { 
          timestamp: { $gte: weekAgo },
          locationId 
        } 
      },
      {
        $group: {
          _id: '$hourOfDay',
          avgDecibels: { $avg: '$decibels' },
          avgOccupancy: { $avg: '$occupancy' },
          samples: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const chartData = hourlyData.map(h => {
      let cat;
      if (h.avgDecibels < 50) cat = 'silencioso';
      else if (h.avgDecibels < 65) cat = 'moderado';
      else if (h.avgDecibels < 80) cat = 'concurrido';
      else cat = 'ruidoso';
      
      return {
        hour: h._id,
        label: `${h._id.toString().padStart(2, '0')}:00`,
        avgDecibels: Math.round(h.avgDecibels),
        avgOccupancy: Math.round(h.avgOccupancy),
        category: cat,
        samples: h.samples
      };
    });
    
    res.json({
      success: true,
      data: chartData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Helper para obtener nombre de local
function getLocationName(id) {
  const names = {
    centro: 'Café Aroma Centro',
    norte: 'Café Aroma Norte',
    sur: 'Café Aroma Sur',
    este: 'Café Aroma Este',
    principal: 'Café Aroma Principal'
  };
  return names[id] || `Café Aroma ${id}`;
}
module.exports = {
  recordNoise,
  getCurrentNoise,
  getNoiseMap,
  getQuietestHours,
  getCurrentMapByLocation,
  getBestHours,
  getNoiseByHour
};