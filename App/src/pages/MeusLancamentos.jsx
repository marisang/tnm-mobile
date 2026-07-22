import { useObras } from '../hooks/useObras'

function MeusLancamentos() {
  // TODO: Substituir pelo ID do artista logado
  const artistaId = null // Se null, busca todas as obras
  const { obras, loading, error, deletarObra } = useObras(artistaId)

  const handleDelete = async (id, titulo) => {
    if (window.confirm(`Deseja realmente excluir "${titulo}"?`)) {
      try {
        await deletarObra(id)
        alert('Obra excluída com sucesso!')
      } catch (err) {
        alert('Erro ao excluir obra: ' + err.message)
      }
    }
  }

  if (loading) {
    return (
      <>
        <h1 className="page-title">MEUS LANÇAMENTOS</h1>
        <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.7)' }}>
          Carregando obras...
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <h1 className="page-title">MEUS LANÇAMENTOS</h1>
        <div style={{ textAlign: 'center', padding: '40px', color: '#ff6b6b' }}>
          Erro ao carregar obras: {error}
        </div>
      </>
    )
  }

  return (
    <>
      <h1 className="page-title">MEUS LANÇAMENTOS</h1>

      {/* Releases List */}
      <div>
        {obras.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.7)' }}>
            Nenhuma obra cadastrada ainda. <br/>
            <a href="/cadastrar-obra" style={{ color: '#4CAF50', textDecoration: 'underline', marginTop: '12px', display: 'inline-block' }}>
              Cadastrar primeira obra
            </a>
          </div>
        ) : (
          obras.map((obra) => (
            <div key={obra.id} className="album-card">
              <div className="album-cover-small">
                {obra.albuns?.capa_url ? (
                  <img src={obra.albuns.capa_url} alt={obra.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className="cover-text">Capa do<br/>Álbum</div>
                )}
              </div>
              <div className="album-info" style={{ flex: 1 }}>
                <div className="album-title">{obra.titulo}</div>
                <div className="album-code">{obra.isrc || 'Sem ISRC'}</div>
                {obra.artistas && (
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                    {obra.artistas.pseudonimo_artistico || obra.artistas.nome_completo}
                  </div>
                )}
                {obra.status && (
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                    Status: {obra.status}
                  </div>
                )}
              </div>
              <button
                onClick={() => handleDelete(obra.id, obra.titulo)}
                style={{
                  background: '#ff4444',
                  border: 'none',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  marginLeft: '12px'
                }}
              >
                Excluir
              </button>
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default MeusLancamentos
