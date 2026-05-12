# Leandro Dev

Projeto base em Node.js com:

- landing page profissional
- seção de portfólio
- tela de login demonstrativa
- página de contato
- API simples em Express
- workflow GitHub Actions com CI e deploy opcional no Azure

## Como executar

```bash
npm install
npm run build
npm test
npm start
```

O servidor sobe por padrão em `http://localhost:3000`.

## Rotas principais

- `/` landing page e portfólio
- `/login` tela de login
- `/contato` página de contato
- `/api/profile` dados do perfil
- `/api/login` login demonstrativo
- `/api/contact` envio de contato
