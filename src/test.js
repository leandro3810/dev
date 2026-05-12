'use strict';

const http = require('http');
const app  = require('../server');

let server;
let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label}`);
    failed++;
  }
}

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (body) {
      const payload = JSON.stringify(body);
      req.setHeader('Content-Type', 'application/json');
      req.setHeader('Content-Length', Buffer.byteLength(payload));
      req.write(payload);
    }
    req.end();
  });
}

async function run() {
  server = app.listen(0); // random port
  const { port } = server.address();
  const host = 'localhost';

  console.log('\n=== Testes da API ===\n');

  // GET /api/profile
  {
    const res = await request({ host, port, path: '/api/profile', method: 'GET' });
    assert(res.status === 200, 'GET /api/profile retorna 200');
    assert(typeof res.body.name === 'string', 'profile tem campo name');
    assert(Array.isArray(res.body.skills), 'profile tem campo skills');
    assert(Array.isArray(res.body.projects), 'profile tem campo projects');
  }

  // POST /api/login – credenciais corretas
  {
    const res = await request({ host, port, path: '/api/login', method: 'POST' }, { username: 'admin', password: 'admin' });
    assert(res.status === 200, 'POST /api/login com credenciais válidas retorna 200');
    assert(res.body.success === true, 'login válido retorna success: true');
  }

  // POST /api/login – credenciais erradas
  {
    const res = await request({ host, port, path: '/api/login', method: 'POST' }, { username: 'user', password: 'wrong' });
    assert(res.status === 401, 'POST /api/login com credenciais inválidas retorna 401');
    assert(res.body.success === false, 'login inválido retorna success: false');
  }

  // POST /api/contact – dados válidos
  {
    const res = await request({ host, port, path: '/api/contact', method: 'POST' }, { name: 'Leandro', email: 'l@test.com', message: 'Olá' });
    assert(res.status === 200, 'POST /api/contact com dados válidos retorna 200');
    assert(res.body.success === true, 'contato válido retorna success: true');
  }

  // POST /api/contact – dados incompletos
  {
    const res = await request({ host, port, path: '/api/contact', method: 'POST' }, { name: 'Leandro' });
    assert(res.status === 400, 'POST /api/contact com dados incompletos retorna 400');
    assert(res.body.success === false, 'contato inválido retorna success: false');
  }

  // GET / deve retornar HTML
  {
    const res = await request({ host, port, path: '/', method: 'GET' });
    assert(res.status === 200, 'GET / retorna 200');
  }

  // GET /login deve retornar HTML
  {
    const res = await request({ host, port, path: '/login', method: 'GET' });
    assert(res.status === 200, 'GET /login retorna 200');
  }

  // GET /contato deve retornar HTML
  {
    const res = await request({ host, port, path: '/contato', method: 'GET' });
    assert(res.status === 200, 'GET /contato retorna 200');
  }

  server.close();

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
}

run().catch(err => { console.error(err); process.exit(1); });
