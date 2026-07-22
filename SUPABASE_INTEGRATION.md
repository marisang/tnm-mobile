# Integração Supabase - TNM Mobile

## 📋 Visão Geral

Este documento descreve a integração completa do Supabase no projeto TNM Mobile, substituindo a configuração anterior do PostgreSQL por uma solução moderna e escalável.

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

1. **artistas**
   - id (PK)
   - nome_completo, pseudonimo_artistico
   - cpf, rg, orgao_emissor
   - data_nascimento, nacionalidade
   - estado_civil, profissao
   - email, celular
   - endereco_completo, bairro, municipio, uf, cep

2. **obras**
   - id (PK)
   - titulo, isrc, letra
   - status
   - artista_id (FK → artistas)
   - album_id (FK → albuns)

3. **albuns**
   - id (PK)
   - titulo
   - capa_url
   - data_lancamento

4. **shows**
   - id (PK)
   - titulo_evento, data_evento
   - local_nome, banner_url
   - link_ingressos, contato_whatsapp
   - release_texto, status_publicacao
   - artista_id (FK → artistas)
   - usuario_id

5. **contratos**
   - id (PK)
   - tipo_contrate, status
   - artista_id (FK → artistas)

6. **transacoes_financeiras**
   - id (PK)
   - descricao
   - valor_arrecadado, valor_repasse
   - data_competencia
   - artista_id (FK → artistas)

7. **compositores**
   - id (PK)
   - nome, cpf
   - obra_id (FK → obras)

### Tabelas de Relacionamento

- **albuns_artistas** (album_id, artista_id)
- **obras_transacoes** (obra_id, transacao_id)

## 🔧 Configuração

### 1. Backend

#### Instalar Dependências
```bash
cd backend
npm install
```

#### Configurar Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env` e preencha:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
PORT=3000
```

#### Iniciar o Servidor
```bash
npm run dev
```

### 2. Frontend

#### Instalar Dependências
```bash
cd App
npm install
```

#### Configurar Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env` e preencha:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
VITE_API_URL=http://localhost:3000/api
```

#### Iniciar o App
```bash
npm run dev
```

## 🚀 API Endpoints

### Artistas
- `GET /api/artistas` - Listar todos
- `GET /api/artistas/:id` - Buscar por ID
- `POST /api/artistas` - Criar novo
- `PUT /api/artistas/:id` - Atualizar
- `DELETE /api/artistas/:id` - Remover

### Obras
- `GET /api/obras` - Listar todas
- `GET /api/obras/:id` - Buscar por ID
- `GET /api/obras/artista/:artistaId` - Por artista
- `POST /api/obras` - Criar nova
- `PUT /api/obras/:id` - Atualizar
- `DELETE /api/obras/:id` - Remover

### Shows
- `GET /api/shows` - Listar todos
- `GET /api/shows/publicados` - Apenas publicados
- `GET /api/shows/:id` - Buscar por ID
- `GET /api/shows/artista/:artistaId` - Por artista
- `POST /api/shows` - Criar novo
- `PUT /api/shows/:id` - Atualizar
- `DELETE /api/shows/:id` - Remover

### Contratos
- `GET /api/contratos` - Listar todos
- `GET /api/contratos/:id` - Buscar por ID
- `GET /api/contratos/artista/:artistaId` - Por artista
- `POST /api/contratos` - Criar novo
- `PUT /api/contratos/:id` - Atualizar
- `DELETE /api/contratos/:id` - Remover

### Transações Financeiras
- `GET /api/transacoes` - Listar todas
- `GET /api/transacoes/:id` - Buscar por ID
- `GET /api/transacoes/artista/:artistaId` - Por artista
- `GET /api/transacoes/:id/obras` - Obras da transação
- `POST /api/transacoes` - Criar nova
- `PUT /api/transacoes/:id` - Atualizar
- `DELETE /api/transacoes/:id` - Remover

### Álbuns
- `GET /api/albuns` - Listar todos
- `GET /api/albuns/:id` - Buscar por ID
- `GET /api/albuns/:id/artistas` - Artistas do álbum
- `POST /api/albuns` - Criar novo
- `PUT /api/albuns/:id` - Atualizar
- `DELETE /api/albuns/:id` - Remover

## 💡 Uso no Frontend

### Exemplo: Buscar Shows Publicados

```javascript
import supabase from './config/supabase';

async function buscarShowsPublicados() {
  const { data, error } = await supabase
    .from('shows')
    .select(`
      *,
      artistas (nome_completo, pseudonimo_artistico)
    `)
    .eq('status_publicacao', 'publicado')
    .gte('data_evento', new Date().toISOString())
    .order('data_evento', { ascending: true });

  if (error) {
    console.error('Erro:', error);
    return [];
  }

  return data;
}
```

### Exemplo: Criar Nova Obra

```javascript
async function criarObra(obraData) {
  const { data, error } = await supabase
    .from('obras')
    .insert([obraData])
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

## 🔐 Segurança

### Row Level Security (RLS)

Certifique-se de configurar as políticas de segurança no Supabase:

```sql
-- Exemplo: Permitir leitura pública de shows publicados
CREATE POLICY "Shows publicados são públicos"
ON shows FOR SELECT
USING (status_publicacao = 'publicado');

-- Exemplo: Apenas usuários autenticados podem criar shows
CREATE POLICY "Usuários autenticados podem criar shows"
ON shows FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = usuario_id);
```

## 📝 Próximos Passos

1. ✅ Integração básica do Supabase
2. ⬜ Implementar autenticação de usuários
3. ⬜ Configurar Row Level Security (RLS)
4. ⬜ Adicionar upload de imagens (Storage)
5. ⬜ Implementar real-time subscriptions
6. ⬜ Adicionar testes automatizados

## 🆘 Suporte

Para mais informações sobre o Supabase:
- [Documentação Oficial](https://supabase.com/docs)
- [Guia de JavaScript](https://supabase.com/docs/reference/javascript)
- [SQL Reference](https://supabase.com/docs/guides/database)
