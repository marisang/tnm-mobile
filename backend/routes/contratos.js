import express from 'express';
import supabase from '../config/supabase.js';

const router = express.Router();

// GET - Listar todos os contratos
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contratos')
      .select(`
        *,
        artistas (nome_completo, pseudonimo_artistico, cpf)
      `)
      .order('id', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Buscar contrato por ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contratos')
      .select(`
        *,
        artistas (*)
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Contrato não encontrado' });
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Listar contratos por artista
router.get('/artista/:artistaId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contratos')
      .select('*')
      .eq('artista_id', req.params.artistaId)
      .order('id', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Criar novo contrato
router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contratos')
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Atualizar contrato
router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contratos')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Contrato não encontrado' });
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Remover contrato
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('contratos')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
