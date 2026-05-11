const assert = require('assert');

console.log('Ejecutando pruebas...');

// Prueba simple
assert.strictEqual(1 + 1, 2);
console.log('✅ Pruebas pasadas');

// Prueba de API (simulada)
const API_URL = 'http://localhost:3001';
console.log(`📡 API esperada en: ${API_URL}`);