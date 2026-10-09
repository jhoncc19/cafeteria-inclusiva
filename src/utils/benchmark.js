require('dotenv').config();
const connectDB = require('../config/database');
const Product = require('../models/Product');

const benchmark = async () => {
  await connectDB();
  console.log('\n EJECUTANDO BENCHMARK\n');

  // Test 1: Sin optimizar
  console.log(' Test 1: Sin optimización');
  console.time(' Tiempo');
  const r1 = await Product.find({ category: 'calientes' });
  console.timeEnd(' Tiempo');
  console.log(` Documentos: ${r1.length}`);

  // Test 2: Con proyección y lean
  console.log('\n Test 2: Optimizado (proyección + lean)');
  console.time(' Tiempo');
  const r2 = await Product.find({ category: 'calientes' })
    .select('name price image')
    .lean();
  console.timeEnd(' Tiempo');
  console.log(` Documentos: ${r2.length}`);

  // Test 3: Con explain
  console.log('\n ANÁLISIS CON EXPLAIN:\n');
  const stats = await Product.find({ category: 'calientes' })
    .explain('executionStats');
  
  console.log(' Tiempo:', stats.executionStats.executionTimeMillis + 'ms');
  console.log(' Docs examinados:', stats.executionStats.totalDocsExamined);
  console.log(' Docs retornados:', stats.executionStats.nReturned);
  console.log(' Índice:', stats.executionStats.executionStages.indexName || 'COLLSCAN');
  console.log(' Etapa:', stats.executionStats.executionStages.stage);

  process.exit(0);
};

benchmark();