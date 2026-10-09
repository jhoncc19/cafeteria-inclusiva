// Importamos mongoose para conectar con MongoDB
const mongoose = require('mongoose');

// Función asíncrona que conecta a la BD
const connectDB = async () => {
  try {
    // Conectar usando la URL del archivo .env
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB conectado: ${conn.connection.host}`);
    console.log(`Base de datos: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('Error de conexión:', error.message);
    process.exit(1);
  }
};

// Exportar la función para usarla desde app.js
module.exports = connectDB;