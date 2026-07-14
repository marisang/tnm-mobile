import { query } from '../config/db.js'

const setupDatabase = async () => {
  try {
    console.log('🔄 Criando tabelas do banco de dados...')

    // Tabela artistas
    await query(`
      CREATE TABLE IF NOT EXISTS artistas (
        id SERIAL PRIMARY KEY,
        nome_completo VARCHAR(255) NOT NULL,
        pseudonimo_artistico VARCHAR(255),
        cpf CHAR(11) UNIQUE NOT NULL,
        rg VARCHAR(20),
        orgao_emissor VARCHAR(50),
        data_nascimento DATE,
        nacionalidade VARCHAR(100),
        estado_civil VARCHAR(50),
        profissao VARCHAR(100),
        email VARCHAR(255),
        celular VARCHAR(20),
        endereco_completo VARCHAR(500),
        bairro VARCHAR(100),
        municipio VARCHAR(100),
        uf CHAR(2),
        cep CHAR(8),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Tabela albuns
    await query(`
      CREATE TABLE IF NOT EXISTS albuns (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        capa_url VARCHAR(500),
        data_lancamento DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Tabela obras
    await query(`
      CREATE TABLE IF NOT EXISTS obras (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        isrc CHAR(12) UNIQUE,
        letra TEXT,
        status VARCHAR(50),
        artista_id INTEGER,
        album_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (artista_id) REFERENCES artistas(id) ON DELETE CASCADE,
        FOREIGN KEY (album_id) REFERENCES albuns(id) ON DELETE CASCADE
      )
    `)

    // Tabela compositores
    await query(`
      CREATE TABLE IF NOT EXISTS compositores (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        cpf CHAR(11) UNIQUE NOT NULL,
        obra_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (obra_id) REFERENCES obras(id) ON DELETE CASCADE
      )
    `)

    // Tabela contratos
    await query(`
      CREATE TABLE IF NOT EXISTS contratos (
        id SERIAL PRIMARY KEY,
        tipo_contrato VARCHAR(100),
        status VARCHAR(50),
        artista_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (artista_id) REFERENCES artistas(id) ON DELETE RESTRICT
      )
    `)

    // Tabela transacoes_financeiras
    await query(`
      CREATE TABLE IF NOT EXISTS transacoes_financeiras (
        id SERIAL PRIMARY KEY,
        origem_receita VARCHAR(100),
        valor_arrecadado NUMERIC(15,2),
        valor_repasse NUMERIC(15,2),
        data_competencia DATE,
        artista_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (artista_id) REFERENCES artistas(id) ON DELETE CASCADE
      )
    `)

    // Tabela shows
    await query(`
      CREATE TABLE IF NOT EXISTS shows (
        id SERIAL PRIMARY KEY,
        titulo_evento VARCHAR(255) NOT NULL,
        data_evento DATE,
        local_nome VARCHAR(255),
        banner_url VARCHAR(500),
        link_ingressos VARCHAR(500),
        contato_whatsapp VARCHAR(20),
        release_texto TEXT,
        status_publicacao VARCHAR(50),
        artista_id INTEGER,
        usuario_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (artista_id) REFERENCES artistas(id) ON DELETE CASCADE
      )
    `)

    // Tabela obras_transacoes (relação M:M)
    await query(`
      CREATE TABLE IF NOT EXISTS obras_transacoes (
        obra_id INTEGER NOT NULL,
        transacao_id INTEGER NOT NULL,
        PRIMARY KEY (obra_id, transacao_id),
        FOREIGN KEY (obra_id) REFERENCES obras(id) ON DELETE RESTRICT,
        FOREIGN KEY (transacao_id) REFERENCES transacoes_financeiras(id) ON DELETE SET NULL
      )
    `)

    // Tabela albuns_artistas (relação M:M)
    await query(`
      CREATE TABLE IF NOT EXISTS albuns_artistas (
        album_id INTEGER NOT NULL,
        artista_id INTEGER NOT NULL,
        PRIMARY KEY (album_id, artista_id),
        FOREIGN KEY (album_id) REFERENCES albuns(id) ON DELETE RESTRICT,
        FOREIGN KEY (artista_id) REFERENCES artistas(id) ON DELETE RESTRICT
      )
    `)

    console.log('✅ Banco de dados configurado com sucesso!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Erro ao configurar banco de dados:', err)
    process.exit(1)
  }
}

setupDatabase()
