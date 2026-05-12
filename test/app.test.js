const test = require('node:test');
const assert = require('node:assert/strict');
const { app } = require('../src/app');

let server;
let baseUrl;

test.before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

test.after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test('serves the landing page', async () => {
  const response = await fetch(baseUrl);
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(body, /Leandro Dev/);
});

test('returns the profile API payload', async () => {
  const response = await fetch(`${baseUrl}/api/profile`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.name, 'Leandro Dev');
  assert.equal(Array.isArray(body.projects), true);
});

test('validates login payloads', async () => {
  const response = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'invalido', password: '123' }),
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.match(body.error, /email válido|senha/);
});

test('accepts valid contact submissions', async () => {
  const response = await fetch(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Leandro',
      email: 'leandro@example.com',
      message: 'Gostaria de conversar sobre uma landing page nova.',
    }),
  });
  const body = await response.json();

  assert.equal(response.status, 201);
  assert.equal(body.contact.email, 'leandro@example.com');
});
