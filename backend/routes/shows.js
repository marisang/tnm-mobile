import express from 'express';
import supabase from '../config/supabase.js';

const router = express.Router();

// GET - Listar todos os shows
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('shows')
      .select(`
        *,
        artistas (nome_completo, pseudonimo_artistico)
      `)
      .order('data_evento', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Listar shows publicados (vitrine)
router.get('/publicados', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('shows')
      .select(`
        *,
        artistas (nome_completo, pseudonimo_artistico)
      `)
      .eq('status_publicacao', 'publicado')
      .gte('data_evento', new Date().toISOString())
      .order('data_evento', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Buscar show por ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('shows')
      .select(`
        *,
        artistas (nome_completo, pseudonimo_artistico, email, celular)
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Show não encontrado' });
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Listar shows por artista
router.get('/artista/:artistaId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('shows')
      .select('*')
      .eq('artista_id', req.params.artistaId)
      .order('data_evento', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Criar novo show
router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('shows')
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Atualizar show
router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('shows')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Show não encontrado' });
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Remover show
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('shows')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
