require('dotenv').config();
const connectDB = require('../config/database');
const Product = require('../models/Product');
const User = require('../models/User');
const NoiseLevel = require('../models/NoiseLevel');

const products = [
  // Bebidas Calientes
  { 
    name: 'Espresso', category: 'calientes', price: 2.50,
    description: 'Café concentrado de sabor intenso',
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400',
    stock: 100, sensoryLevel: 'bajo', temperature: 'caliente', texture: 'liquido',
    allergens: ['ninguno'], pictogramUrl: 'https://img.icons8.com/color/96/coffee-to-go.png'
  },
  { 
    name: 'Americano', category: 'calientes', price: 3.00,
    description: 'Espresso con agua caliente',
    image: 'https://images.unsplash.com/photo-1551030173-122a45c7f74c?w=400',
    stock: 100, sensoryLevel: 'bajo', temperature: 'caliente', texture: 'liquido',
    allergens: ['ninguno'], pictogramUrl: 'https://img.icons8.com/color/96/coffee.png'
  },
  { 
    name: 'Café Latte', category: 'calientes', price: 4.00,
    description: 'Espresso con leche cremosa',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400',
    stock: 80, sensoryLevel: 'bajo', temperature: 'caliente', texture: 'cremoso',
    allergens: ['lactosa'], pictogramUrl: 'https://img.icons8.com/color/96/latte.png'
  },
  { 
    name: 'Cappuccino', category: 'calientes', price: 4.50,
    description: 'Espresso con espuma de leche',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
    stock: 80, sensoryLevel: 'bajo', temperature: 'caliente', texture: 'cremoso',
    allergens: ['lactosa'], pictogramUrl: 'https://img.icons8.com/color/96/cappuccino.png'
  },
  
  // Bebidas Frías
  { 
    name: 'Frappé de Café', category: 'frias', price: 5.50,
    description: 'Café helado batido',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
    stock: 50, sensoryLevel: 'medio', temperature: 'frio', texture: 'cremoso',
    allergens: ['lactosa'], pictogramUrl: 'https://img.icons8.com/color/96/iced-coffee.png'
  },
  { 
    name: 'Iced Latte', category: 'frias', price: 4.50,
    description: 'Espresso con leche fría',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400',
    stock: 60, sensoryLevel: 'bajo', temperature: 'frio', texture: 'liquido',
    allergens: ['lactosa'], pictogramUrl: 'https://img.icons8.com/color/96/iced-latte.png'
  },
  
  // Postres
  { 
    name: 'Tarta de Chocolate', category: 'dulces', price: 5.50,
    description: 'Tarta con chocolate belga',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    stock: 30, sensoryLevel: 'medio', temperature: 'ambiente', texture: 'suave',
    allergens: ['gluten', 'lactosa', 'huevo'], pictogramUrl: 'https://img.icons8.com/color/96/chocolate-bar.png'
  },
  { 
    name: 'Cheesecake', category: 'dulces', price: 6.00,
    description: 'Cheesecake con frutos rojos',
    image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400',
    stock: 25, sensoryLevel: 'medio', temperature: 'frio', texture: 'cremoso',
    allergens: ['gluten', 'lactosa', 'huevo'], pictogramUrl: 'https://img.icons8.com/color/96/cake.png'
  },
  { 
    name: 'Brownie con Helado', category: 'dulces', price: 5.00,
    description: 'Brownie caliente con helado',
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400',
    stock: 40, sensoryLevel: 'alto', temperature: 'tibio', texture: 'suave',
    allergens: ['gluten', 'lactosa', 'huevo'], pictogramUrl: 'https://img.icons8.com/color/96/brownie.png'
  },
  
  // Salados
  { 
    name: 'Sándwich Club', category: 'salados', price: 7.50,
    description: 'Pollo, tocino, lechuga, tomate',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400',
    stock: 35, sensoryLevel: 'medio', temperature: 'ambiente', texture: 'crujiente',
    allergens: ['gluten', 'huevo'], pictogramUrl: 'https://img.icons8.com/color/96/sandwich.png'
  },
  { 
    name: 'Ensalada César', category: 'salados', price: 6.50,
    description: 'Lechuga romana, crutones, parmesano',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    stock: 40, sensoryLevel: 'bajo', temperature: 'frio', texture: 'crujiente',
    allergens: ['gluten', 'lactosa', 'huevo'], pictogramUrl: 'https://img.icons8.com/color/96/salad.png'
  }
];

const users = [
  { 
    name: 'Admin Principal', email: 'admin@cafearoma.com', password: 'admin123',
    role: 'admin', phone: '555-0001'
  },
  { 
    name: 'Juan Pérez', email: 'juan@cafearoma.com', password: 'juan123',
    role: 'barista', phone: '555-0002'
  },
  { 
    name: 'María González', email: 'maria@cafearoma.com', password: 'maria123',
    role: 'mesero', phone: '555-0003'
  },
  { 
    name: 'Usuario Prueba TEA', email: 'tea@test.com', password: 'test123',
    role: 'cliente', phone: '555-0004',
    neuroProfile: {
      type: 'tea',
      defaultPreferences: {
        noiseLevel: 'silencioso',
        lighting: 'luz-baja',
        seating: 'rincon-privado',
        musicVolume: 'sin-musica',
        preferPictogramMenu: true
      },
      specialNeeds: {
        hasSensorySensitivity: true,
        needsQuietSpace: true,
        needsVisualAids: true
      }
    }
  }
];

// Generar datos de ruido simulados (últimos 7 días)
const generateNoiseData = () => {
  const data = [];
  const now = new Date();
  
  for (let d = 0; d < 7; d++) {
    for (let h = 8; h < 22; h++) {
      // Simular patrón de ruido realista
      let baseNoise = 55;
      if (h >= 12 && h <= 14) baseNoise = 75;  // Hora de almuerzo
      if (h >= 18 && h <= 21) baseNoise = 80;  // Hora de cena
      
      const noise = baseNoise + Math.floor(Math.random() * 15) - 7;
      
      let category;
      if (noise < 50) category = 'silencioso';
      else if (noise < 65) category = 'moderado';
      else if (noise < 80) category = 'concurrido';
      else category = 'ruidoso';
      
      const date = new Date(now);
      date.setDate(date.getDate() - d);
      date.setHours(h, 0, 0, 0);
      
      data.push({
        locationId: 'principal',
        timestamp: date,
        decibels: noise,
        category,
        occupancy: Math.floor((noise / 100) * 100),
        dayOfWeek: date.getDay(),
        hourOfDay: h
      });
    }
  }
  return data;
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🗑️  Limpiando base de datos...');
    await Product.deleteMany({});
    await User.deleteMany({});
    await NoiseLevel.deleteMany({});
    
    console.log('📥 Insertando productos...');
    const createdProducts = await Product.insertMany(products);
    
    console.log('📥 Insertando usuarios...');
    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);  // Usar create para que aplique el hash
      createdUsers.push(user);
    }
    
    console.log('📥 Generando datos de ruido...');
    const noiseData = generateNoiseData();
    await NoiseLevel.insertMany(noiseData);
    
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log(`✅ ${createdProducts.length} productos`);
    console.log(`✅ ${createdUsers.length} usuarios`);
    console.log(`✅ ${noiseData.length} registros de ruido`);
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('🔑 Credenciales de prueba:');
    console.log('   Admin: admin@cafearoma.com / admin123');
    console.log('   TEA:   tea@test.com / test123');
    console.log('');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedDatabase();