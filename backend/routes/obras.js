import express from 'express';
import supabase from '../config/supabase.js';

const router = express.Router();

// GET - Listar todas as obras
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('obras')
      .select(`
        *,
        artistas (nome_completo, pseudonimo_artistico),
        albuns (titulo, capa_url)
      `)
      .order('titulo', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Buscar obra por ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('obras')
      .select(`
        *,
        artistas (nome_completo, pseudonimo_artistico),
        albuns (titulo, capa_url),
        compositores (nome, cpf)
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Obra não encontrada' });
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Listar obras por artista
router.get('/artista/:artistaId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('obras')
      .select(`
        *,
        artistas (nome_completo, pseudonimo_artistico),
        albuns (titulo, capa_url)
      `)
      .eq('artista_id', req.params.artistaId)
      .order('titulo', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Criar nova obra
router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('obras')
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Atualizar obra
router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('obras')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Obra não encontrada' });
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Remover obra
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('obras')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
