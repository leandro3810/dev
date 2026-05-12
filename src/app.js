const express = require('express');
const path = require('path');

const app = express();
const publicDir = path.join(__dirname, '..', 'public');
const hasValidEmailFormat = (value) => {
  if (!value || value.includes(' ')) {
    return false;
  }

  const atIndex = value.indexOf('@');
  const dotIndex = value.lastIndexOf('.');

  return atIndex > 0 && dotIndex > atIndex + 1 && dotIndex < value.length - 1;
};

const profile = {
  name: 'Leandro Dev',
  role: 'Desenvolvedor full stack',
  summary: 'Crio experiências web rápidas, acessíveis e prontas para deploy.',
  skills: ['Node.js', 'Express', 'HTML', 'CSS', 'GitHub Actions', 'Azure'],
  projects: [
    {
      id: 1,
      name: 'Portfólio responsivo',
      description: 'Página de apresentação com foco em conversão e identidade profissional.',
    },
    {
      id: 2,
      name: 'API de contato',
      description: 'Endpoint simples para receber mensagens com validação básica.',
    },
    {
      id: 3,
      name: 'Pipeline de deploy',
      description: 'Fluxo CI/CD com build, testes e publicação opcional no Azure.',
    },
  ],
};

app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(publicDir));

app.get('/login', (_request, response) => {
  response.redirect('/login.html');
});

app.get('/contato', (_request, response) => {
  response.redirect('/contato.html');
});

app.get('/api/profile', (_request, response) => {
  response.json(profile);
});

app.post('/api/login', (request, response) => {
  const email = `${request.body.email || ''}`.trim().toLowerCase();
  const password = `${request.body.password || ''}`;

  if (!email || !password) {
    return response.status(400).json({ error: 'Informe email e senha.' });
  }

  if (!hasValidEmailFormat(email)) {
    return response.status(400).json({ error: 'Informe um email válido.' });
  }

  if (password.length < 6) {
    return response.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
  }

  return response.json({
    message: 'Login de demonstração realizado com sucesso.',
    user: { email },
    demoMode: true,
  });
});

app.post('/api/contact', (request, response) => {
  const name = `${request.body.name || ''}`.trim();
  const email = `${request.body.email || ''}`.trim().toLowerCase();
  const message = `${request.body.message || ''}`.trim();

  if (!name || !email || !message) {
    return response.status(400).json({ error: 'Preencha nome, email e mensagem.' });
  }

  if (name.length < 2 || name.length > 80) {
    return response.status(400).json({ error: 'O nome deve ter entre 2 e 80 caracteres.' });
  }

  if (!hasValidEmailFormat(email)) {
    return response.status(400).json({ error: 'Informe um email válido.' });
  }

  if (message.length < 10 || message.length > 1000) {
    return response.status(400).json({ error: 'A mensagem deve ter entre 10 e 1000 caracteres.' });
  }

  return response.status(201).json({
    message: 'Mensagem recebida com sucesso.',
    contact: { name, email },
  });
});

module.exports = { app };
