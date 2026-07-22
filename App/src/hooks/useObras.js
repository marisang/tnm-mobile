import { useState, useEffect } from 'react';
import { obrasService } from '../services/api';

export function useObras(artistaId = null) {
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarObras();
  }, [artistaId]);

  const carregarObras = async () => {
    try {
      setLoading(true);
      const data = artistaId 
        ? await obrasService.buscarPorArtista(artistaId)
        : await obrasService.listar();
      setObras(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar obras:', err);
    } finally {
      setLoading(false);
    }
  };

  const criarObra = async (obraData) => {
    try {
      const novaObra = await obrasService.criar(obraData);
      setObras([...obras, novaObra]);
      return novaObra;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const atualizarObra = async (id, obraData) => {
    try {
      const obraAtualizada = await obrasService.atualizar(id, obraData);
      setObras(obras.map(o => o.id === id ? obraAtualizada : o));
      return obraAtualizada;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deletarObra = async (id) => {
    try {
      await obrasService.deletar(id);
      setObras(obras.filter(o => o.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    obras,
    loading,
    error,
    carregarObras,
    criarObra,
    atualizarObra,
    deletarObra
  };
}
