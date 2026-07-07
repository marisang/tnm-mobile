import { useState } from 'react'

function VitrindeShows() {
  // Sample shows data
  const [shows] = useState([
    {
      id: 1,
      title: 'TÍTULO DO SHOW',
      date: '18/06/2026',
      time: '21:00',
      location: 'LOCAL',
      banner: '📅',
    },
    {
      id: 2,
      title: 'TÍTULO DO SHOW',
      date: '18/06/2026',
      time: '21:00',
      location: 'LOCAL',
      banner: '📅',
    },
  ])

  const handleBuyTicket = (show) => {
    alert(`Redirecionando para comprar ingressos de "${show.title}"`)
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
        {shows.map((show) => (
          <div key={show.id} className="show-card">
            <div className="show-banner-large">
              <div className="banner-text-placeholder">Banner<br/>do Show</div>
            </div>
            <div className="show-title-large">{show.title}</div>
            <div className="show-info">
              <div className="show-date">📅 {show.date} às {show.time}</div>
              <div className="show-location">📍 {show.location}</div>
            </div>
            <button
              className="btn-buy-ticket"
              onClick={() => handleBuyTicket(show)}
            >
              COMPRAR INGRESSO
            </button>
          </div>
        ))}
      </div>
    </>
  )
}

export default VitrindeShows
