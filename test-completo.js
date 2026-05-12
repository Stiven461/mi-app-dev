const http = require('http');
const assert = require('assert');

console.log('🧪 Verificando Agenda de Contactos...\n');

const BASE_URL = 'http://localhost:3001';
let testId = null;

// Función para hacer peticiones HTTP
function request(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: path,
            method: method,
            headers: { 'Content-Type': 'application/json' }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const json = body ? JSON.parse(body) : null;
                    resolve({ status: res.statusCode, data: json });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', reject);
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

async function testApi() {
    try {
        // 1. Verificar que el servidor está vivo
        console.log('1. Verificando servidor...');
        const root = await request('GET', '/');
        assert.strictEqual(root.status, 200);
        console.log('   ✅ Servidor funcionando');
        console.log(`   📝 Mensaje: ${root.data.message}\n`);

        // 2. Crear un contacto
        console.log('2. Creando contacto de prueba...');
        const nuevoContacto = {
            name: 'Juan Prueba',
            phone: '123456789',
            email: 'juan@prueba.com'
        };
        const create = await request('POST', '/api/contacts', nuevoContacto);
        assert.strictEqual(create.status, 200);
        testId = create.data.id;
        console.log(`   ✅ Contacto creado con ID: ${testId}`);
        console.log(`   📝 Nombre: ${create.data.name}\n`);

        // 3. Leer todos los contactos
        console.log('3. Leyendo lista de contactos...');
        const read = await request('GET', '/api/contacts');
        assert.strictEqual(read.status, 200);
        assert(Array.isArray(read.data));
        console.log(`   ✅ Se encontraron ${read.data.length} contactos\n`);

        // 4. Buscar el contacto creado
        console.log('4. Buscando contacto creado...');
        const search = await request('GET', `/api/contacts/search?q=Juan`);
        assert.strictEqual(search.status, 200);
        const encontrado = search.data.find(c => c.id === testId);
        assert(encontrado, 'Contacto no encontrado en búsqueda');
        console.log(`   ✅ Contacto encontrado: ${encontrado.name}\n`);

        // 5. Actualizar contacto
        console.log('5. Actualizando contacto...');
        const actualizado = {
            name: 'Juan Actualizado',
            phone: '987654321',
            email: 'juan.actualizado@prueba.com'
        };
        const update = await request('PUT', `/api/contacts/${testId}`, actualizado);
        assert.strictEqual(update.status, 200);
        console.log(`   ✅ Contacto actualizado a: ${actualizado.name}\n`);

        // 6. Eliminar contacto
        console.log('6. Eliminando contacto...');
        const del = await request('DELETE', `/api/contacts/${testId}`);
        assert.strictEqual(del.status, 200);
        console.log('   ✅ Contacto eliminado\n');

        // 7. Verificar que ya no existe
        console.log('7. Verificando eliminación...');
        const verify = await request('GET', '/api/contacts');
        const existe = verify.data.find(c => c.id === testId);
        assert(!existe, 'El contacto aún existe después de eliminarlo');
        console.log('   ✅ Confirmado: contacto ya no existe\n');

        console.log('🎉 ¡LA APLICACIÓN FUNCIONA CORRECTAMENTE!');
        console.log('   ✅ Todas las operaciones CRUD están operativas');
        process.exit(0);

    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.error('\n💡 La aplicación NO funciona correctamente');
        process.exit(1);
    }
}

testApi();