import express from 'express';
import supabase from '../config/supabase.js';

const router = express.Router();

// GET - Listar todas as transações
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transacoes_financeiras')
      .select(`
        *,
        artistas (nome_completo, pseudonimo_artistico)
      `)
      .order('data_competencia', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Buscar transação por ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transacoes_financeiras')
      .select(`
        *,
        artistas (nome_completo, pseudonimo_artistico)
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Transação não encontrada' });
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Listar transações por artista
router.get('/artista/:artistaId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transacoes_financeiras')
      .select('*')
      .eq('artista_id', req.params.artistaId)
      .order('data_competencia', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Obter obras de uma transação
router.get('/:id/obras', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('obras_transacoes')
      .select(`
        obra_id,
        obras (titulo, isrc, artistas (nome_completo))
      `)
      .eq('transacao_id', req.params.id);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Criar nova transação
router.post('/', async (req, res) => {
  try {
    const { obras, ...transacaoData } = req.body;

    // Criar transação
    const { data: transacao, error: transacaoError } = await supabase
      .from('transacoes_financeiras')
      .insert([transacaoData])
      .select()
      .single();

    if (transacaoError) throw transacaoError;

    // Associar obras à transação (se fornecidas)
    if (obras && obras.length > 0) {
      const obrasTransacoes = obras.map(obraId => ({
        obra_id: obraId,
        transacao_id: transacao.id
      }));

      const { error: obrasError } = await supabase
        .from('obras_transacoes')
        .insert(obrasTransacoes);

      if (obrasError) throw obrasError;
    }

    res.status(201).json(transacao);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Atualizar transação
router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transacoes_financeiras')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Transação não encontrada' });
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Remover transação
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('transacoes_financeiras')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
