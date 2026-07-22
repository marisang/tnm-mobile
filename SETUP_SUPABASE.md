# 🚀 Guia de Setup Supabase - TNM Mobile

## Passo 1: Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Crie uma conta ou faça login
4. Clique em "New Project"
5. Preencha:
   - Nome do projeto: `tnm-mobile`
   - Database Password: (escolha uma senha forte)
   - Região: `South America (São Paulo)`
6. Clique em "Create new project"

## Passo 2: Criar Tabelas no Banco de Dados

Acesse o SQL Editor no Supabase e execute o script abaixo:

```sql
-- TABELA: artistas
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

-- TABELA: albuns
CREATE TABLE albuns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(255) NOT NULL,
  capa_url TEXT,
  data_lancamento DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA: obras
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

-- TABELA: compositores
CREATE TABLE compositores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(14),
  obra_id UUID REFERENCES obras(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA: contratos
CREATE TABLE contratos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_contrate VARCHAR(100),
  status VARCHAR(50),
  artista_id UUID REFERENCES artistas(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA: transacoes_financeiras
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

-- TABELA: shows
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

-- TABELAS DE RELACIONAMENTO

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

-- ÍNDICES PARA PERFORMANCE

CREATE INDEX idx_obras_artista ON obras(artista_id);
CREATE INDEX idx_obras_album ON obras(album_id);
CREATE INDEX idx_shows_artista ON shows(artista_id);
CREATE INDEX idx_shows_status ON shows(status_publicacao);
CREATE INDEX idx_shows_data ON shows(data_evento);
CREATE INDEX idx_contratos_artista ON contratos(artista_id);
CREATE INDEX idx_transacoes_artista ON transacoes_financeiras(artista_id);
CREATE INDEX idx_transacoes_data ON transacoes_financeiras(data_competencia);
```

## Passo 3: Configurar Row Level Security (Opcional)

Para segurança adicional, configure políticas RLS:

```sql
-- Ativar RLS
ALTER TABLE shows ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública de shows publicados
CREATE POLICY "Shows publicados são públicos"
ON shows FOR SELECT
USING (status_publicacao = 'publicado');

-- Permitir que usuários autenticados vejam todos os shows
CREATE POLICY "Usuários autenticados veem todos os shows"
ON shows FOR SELECT
TO authenticated
USING (true);
```

## Passo 4: Obter Credenciais do Supabase

1. No painel do Supabase, vá em **Settings** > **API**
2. Copie as seguintes informações:
   - **Project URL**: `https://seu-projeto.supabase.co`
   - **anon/public key**: (chave pública)
   - **service_role key**: (chave privada - **nunca exponha no frontend**)

## Passo 5: Configurar o Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edite o arquivo `.env`:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
PORT=3000
NODE_ENV=development
```

## Passo 6: Configurar o Frontend

```bash
cd ../App
npm install
cp .env.example .env
```

Edite o arquivo `.env`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
VITE_API_URL=http://localhost:3000/api
```

## Passo 7: Testar a Integração

### Iniciar o Backend:
```bash
cd backend
npm run dev
```

Você deve ver:
```
🚀 Servidor rodando na porta 3000
📍 Health check: http://localhost:3000/health
```

### Iniciar o Frontend:
```bash
cd App
npm run dev
```

### Testar a API:
```bash
# Health Check
curl http://localhost:3000/health

# Listar artistas
curl http://localhost:3000/api/artistas

# Criar artista de teste
curl -X POST http://localhost:3000/api/artistas \
  -H "Content-Type: application/json" \
  -d '{
    "nome_completo": "João Silva",
    "pseudonimo_artistico": "DJ João",
    "email": "joao@example.com",
    "celular": "(11) 98765-4321"
  }'
```

## 🎯 Próximos Passos

1. **Autenticação**: Implementar login/registro de usuários
2. **Upload de Imagens**: Configurar Supabase Storage para banners e capas
3. **Real-time**: Adicionar subscriptions para atualizações em tempo real
4. **Backup**: Configurar backups automáticos do banco
5. **Deploy**: Hospedar o backend e frontend

## 📚 Recursos Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)

## 🆘 Problemas Comuns

### Erro: "relation does not exist"
→ Certifique-se de executar todo o script SQL de criação das tabelas

### Erro: "Invalid API key"
→ Verifique se copiou as chaves corretamente do painel do Supabase

### Erro: CORS
→ O Supabase permite requisições de qualquer origem por padrão. Se necessário, configure no backend

### Tabelas não aparecem
→ Aguarde alguns segundos após criar o projeto. O Supabase pode levar um tempo para inicializar

## ✅ Checklist de Configuração

- [ ] Projeto criado no Supabase
- [ ] Todas as tabelas criadas (9 tabelas no total)
- [ ] Índices criados para performance
- [ ] Credenciais copiadas do Supabase
- [ ] `.env` do backend configurado
- [ ] `.env` do frontend configurado
- [ ] Dependências instaladas (`npm install`)
- [ ] Backend iniciando sem erros
- [ ] Frontend iniciando sem erros
- [ ] API respondendo no `/health`
- [ ] Teste de criação de artista funcionando

Pronto! Seu projeto TNM Mobile está integrado com o Supabase! 🎉
