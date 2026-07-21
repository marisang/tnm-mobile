import express from 'express'
import { query } from '../config/db.js'

const router = express.Router()

// GET - Listar todos os artistas
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM artistas ORDER BY nome_completo')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar artistas' })
  }
})

// GET - Obter artista por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await query('SELECT * FROM artistas WHERE id = $1', [id])
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Artista não encontrado' })
    }
    
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar artista' })
  }
})

// POST - Criar novo artista
router.post('/', async (req, res) => {
  try {
    const {
      nome_completo,
      pseudonimo_artistico,
      cpf,
      rg,
      orgao_emissor,
      data_nascimento,
      nacionalidade,
      estado_civil,
      profissao,
      email,
      celular,
      endereco_completo,
      bairro,
      municipio,
      uf,
      cep,
    } = req.body

    const result = await query(
      `INSERT INTO artistas (
        nome_completo, pseudonimo_artistico, cpf, rg, orgao_emissor,
        data_nascimento, nacionalidade, estado_civil, profissao,
        email, celular, endereco_completo, bairro, municipio, uf, cep
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *`,
      [
        nome_completo,
        pseudonimo_artistico,
        cpf,
        rg,
        orgao_emissor,
        data_nascimento,
        nacionalidade,
        estado_civil,
        profissao,
        email,
        celular,
        endereco_completo,
        bairro,
        municipio,
        uf,
        cep,
      ]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Erro ao criar artista' })
  }
})

// PUT - Atualizar artista
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const fields = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ')

    const values = Object.values(updates)
    values.push(id)

    const result = await query(
      `UPDATE artistas SET ${fields} WHERE id = $${fields.split(',').length + 1} RETURNING *`,
      values
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Artista não encontrado' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao atualizar artista' })
  }
})

// DELETE - Deletar artista
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    await query('DELETE FROM artistas WHERE id = $1', [id])
    res.json({ message: 'Artista deletado com sucesso' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao deletar artista' })
  }
})

export default router
