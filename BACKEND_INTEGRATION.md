# 🔌 Integração Backend - TNM Mobile App

## 📋 Sumário

- Frontend React em `App/`
- Backend Node.js/Express em `backend/`
- PostgreSQL como banco de dados

## 🚀 Setup Completo

### Passo 1: Instalar PostgreSQL

**Windows:**
- Download: https://www.postgresql.org/download/windows/
- Instalar e anotar senha do `postgres`

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

### Passo 2: Criar banco de dados

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar banco
CREATE DATABASE tnm_db;

# Sair
\q
```

### Passo 3: Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Editar `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tnm_db
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
PORT=3000
```

Criar tabelas:
```bash
npm run db:setup
```

Iniciar backend:
```bash
npm run dev
```

Teste: `http://localhost:3000/api/health`

### Passo 4: Setup Frontend

```bash
cd App
npm install
npm run dev
```

Teste: `http://localhost:5173`

## 🔗 Endpoints da API

### Artistas

```javascript
// Listar todos
GET /api/artistas

// Obter um
GET /api/artistas/:id

// Criar
POST /api/artistas
Body: { nome_completo, cpf, email, ... }

// Atualizar
PUT /api/artistas/:id
Body: { nome_completo, email, ... }

// Deletar
DELETE /api/artistas/:id
```

### Obras

```javascript
// Listar todas
GET /api/obras

// Obras de um artista
GET /api/obras/artista/:artista_id

// Criar
POST /api/obras
Body: { titulo, isrc, letra, artista_id }

// Atualizar
PUT /api/obras/:id
Body: { titulo, status }

// Deletar
DELETE /api/obras/:id
```

### Shows

```javascript
// Listar publicitados
GET /api/shows

// Shows de um artista
GET /api/shows/artista/:artista_id

// Criar
POST /api/shows
Body: { titulo_evento, data_evento, local_nome, artista_id, ... }

// Atualizar
PUT /api/shows/:id

// Deletar
DELETE /api/shows/:id
```

### Contratos

```javascript
// Listar todos
GET /api/contratos

// Contratos de um artista
GET /api/contratos/artista/:artista_id

// Criar
POST /api/contratos
Body: { tipo_contrato, artista_id }

// Atualizar status
PUT /api/contratos/:id
Body: { status }

// Deletar
DELETE /api/contratos/:id
```

## 🔄 Integração Frontend

### Criar arquivo de configuração da API

`App/src/config/api.js`:

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api'

export const api = {
  // Artistas
  artistas: {
    getAll: () => fetch(`${API_URL}/artistas`).then(r => r.json()),
    getById: (id) => fetch(`${API_URL}/artistas/${id}`).then(r => r.json()),
    create: (data) => fetch(`${API_URL}/artistas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    update: (id, data) => fetch(`${API_URL}/artistas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    delete: (id) => fetch(`${API_URL}/artistas/${id}`, { method: 'DELETE' }).then(r => r.json()),
  },

  // Obras
  obras: {
    getAll: () => fetch(`${API_URL}/obras`).then(r => r.json()),
    getByArtista: (artistaId) => fetch(`${API_URL}/obras/artista/${artistaId}`).then(r => r.json()),
    create: (data) => fetch(`${API_URL}/obras`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    update: (id, data) => fetch(`${API_URL}/obras/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    delete: (id) => fetch(`${API_URL}/obras/${id}`, { method: 'DELETE' }).then(r => r.json()),
  },

  // Shows
  shows: {
    getAll: () => fetch(`${API_URL}/shows`).then(r => r.json()),
    getByArtista: (artistaId) => fetch(`${API_URL}/shows/artista/${artistaId}`).then(r => r.json()),
    create: (data) => fetch(`${API_URL}/shows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    update: (id, data) => fetch(`${API_URL}/shows/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    delete: (id) => fetch(`${API_URL}/shows/${id}`, { method: 'DELETE' }).then(r => r.json()),
  },

  // Contratos
  contratos: {
    getAll: () => fetch(`${API_URL}/contratos`).then(r => r.json()),
    getByArtista: (artistaId) => fetch(`${API_URL}/contratos/artista/${artistaId}`).then(r => r.json()),
    create: (data) => fetch(`${API_URL}/contratos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    update: (id, status) => fetch(`${API_URL}/contratos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).then(r => r.json()),
    delete: (id) => fetch(`${API_URL}/contratos/${id}`, { method: 'DELETE' }).then(r => r.json()),
  }
}
```

### Usar nos componentes

```javascript
import { api } from '../config/api'
import { useEffect, useState } from 'react'

function MeusLancamentos() {
  const [obras, setObras] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregarObras = async () => {
      try {
        const artistaId = 1 // De alguma forma obter ID do artista
        const data = await api.obras.getByArtista(artistaId)
        setObras(data)
      } catch (err) {
        console.error('Erro:', err)
      } finally {
        setLoading(false)
      }
    }
    carregarObras()
  }, [])

  return (
    <>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div>
          {obras.map(obra => (
            <div key={obra.id}>{obra.titulo}</div>
          ))}
        </div>
      )}
    </>
  )
}
```

## 🌐 Deploy

### Backend no Heroku

```bash
cd backend
heroku create seu-app-backend
git push heroku main

# Set environment variables
heroku config:set DB_HOST=seu_host
heroku config:set DB_PASSWORD=sua_senha
```

### Frontend no Vercel

```bash
cd App
npm install -g vercel
vercel
# Configure API_URL para produção
```

## 📊 Estrutura de Dados

### Exemplo: Artista

```json
{
  "id": 1,
  "nome_completo": "João da Silva",
  "pseudonimo_artistico": "João Silva",
  "cpf": "12345678901",
  "email": "joao@example.com",
  "celular": "11999999999",
  "endereco_completo": "Rua A, 123",
  "municipio": "São Paulo",
  "uf": "SP",
  "cep": "01234567",
  "created_at": "2026-06-10T15:30:00.000Z"
}
```

### Exemplo: Obra

```json
{
  "id": 1,
  "titulo": "Minha Música",
  "isrc": "USRC17607839",
  "letra": "Verso 1...",
  "status": "publicada",
  "artista_id": 1,
  "album_id": 1,
  "created_at": "2026-06-10T15:30:00.000Z"
}
```

## 🔐 Segurança

- ✅ CORS configurado
- ✅ Validação de input
- ✅ Variáveis de ambiente
- ⚠️ JWT (implementar em produção)
- ⚠️ Rate limiting (implementar)

## 🆘 Troubleshooting

### "Connection refused"
- Verificar se PostgreSQL está rodando
- Verificar credenciais em `.env`

### "CORS error"
- Verificar se backend está rodando
- Verificar se API_URL está correto

### "Table does not exist"
- Rodar `npm run db:setup` no backend

## 📞 Suporte

Precisa de ajuda? Entre em contato com a equipe de desenvolvimento!

---

**Status**: ✅ Pronto para Integração  
**Versão**: 1.0.0  
**Data**: Junho 2026
