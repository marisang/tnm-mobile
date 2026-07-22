import { useState, useEffect } from 'react';
import { showsService } from '../services/api';

export function useShows(apenasPublicados = false) {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarShows();
  }, [apenasPublicados]);

  const carregarShows = async () => {
    try {
      setLoading(true);
      const data = apenasPublicados 
        ? await showsService.listarPublicados()
        : await showsService.listar();
      setShows(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar shows:', err);
    } finally {
      setLoading(false);
    }
  };

  const criarShow = async (showData) => {
    try {
      const novoShow = await showsService.criar(showData);
      setShows([...shows, novoShow]);
      return novoShow;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const atualizarShow = async (id, showData) => {
    try {
      const showAtualizado = await showsService.atualizar(id, showData);
      setShows(shows.map(s => s.id === id ? showAtualizado : s));
      return showAtualizado;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deletarShow = async (id) => {
    try {
      await showsService.deletar(id);
      setShows(shows.filter(s => s.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    shows,
    loading,
    error,
    carregarShows,
    criarShow,
    atualizarShow,
    deletarShow
  };
}
