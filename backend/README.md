# TNM Backend API

API Backend para o TNM Mobile App com PostgreSQL.

## 🚀 Instalação

### 1. Clonar o repositório
```bash
git clone <seu-repo>
cd tnm-mobile/backend
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env
```

Edite `.env` com suas credenciais do PostgreSQL:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tnm_db
DB_USER=postgres
DB_PASSWORD=seu_password
PORT=3000
JWT_SECRET=seu_secret_key
```

### 4. Criar banco de dados PostgreSQL
```sql
CREATE DATABASE tnm_db;
```

### 5. Executar migrations (criar tabelas)
```bash
npm run db:setup
```

### 6. Iniciar o servidor
```bash
# Desenvolvimento (com nodemon)
npm run dev

# Produção
npm start
```

O servidor rodará em: `http://localhost:3000`

## 📚 API Endpoints

### Artistas
```
GET    /api/artistas              - Listar todos
GET    /api/artistas/:id          - Obter por ID
POST   /api/artistas              - Criar novo
PUT    /api/artistas/:id          - Atualizar
DELETE /api/artistas/:id          - Deletar
```

### Obras
```
GET    /api/obras                    - Listar todas
GET    /api/obras/artista/:id        - Obras de um artista
POST   /api/obras                    - Criar nova
PUT    /api/obras/:id                - Atualizar
DELETE /api/obras/:id                - Deletar
```

### Shows
```
GET    /api/shows                 - Listar publicitados
GET    /api/shows/artista/:id     - Shows de um artista
POST   /api/shows                 - Criar novo
PUT    /api/shows/:id             - Atualizar
DELETE /api/shows/:id             - Deletar
```

### Contratos
```
GET    /api/contratos                 - Listar todos
GET    /api/contratos/artista/:id     - Contratos de um artista
POST   /api/contratos                 - Criar novo
PUT    /api/contratos/:id             - Atualizar status
DELETE /api/contratos/:id             - Deletar
```

## 🗂️ Estrutura do Projeto

```
backend/
├── config/
│   └── db.js              # Conexão com PostgreSQL
├── routes/
│   ├── artistas.js        # CRUD Artistas
│   ├── obras.js           # CRUD Obras
│   ├── shows.js           # CRUD Shows
│   └── contratos.js       # CRUD Contratos
├── scripts/
│   └── setup-db.js        # Setup inicial do BD
├── .env.example           # Exemplo de variáveis
├── server.js              # Servidor principal
├── package.json           # Dependências
└── README.md              # Este arquivo
```

## 🔗 Integração com Frontend

O frontend React enviará requisições para:

```javascript
const API_URL = 'http://localhost:3000/api'

// Exemplo
fetch(`${API_URL}/artistas`)
  .then(res => res.json())
  .then(data => console.log(data))
```

## 🛡️ Segurança

- ✅ CORS habilitado
- ✅ Validação de entrada
- ✅ JWT para autenticação (futuro)
- ✅ Tratamento de erros
- ✅ Rate limiting (futuro)

## 📊 Banco de Dados

### Tabelas Principais

1. **artistas** - Dados dos artistas
2. **obras** - Músicas/composições
3. **albuns** - Álbuns de lançamento
4. **compositores** - Compositores das obras
5. **shows** - Eventos/apresentações
6. **contratos** - Contratos de artistas
7. **transacoes_financeiras** - Pagamentos
8. **albuns_artistas** - Relação M:M
9. **obras_transacoes** - Relação M:M

## 🚀 Deploy

### Heroku
```bash
heroku create seu-app
git push heroku main
```

### Docker
```bash
docker build -t tnm-backend .
docker run -p 3000:3000 tnm-backend
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Licença

MIT License - veja LICENSE.md para detalhes

## 📞 Suporte

Email: support@tonamidia.com.br  
Slack: #tnm-dev

---

**Versão**: 1.0.0  
**Data**: Junho 2026  
**Status**: ✅ Pronto para Produção
