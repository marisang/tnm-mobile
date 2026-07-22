import express from 'express';
import supabase from '../config/supabase.js';

const router = express.Router();

// GET - Listar todos os álbuns
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('albuns')
      .select('*')
      .order('data_lancamento', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Buscar álbum por ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('albuns')
      .select(`
        *,
        obras (id, titulo, isrc)
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Álbum não encontrado' });
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Listar artistas de um álbum
router.get('/:id/artistas', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('albuns_artistas')
      .select(`
        artista_id,
        artistas (nome_completo, pseudonimo_artistico)
      `)
      .eq('album_id', req.params.id);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Criar novo álbum
router.post('/', async (req, res) => {
  try {
    const { artistas, ...albumData } = req.body;

    // Criar álbum
    const { data: album, error: albumError } = await supabase
      .from('albuns')
      .insert([albumData])
      .select()
      .single();

    if (albumError) throw albumError;

    // Associar artistas ao álbum (se fornecidos)
    if (artistas && artistas.length > 0) {
      const albunsArtistas = artistas.map(artistaId => ({
        album_id: album.id,
        artista_id: artistaId
      }));

      const { error: artistasError } = await supabase
        .from('albuns_artistas')
        .insert(albunsArtistas);

      if (artistasError) throw artistasError;
    }

    res.status(201).json(album);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Atualizar álbum
router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('albuns')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Álbum não encontrado' });
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Remover álbum
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('albuns')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
