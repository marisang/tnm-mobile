import express from 'express';
import supabase from '../config/supabase.js';

const router = express.Router();

// GET - Listar todos os artistas
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('artistas')
      .select('*')
      .order('nome_completo', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Buscar artista por ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('artistas')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Artista não encontrado' });
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Criar novo artista
router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('artistas')
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Atualizar artista
router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('artistas')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Artista não encontrado' });
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Remover artista
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('artistas')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
