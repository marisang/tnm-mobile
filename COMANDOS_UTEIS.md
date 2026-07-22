# 🚀 Comandos Úteis - TNM Mobile

## 📦 Instalação Inicial

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd App
npm install  # já instalado ✅
```

---

## 🔧 Desenvolvimento

### Iniciar Backend (API)
```bash
cd backend
npm run dev
```
**Porta:** http://localhost:3000  
**Health Check:** http://localhost:3000/health

### Iniciar Frontend (React)
```bash
cd App
npm run dev
```
**Porta:** http://localhost:5173

### Ambos ao Mesmo Tempo (PowerShell)
```powershell
# Terminal 1
cd backend ; npm run dev

# Terminal 2 (novo terminal)
cd App ; npm run dev
```

---

## 🧪 Testes da API

### Health Check
```bash
curl http://localhost:3000/health
```

### Criar Artista
```bash
curl -X POST http://localhost:3000/api/artistas ^
  -H "Content-Type: application/json" ^
  -d "{\"nome_completo\":\"João Silva\",\"pseudonimo_artistico\":\"DJ João\",\"email\":\"joao@example.com\"}"
```

### Listar Artistas
```bash
curl http://localhost:3000/api/artistas
```

### Buscar Artista por ID
```bash
curl http://localhost:3000/api/artistas/UUID_DO_ARTISTA
```

### Criar Obra
```bash
curl -X POST http://localhost:3000/api/obras ^
  -H "Content-Type: application/json" ^
  -d "{\"titulo\":\"Minha Música\",\"isrc\":\"BR1234567890\",\"artista_id\":\"UUID_DO_ARTISTA\"}"
```

### Listar Obras
```bash
curl http://localhost:3000/api/obras
```

### Criar Show
```bash
curl -X POST http://localhost:3000/api/shows ^
  -H "Content-Type: application/json" ^
  -d "{\"titulo_evento\":\"Show de Lançamento\",\"data_evento\":\"2026-12-31\",\"local_nome\":\"Teatro Municipal\",\"artista_id\":\"UUID_DO_ARTISTA\",\"status_publicacao\":\"publicado\"}"
```

### Listar Shows Publicados
```bash
curl http://localhost:3000/api/shows/publicados
```

### Criar Contrato
```bash
curl -X POST http://localhost:3000/api/contratos ^
  -H "Content-Type: application/json" ^
  -d "{\"tipo_contrate\":\"Exclusividade\",\"status\":\"ativo\",\"artista_id\":\"UUID_DO_ARTISTA\"}"
```

### Criar Transação Financeira
```bash
curl -X POST http://localhost:3000/api/transacoes ^
  -H "Content-Type: application/json" ^
  -d "{\"descricao\":\"Pagamento de direitos autorais\",\"valor_arrecadado\":5000.00,\"valor_repasse\":3500.00,\"data_competencia\":\"2026-07-01\",\"artista_id\":\"UUID_DO_ARTISTA\"}"
```

### Criar Álbum
```bash
curl -X POST http://localhost:3000/api/albuns ^
  -H "Content-Type: application/json" ^
  -d "{\"titulo\":\"Meu Álbum\",\"data_lancamento\":\"2026-08-01\"}"
```

---

## 🔍 Verificações Úteis

### Verificar se Backend está rodando
```bash
curl http://localhost:3000/health
```
**Resposta esperada:**
```json
{"status":"ok","message":"TNM API está funcionando!"}
```

### Verificar Dependências do Backend
```bash
cd backend
npm list --depth=0
```

### Verificar Dependências do Frontend
```bash
cd App
npm list --depth=0
```

### Verificar Variáveis de Ambiente
```bash
# Backend
cd backend
type .env

# Frontend
cd App
type .env
```

---

## 🗄️ Supabase (SQL)

### Verificar Tabelas Criadas
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Contar Registros por Tabela
```sql
SELECT 'artistas' as tabela, COUNT(*) as total FROM artistas
UNION ALL
SELECT 'obras', COUNT(*) FROM obras
UNION ALL
SELECT 'shows', COUNT(*) FROM shows
UNION ALL
SELECT 'contratos', COUNT(*) FROM contratos
UNION ALL
SELECT 'transacoes_financeiras', COUNT(*) FROM transacoes_financeiras
UNION ALL
SELECT 'albuns', COUNT(*) FROM albuns;
```

### Inserir Artista de Teste
```sql
INSERT INTO artistas (nome_completo, pseudonimo_artistico, email, celular)
VALUES ('João da Silva', 'DJ João', 'joao@example.com', '(11) 98765-4321');
```

### Inserir Obra de Teste
```sql
INSERT INTO obras (titulo, isrc, artista_id)
VALUES ('Minha Primeira Música', 'BR1234567890', 'UUID_DO_ARTISTA');
```

### Listar Shows Publicados
```sql
SELECT * FROM shows 
WHERE status_publicacao = 'publicado' 
  AND data_evento >= CURRENT_DATE
ORDER BY data_evento ASC;
```

---

## 🛠️ Manutenção

### Limpar node_modules (Backend)
```bash
cd backend
rmdir /s /q node_modules
npm install
```

### Limpar node_modules (Frontend)
```bash
cd App
rmdir /s /q node_modules
npm install
```

### Atualizar Dependências
```bash
# Backend
cd backend
npm update

# Frontend
cd App
npm update
```

### Verificar Vulnerabilidades
```bash
# Backend
cd backend
npm audit

# Frontend
cd App
npm audit
```

---

## 📝 Logs e Debug

### Ver Logs do Backend
Os logs aparecem no terminal onde você executou `npm run dev`

### Ver Erros do Frontend
Abra o navegador e pressione `F12` para ver o Console

### Habilitar Logs Detalhados do Supabase
No arquivo de configuração, adicione:
```javascript
const supabase = createClient(url, key, {
  global: {
    headers: { 'x-my-custom-header': 'my-app-name' },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    log_level: 'info', // 'debug' para mais detalhes
  },
})
```

---

## 🔐 Segurança

### Verificar se .env está no .gitignore
```bash
type .gitignore | findstr ".env"
```

### Regenerar Chaves do Supabase
1. Vá em **Settings** > **API**
2. Role até **Project API keys**
3. Clique em **Regenerate** na chave desejada
4. Atualize seus arquivos `.env`

---

## 🚀 Build para Produção

### Build do Frontend
```bash
cd App
npm run build
```
Arquivos gerados em: `App/dist/`

### Preview do Build
```bash
cd App
npm run preview
```

### Build do Backend
O backend não precisa de build, mas você pode:
```bash
cd backend
npm start  # modo produção (sem nodemon)
```

---

## 📊 Monitoramento

### Ver Uso do Supabase
1. Acesse o painel do Supabase
2. Vá em **Settings** > **Usage**
3. Monitore:
   - Database size
   - API requests
   - Storage

### Verificar Performance da API
```bash
# Medir tempo de resposta
curl -w "@-" -o /dev/null -s http://localhost:3000/api/artistas <<'EOF'
time_namelookup:  %{time_namelookup}\n
time_connect:  %{time_connect}\n
time_starttransfer:  %{time_starttransfer}\n
time_total:  %{time_total}\n
EOF
```

---

## 🆘 Troubleshooting

### Erro: "Port 3000 already in use"
```bash
# Encontrar processo usando a porta 3000
netstat -ano | findstr :3000

# Matar o processo (substitua PID)
taskkill /PID NUMERO_DO_PID /F
```

### Erro: "Cannot find module"
```bash
# Backend
cd backend
npm install

# Frontend
cd App
npm install
```

### Erro: "Missing environment variables"
1. Verifique se o arquivo `.env` existe
2. Copie do `.env.example` se necessário
3. Preencha com suas credenciais do Supabase

### Erro: "relation does not exist"
Execute o script SQL completo no Supabase (veja `SETUP_SUPABASE.md`)

### Frontend não conecta no Backend
1. Verifique se o backend está rodando: `curl http://localhost:3000/health`
2. Verifique a variável `VITE_API_URL` no `App/.env`
3. Reinicie o frontend: `Ctrl+C` e `npm run dev` novamente

---

## 📚 Referências Rápidas

### Endpoints da API
```
GET    /health                              # Health check
GET    /api/artistas                        # Listar artistas
GET    /api/artistas/:id                    # Buscar artista
POST   /api/artistas                        # Criar artista
PUT    /api/artistas/:id                    # Atualizar artista
DELETE /api/artistas/:id                    # Deletar artista

GET    /api/obras                           # Listar obras
GET    /api/obras/artista/:artistaId        # Obras por artista
POST   /api/obras                           # Criar obra

GET    /api/shows                           # Listar shows
GET    /api/shows/publicados                # Shows publicados
POST   /api/shows                           # Criar show

GET    /api/contratos                       # Listar contratos
GET    /api/contratos/artista/:artistaId    # Contratos por artista

GET    /api/transacoes                      # Listar transações
GET    /api/transacoes/:id/obras            # Obras de uma transação

GET    /api/albuns                          # Listar álbuns
GET    /api/albuns/:id/artistas             # Artistas de um álbum
```

### Variáveis de Ambiente

**Backend (.env):**
```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
PORT=3000
NODE_ENV=development
```

**Frontend (.env):**
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
VITE_API_URL=http://localhost:3000/api
```

---

**Última atualização:** 22/07/2026
