import { useState } from 'react'

function MeusLancamentos() {
  // Sample data - in a real app, this would come from an API or state management
  const [releases] = useState([
    {
      id: 1,
      title: 'TÍTULO DA OBRA',
      isrc: 'CÓDIGO ISRC',
      cover: '🎵',
    },
    {
      id: 2,
      title: 'TÍTULO DA OBRA',
      isrc: 'CÓDIGO ISRC',
      cover: '🎵',
    },
    {
      id: 3,
      title: 'TÍTULO DA OBRA',
      isrc: 'CÓDIGO ISRC',
      cover: '🎵',
    },
    {
      id: 4,
      title: 'TÍTULO DA OBRA',
      isrc: 'CÓDIGO ISRC',
      cover: '🎵',
    },
  ])

  return (
    <>
      <h1 className="page-title">MEUS LANÇAMENTOS</h1>

      {/* Releases List */}
      <div>
        {releases.map((release) => (
          <div key={release.id} className="album-card">
            <div className="album-cover-small">
              <div className="cover-text">Capa do<br/>Álbum</div>
            </div>
            <div className="album-info">
              <div className="album-title">{release.title}</div>
              <div className="album-code">{release.isrc}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default MeusLancamentos
