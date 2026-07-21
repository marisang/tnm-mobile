import express from 'express'
import { query } from '../config/db.js'

const router = express.Router()

// GET - Listar todos os contratos
router.get('/', async (req, res) => {
  try {
    const result = await query(
      `SELECT c.*, a.nome_completo, a.pseudonimo_artistico
       FROM contratos c
       LEFT JOIN artistas a ON c.artista_id = a.id
       ORDER BY c.id DESC`
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar contratos' })
  }
})

// GET - Contratos de um artista
router.get('/artista/:artista_id', async (req, res) => {
  try {
    const { artista_id } = req.params
    const result = await query(
      `SELECT * FROM contratos
       WHERE artista_id = $1
       ORDER BY id DESC`,
      [artista_id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar contratos do artista' })
  }
})

// POST - Criar novo contrato
router.post('/', async (req, res) => {
  try {
    const { tipo_contrato, status, artista_id } = req.body

    const result = await query(
      `INSERT INTO contratos (tipo_contrato, status, artista_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [tipo_contrato, status || 'pendente', artista_id]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Erro ao criar contrato' })
  }
})

// PUT - Atualizar status do contrato
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const result = await query(
      `UPDATE contratos 
       SET status = $2
       WHERE id = $1
       RETURNING *`,
      [id, status]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contrato não encontrado' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao atualizar contrato' })
  }
})

// DELETE - Deletar contrato
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    await query('DELETE FROM contratos WHERE id = $1', [id])
    res.json({ message: 'Contrato deletado com sucesso' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao deletar contrato' })
  }
})

export default router
