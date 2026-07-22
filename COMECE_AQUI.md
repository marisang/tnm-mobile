# 🚀 COMECE AQUI - TNM Mobile + Supabase

## ✅ Status Atual

### Configuração
- ✅ Backend: Dependências instaladas (109 pacotes)
- ✅ Frontend: Dependências instaladas
- ✅ Backend .env: **CONFIGURADO** ✅
- ✅ Frontend .env: **CONFIGURADO** ✅
- ✅ Supabase: Credenciais válidas
- ⏳ Banco de dados: **PRECISA CRIAR TABELAS**

---

## 🎯 Próximos 3 Passos (10 minutos)

### 1️⃣ Criar Tabelas no Supabase (5 min)

1. **Acesse seu projeto:**
   https://supabase.com/dashboard/project/lnwxyrbjvhzecuiflfyu

2. **Vá em SQL Editor** (menu lateral esquerdo)

3. **Clique em "New Query"**

4. **Cole este script e execute:**

```sql
-- CRIAR TABELAS
CREATE TABLE artistas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_completo VARCHAR(255) NOT NULL,
  pseudonimo_artistico VARCHAR(255),
  cpf VARCHAR(14) UNIQUE,
  rg VARCHAR(20),
  orgao_emissor VARCHAR(50),
  data_nascimento DATE,
  nacionalidade VARCHAR(100),
  estado_civil VARCHAR(50),
  profissao VARCHAR(100),
  email VARCHAR(255),
  celular VARCHAR(20),
  endereco_completo TEXT,
  bairro VARCHAR(100),
  municipio VARCHAR(100),
  uf VARCHAR(2),
  cep VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE albuns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(255) NOT NULL,
  capa_url TEXT,
  data_lancamento DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE obras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(255) NOT NULL,
  isrc VARCHAR(50),
  letra TEXT,
  status VARCHAR(50),
  artista_id UUID REFERENCES artistas(id) ON DELETE CASCADE,
  album_id UUID REFERENCES albuns(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE compositores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(14),
  obra_id UUID REFERENCES obras(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE contratos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_contrate VARCHAR(100),
  status VARCHAR(50),
  artista_id UUID REFERENCES artistas(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE transacoes_financeiras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  descricao TEXT,
  valor_arrecadado NUMERIC(12, 2),
  valor_repasse NUMERIC(12, 2),
  data_competencia DATE,
  artista_id UUID REFERENCES artistas(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE shows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo_evento VARCHAR(255) NOT NULL,
  data_evento DATE,
  local_nome VARCHAR(255),
  banner_url TEXT,
  link_ingressos TEXT,
  contato_whatsapp VARCHAR(20),
  release_texto TEXT,
  status_publicacao VARCHAR(50) DEFAULT 'rascunho',
  artista_id UUID REFERENCES artistas(id) ON DELETE CASCADE,
  usuario_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE albuns_artistas (
  album_id UUID REFERENCES albuns(id) ON DELETE CASCADE,
  artista_id UUID REFERENCES artistas(id) ON DELETE CASCADE,
  PRIMARY KEY (album_id, artista_id)
);

CREATE TABLE obras_transacoes (
  obra_id UUID REFERENCES obras(id) ON DELETE CASCADE,
  transacao_id UUID REFERENCES transacoes_financeiras(id) ON DELETE CASCADE,
  PRIMARY KEY (obra_id, transacao_id)
);

-- CRIAR ÍNDICES
CREATE INDEX idx_obras_artista ON obras(artista_id);
CREATE INDEX idx_obras_album ON obras(album_id);
CREATE INDEX idx_shows_artista ON shows(artista_id);
CREATE INDEX idx_shows_status ON shows(status_publicacao);
CREATE INDEX idx_shows_data ON shows(data_evento);
CREATE INDEX idx_contratos_artista ON contratos(artista_id);
CREATE INDEX idx_transacoes_artista ON transacoes_financeiras(artista_id);
CREATE INDEX idx_transacoes_data ON transacoes_financeiras(data_competencia);

-- INSERIR ARTISTA DE TESTE
INSERT INTO artistas (nome_completo, pseudonimo_artistico, email, celular)
VALUES ('João da Silva', 'DJ João', 'joao@example.com', '(11) 98765-4321');
```

5. **Clique em RUN** (ou Ctrl+Enter)

✅ **Resultado esperado:** "Success. No rows returned"

6. **Verificar:** Vá em "Table Editor" → Deve ver 9 tabelas

---

### 2️⃣ Iniciar Backend (2 min)

```bash
cd backend
npm run dev
```

✅ **Você deve ver:**
```
🚀 Servidor rodando na porta 3000
📍 Health check: http://localhost:3000/health
```

**Teste:**
```bash
curl http://localhost:3000/health
```

Deve retornar:
```json
{"status":"ok","message":"TNM API está funcionando!"}
```

---

### 3️⃣ Iniciar Frontend (2 min)

**Abra outro terminal:**

```bash
cd App
npm run dev
```

✅ **Você deve ver:**
```
VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Acesse:** http://localhost:5173

---

## 🎉 Pronto! Teste Agora

### Teste 1: Ver Artistas
```bash
curl http://localhost:3000/api/artistas
```
**Esperado:** Deve listar "DJ João"

### Teste 2: Cadastrar Show
1. Acesse http://localhost:5173
2. Vá em "Cadastrar Show"
3. Veja se "DJ João" aparece no dropdown de artistas ✅
4. Preencha:
   - Título: "Show de Lançamento"
   - Data: Escolha uma data futura
   - Local: "Teatro Municipal"
   - Status: "Publicado"
5. Clique em "CADASTRAR"

### Teste 3: Ver na Vitrine
1. Vá em "Vitrine de Shows"
2. Seu show deve aparecer! 🎉

---

## 📊 O Que Você Pode Fazer

### Vitrine de Shows
- ✅ Ver todos os shows publicados
- ✅ Ver informações do artista
- ✅ Link para comprar ingressos
- ✅ Data e local do evento

### Cadastrar Show
- ✅ Selecionar artista
- ✅ Definir data e local
- ✅ Adicionar link de ingressos
- ✅ Publicar ou salvar como rascunho

### Meus Lançamentos
- ✅ Ver todas as obras cadastradas
- ✅ Ver código ISRC
- ✅ Excluir obras

### Cadastrar Obra
- ✅ Selecionar artista
- ✅ Adicionar título e letra
- ✅ Informar ISRC
- ✅ Gerenciar compositores

---

## 🗂️ Estrutura do Projeto

```
tnm-mobile/
├── backend/                    ← API Node.js + Express
│   ├── config/supabase.js     ← Conexão Supabase ✅
│   ├── routes/                ← 6 rotas (37 endpoints) ✅
│   ├── .env                   ← Configurado ✅
│   └── server.js              ← Servidor Express
│
├── App/                        ← Frontend React + Vite
│   ├── src/
│   │   ├── config/supabase.js ← Cliente Supabase ✅
│   │   ├── hooks/             ← 3 hooks customizados ✅
│   │   ├── services/api.js    ← 6 serviços API ✅
│   │   └── pages/             ← 4 páginas integradas ✅
│   └── .env                   ← Configurado ✅
│
└── Documentação/               ← 10 guias completos
```

---

## 📚 Documentação Disponível

1. **COMECE_AQUI.md** ← Você está aqui
2. **STATUS_CONFIGURACAO.md** - Status dos .env
3. **SETUP_SUPABASE.md** - Guia detalhado completo
4. **SUPABASE_INTEGRATION.md** - Visão geral técnica
5. **EXEMPLO_USO.md** - Exemplos de código
6. **COMANDOS_UTEIS.md** - Comandos práticos
7. **INTEGRACAO_COMPLETA.md** - O que foi integrado
8. **RELATORIO_FINAL.md** - Relatório técnico
9. **RESUMO_FINAL.md** - Resumo executivo
10. **VERIFICACAO_FINAL.md** - Checklist completo

---

## 🆘 Problemas Comuns

### Backend não inicia
```bash
# Verificar se está no diretório correto
cd backend

# Verificar se instalou dependências
npm install

# Verificar arquivo .env
type .env
```

### Frontend não inicia
```bash
# Verificar se está no diretório correto
cd App

# Limpar cache se necessário
rmdir /s /q node_modules
npm install
```

### "relation does not exist"
→ Execute o script SQL no passo 1️⃣

### Dropdown de artistas vazio
→ Execute o INSERT do artista de teste no passo 1️⃣

### Port 3000 já está em uso
```bash
# Ver o que está usando
netstat -ano | findstr :3000

# Matar processo (substitua PID)
taskkill /PID NUMERO_PID /F
```

---

## ✅ Checklist Final

### Banco de Dados
- [ ] Acessei o painel do Supabase
- [ ] Executei o script SQL completo
- [ ] Vi 9 tabelas criadas
- [ ] Artista "DJ João" foi inserido

### Backend
- [x] Dependências instaladas
- [x] Arquivo .env configurado
- [ ] Servidor iniciado (npm run dev)
- [ ] Health check funcionando

### Frontend
- [x] Dependências instaladas
- [x] Arquivo .env configurado
- [ ] App iniciado (npm run dev)
- [ ] Interface aberta no navegador

### Testes
- [ ] Listei artistas via API
- [ ] "DJ João" aparece no dropdown
- [ ] Cadastrei um show
- [ ] Show aparece na vitrine

---

## 🎯 Resumo Rápido

1. ✅ **Configuração:** Feita
2. ⏳ **Banco:** Criar tabelas (5 min)
3. ⏳ **Backend:** Iniciar servidor (1 min)
4. ⏳ **Frontend:** Iniciar app (1 min)
5. ⏳ **Testar:** Cadastrar e ver show (3 min)

**Total:** ~10 minutos até estar funcionando! 🚀

---

## 💡 Dica

Mantenha 2 terminais abertos:
- **Terminal 1:** Backend (`cd backend && npm run dev`)
- **Terminal 2:** Frontend (`cd App && npm run dev`)

Ambos precisam estar rodando ao mesmo tempo!

---

**Tudo pronto para começar! 🎉**

**Seu projeto Supabase:**  
https://supabase.com/dashboard/project/lnwxyrbjvhzecuiflfyu

**Dúvidas?** Leia `SETUP_SUPABASE.md` para guia detalhado.

---

**Última atualização:** 22/07/2026  
**Status:** ✅ CONFIGURADO E PRONTO
