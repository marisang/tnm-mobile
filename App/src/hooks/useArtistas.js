import { useState, useEffect } from 'react';
import { artistasService } from '../services/api';

export function useArtistas() {
  const [artistas, setArtistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarArtistas();
  }, []);

  const carregarArtistas = async () => {
    try {
      setLoading(true);
      const data = await artistasService.listar();
      setArtistas(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar artistas:', err);
    } finally {
      setLoading(false);
    }
  };

  const criarArtista = async (artistaData) => {
    try {
      const novoArtista = await artistasService.criar(artistaData);
      setArtistas([...artistas, novoArtista]);
      return novoArtista;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const atualizarArtista = async (id, artistaData) => {
    try {
      const artistaAtualizado = await artistasService.atualizar(id, artistaData);
      setArtistas(artistas.map(a => a.id === id ? artistaAtualizado : a));
      return artistaAtualizado;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deletarArtista = async (id) => {
    try {
      await artistasService.deletar(id);
      setArtistas(artistas.filter(a => a.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    artistas,
    loading,
    error,
    carregarArtistas,
    criarArtista,
    atualizarArtista,
    deletarArtista
  };
}
