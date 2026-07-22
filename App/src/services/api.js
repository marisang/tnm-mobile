import supabase from '../config/supabase';

// ==================== ARTISTAS ====================

export const artistasService = {
  async listar() {
    const { data, error } = await supabase
      .from('artistas')
      .select('*')
      .order('nome_completo', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async buscarPorId(id) {
    const { data, error } = await supabase
      .from('artistas')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async criar(artistaData) {
    const { data, error } = await supabase
      .from('artistas')
      .insert([artistaData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async atualizar(id, artistaData) {
    const { data, error } = await supabase
      .from('artistas')
      .update(artistaData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deletar(id) {
    const { error } = await supabase
      .from('artistas')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};


// ==================== OBRAS ====================

export const obrasService = {
  async listar() {
    const { data, error } = await supabase
      .from('obras')
      .select(`
        *,
        artistas (nome_completo, pseudonimo_artistico),
        albuns (titulo, capa_url)
      `)
      .order('titulo', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async buscarPorId(id) {
    const { data, error } = await supabase
      .from('obras')
      .select(`
        *,
        artistas (nome_completo, pseudonimo_artistico),
        albuns (titulo, capa_url),
        compositores (nome, cpf)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async buscarPorArtista(artistaId) {
    const { data, error } = await supabase
      .from('obras')
      .select(`
        *,
        artistas (nome_completo, pseudonimo_artistico),
        albuns (titulo, capa_url)
      `)
      .eq('artista_id', artistaId)
      .order('titulo', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async criar(obraData) {
    const { data, error } = await supabase
      .from('obras')
      .insert([obraData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async atualizar(id, obraData) {
    const { data, error } = await supabase
      .from('obras')
      .update(obraData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deletar(id) {
    const { error } = await supabase
      .from('obras')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};


// ==================== SHOWS ====================

export const showsService = {
  async listar() {
    const { data, error } = await supabase
      .from('shows')
      .select(`
        *,
        artistas (nome_completo, pseudonimo_artistico)
      `)
      .order('data_evento', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async listarPublicados() {
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
    return data;
  },

  async buscarPorId(id) {
    const { data, error } = await supabase
      .from('shows')
      .select(`
        *,
        artistas (nome_completo, pseudonimo_artistico, email, celular)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async buscarPorArtista(artistaId) {
    const { data, error } = await supabase
      .from('shows')
      .select('*')
      .eq('artista_id', artistaId)
      .order('data_evento', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async criar(showData) {
    const { data, error } = await supabase
      .from('shows')
      .insert([showData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async atualizar(id, showData) {
    const { data, error } = await supabase
      .from('shows')
      .update(showData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deletar(id) {
    const { error } = await supabase
      .from('shows')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};


// ==================== CONTRATOS ====================

export const contratosService = {
  async listar() {
    const { data, error } = await supabase
      .from('contratos')
      .select(`
        *,
        artistas (nome_completo, pseudonimo_artistico, cpf)
      `)
      .order('id', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async buscarPorId(id) {
    const { data, error } = await supabase
      .from('contratos')
      .select(`
        *,
        artistas (*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async buscarPorArtista(artistaId) {
    const { data, error } = await supabase
      .from('contratos')
      .select('*')
      .eq('artista_id', artistaId)
      .order('id', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async criar(contratoData) {
    const { data, error } = await supabase
      .from('contratos')
      .insert([contratoData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async atualizar(id, contratoData) {
    const { data, error } = await supabase
      .from('contratos')
      .update(contratoData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deletar(id) {
    const { error } = await supabase
      .from('contratos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};


// ==================== TRANSAÇÕES FINANCEIRAS ====================

export const transacoesService = {
  async listar() {
    const { data, error } = await supabase
      .from('transacoes_financeiras')
      .select(`
        *,
        artistas (nome_completo, pseudonimo_artistico)
      `)
      .order('data_competencia', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async buscarPorId(id) {
    const { data, error } = await supabase
      .from('transacoes_financeiras')
      .select(`
        *,
        artistas (nome_completo, pseudonimo_artistico)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async buscarPorArtista(artistaId) {
    const { data, error } = await supabase
      .from('transacoes_financeiras')
      .select('*')
      .eq('artista_id', artistaId)
      .order('data_competencia', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async buscarObrasTransacao(transacaoId) {
    const { data, error } = await supabase
      .from('obras_transacoes')
      .select(`
        obra_id,
        obras (titulo, isrc, artistas (nome_completo))
      `)
      .eq('transacao_id', transacaoId);
    
    if (error) throw error;
    return data;
  },

  async criar(transacaoData) {
    const { obras, ...dados } = transacaoData;

    const { data, error } = await supabase
      .from('transacoes_financeiras')
      .insert([dados])
      .select()
      .single();
    
    if (error) throw error;

    // Associar obras se fornecidas
    if (obras && obras.length > 0) {
      const obrasTransacoes = obras.map(obraId => ({
        obra_id: obraId,
        transacao_id: data.id
      }));

      const { error: obrasError } = await supabase
        .from('obras_transacoes')
        .insert(obrasTransacoes);

      if (obrasError) throw obrasError;
    }

    return data;
  },

  async atualizar(id, transacaoData) {
    const { data, error } = await supabase
      .from('transacoes_financeiras')
      .update(transacaoData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deletar(id) {
    const { error } = await supabase
      .from('transacoes_financeiras')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};


// ==================== ÁLBUNS ====================

export const albunsService = {
  async listar() {
    const { data, error } = await supabase
      .from('albuns')
      .select('*')
      .order('data_lancamento', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async buscarPorId(id) {
    const { data, error } = await supabase
      .from('albuns')
      .select(`
        *,
        obras (id, titulo, isrc)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async buscarArtistasAlbum(albumId) {
    const { data, error } = await supabase
      .from('albuns_artistas')
      .select(`
        artista_id,
        artistas (nome_completo, pseudonimo_artistico)
      `)
      .eq('album_id', albumId);
    
    if (error) throw error;
    return data;
  },

  async criar(albumData) {
    const { artistas, ...dados } = albumData;

    const { data, error } = await supabase
      .from('albuns')
      .insert([dados])
      .select()
      .single();
    
    if (error) throw error;

    // Associar artistas se fornecidos
    if (artistas && artistas.length > 0) {
      const albunsArtistas = artistas.map(artistaId => ({
        album_id: data.id,
        artista_id: artistaId
      }));

      const { error: artistasError } = await supabase
        .from('albuns_artistas')
        .insert(albunsArtistas);

      if (artistasError) throw artistasError;
    }

    return data;
  },

  async atualizar(id, albumData) {
    const { data, error } = await supabase
      .from('albuns')
      .update(albumData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deletar(id) {
    const { error } = await supabase
      .from('albuns')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
