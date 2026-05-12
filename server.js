'use strict';

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/contato', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contato.html'));
});

// API
app.get('/api/profile', (req, res) => {
  res.json({
    name: 'Leandro',
    role: 'Desenvolvedor Full Stack',
    bio: 'Apaixonado por tecnologia e soluções criativas.',
    skills: ['Node.js', 'JavaScript', 'Express', 'HTML', 'CSS'],
    projects: [
      { title: 'Portfolio Pessoal', description: 'Site de portfólio com Express e páginas estáticas.' },
      { title: 'API REST', description: 'API demonstrativa com autenticação e rotas CRUD.' }
    ]
  });
});

// Demo login – credentials are intentionally hardcoded for demonstration purposes only.
// Do NOT use this pattern in a production application.
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    return res.json({ success: true, message: 'Login realizado com sucesso.' });
  }
  return res.status(401).json({ success: false, message: 'Usuário ou senha inválidos.' });
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios.' });
  }
  return res.json({ success: true, message: 'Mensagem recebida com sucesso!' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;
