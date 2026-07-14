import express from 'express'
import { query } from '../config/db.js'

const router = express.Router()

// GET - Listar todas as obras
router.get('/', async (req, res) => {
  try {
    const result = await query(
      `SELECT o.*, a.nome_completo, a.pseudonimo_artistico, alb.titulo as album_titulo
       FROM obras o
       LEFT JOIN artistas a ON o.artista_id = a.id
       LEFT JOIN albuns alb ON o.album_id = alb.id
       ORDER BY o.titulo`
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar obras' })
  }
})

// GET - Obras por artista
router.get('/artista/:artista_id', async (req, res) => {
  try {
    const { artista_id } = req.params
    const result = await query(
      `SELECT o.*, alb.titulo as album_titulo
       FROM obras o
       LEFT JOIN albuns alb ON o.album_id = alb.id
       WHERE o.artista_id = $1
       ORDER BY o.titulo`,
      [artista_id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar obras do artista' })
  }
})

// POST - Criar nova obra
router.post('/', async (req, res) => {
  try {
    const { titulo, isrc, letra, status, artista_id, album_id } = req.body

    const result = await query(
      `INSERT INTO obras (titulo, isrc, letra, status, artista_id, album_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [titulo, isrc, letra, status || 'pendente', artista_id, album_id]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Erro ao criar obra' })
  }
})

// PUT - Atualizar obra
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { titulo, isrc, letra, status } = req.body

    const result = await query(
      `UPDATE obras 
       SET titulo = COALESCE($2, titulo),
           isrc = COALESCE($3, isrc),
           letra = COALESCE($4, letra),
           status = COALESCE($5, status)
       WHERE id = $1
       RETURNING *`,
      [id, titulo, isrc, letra, status]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Obra não encontrada' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao atualizar obra' })
  }
})

// DELETE - Deletar obra
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    await query('DELETE FROM obras WHERE id = $1', [id])
    res.json({ message: 'Obra deletada com sucesso' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao deletar obra' })
  }
})

export default router
