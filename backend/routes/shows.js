import express from 'express'
import { query } from '../config/db.js'

const router = express.Router()

// GET - Listar todos os shows
router.get('/', async (req, res) => {
  try {
    const result = await query(
      `SELECT s.*, a.nome_completo, a.pseudonimo_artistico
       FROM shows s
       LEFT JOIN artistas a ON s.artista_id = a.id
       WHERE s.status_publicacao = 'publicado'
       ORDER BY s.data_evento DESC`
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar shows' })
  }
})

// GET - Shows de um artista
router.get('/artista/:artista_id', async (req, res) => {
  try {
    const { artista_id } = req.params
    const result = await query(
      `SELECT * FROM shows
       WHERE artista_id = $1
       ORDER BY data_evento DESC`,
      [artista_id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar shows do artista' })
  }
})

// POST - Criar novo show
router.post('/', async (req, res) => {
  try {
    const {
      titulo_evento,
      data_evento,
      local_nome,
      banner_url,
      link_ingressos,
      contato_whatsapp,
      release_texto,
      status_publicacao,
      artista_id,
      usuario_id,
    } = req.body

    const result = await query(
      `INSERT INTO shows (
        titulo_evento, data_evento, local_nome, banner_url,
        link_ingressos, contato_whatsapp, release_texto,
        status_publicacao, artista_id, usuario_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        titulo_evento,
        data_evento,
        local_nome,
        banner_url,
        link_ingressos,
        contato_whatsapp,
        release_texto,
        status_publicacao || 'rascunho',
        artista_id,
        usuario_id,
      ]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Erro ao criar show' })
  }
})

// PUT - Atualizar show
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
      `UPDATE shows SET ${fields} WHERE id = $${fields.split(',').length + 1} RETURNING *`,
      values
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Show não encontrado' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao atualizar show' })
  }
})

// DELETE - Deletar show
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    await query('DELETE FROM shows WHERE id = $1', [id])
    res.json({ message: 'Show deletado com sucesso' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao deletar show' })
  }
})

export default router
