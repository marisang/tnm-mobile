import { useShows } from '../hooks/useShows'

function VitrindeShows() {
  const { shows, loading, error } = useShows(true) // true = apenas shows publicados

  const handleBuyTicket = (show) => {
    if (show.link_ingressos) {
      window.open(show.link_ingressos, '_blank')
    } else {
      alert(`Comprar ingressos para "${show.titulo_evento}"`)
    }
  }

  if (loading) {
    return (
      <>
        <h1 className="page-title">VITRINE DE SHOWS</h1>
        <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.7)' }}>
          Carregando shows...
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <h1 className="page-title">VITRINE DE SHOWS</h1>
        <div style={{ textAlign: 'center', padding: '40px', color: '#ff6b6b' }}>
          Erro ao carregar shows: {error}
        </div>
      </>
    )
  }

  return (
    <>
      {/* TNM Banner Section */}
      <div
        className="banner-section"
        onClick={() => window.open('https://tonamidia.com.br', '_blank')}
      >
        <button className="banner-button">COMPRE NOSSOS PRODUTOS</button>
        <div className="product-placeholder">IMAGEM DO PRODUTO</div>
      </div>

      <h1 className="page-title">VITRINE DE SHOWS</h1>

      {/* Shows List - Timeline Style */}
      <div>
        {shows.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.7)' }}>
            Nenhum show publicado no momento.
          </div>
        ) : (
          shows.map((show) => (
            <div key={show.id} className="show-card">
              <div className="show-banner-large">
                {show.banner_url ? (
                  <img src={show.banner_url} alt={show.titulo_evento} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className="banner-text-placeholder">Banner<br/>do Show</div>
                )}
              </div>
              <div className="show-title-large">{show.titulo_evento}</div>
              {show.artistas && (
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginTop: '8px' }}>
                  {show.artistas.pseudonimo_artistico || show.artistas.nome_completo}
                </div>
              )}
              <div className="show-info">
                <div className="show-date">
                  📅 {new Date(show.data_evento).toLocaleDateString('pt-BR')}
                </div>
                <div className="show-location">📍 {show.local_nome}</div>
              </div>
              {show.release_texto && (
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '12px', marginBottom: '12px' }}>
                  {show.release_texto}
                </div>
              )}
              {show.contato_whatsapp && (
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>
                  📱 {show.contato_whatsapp}
                </div>
              )}
              <button
                className="btn-buy-ticket"
                onClick={() => handleBuyTicket(show)}
              >
                COMPRAR INGRESSO
              </button>
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default VitrindeShows
