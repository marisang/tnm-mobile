import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CadastrarNovaObra() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    audioFile: null,
    albumCover: null,
    title: '',
    lyrics: '',
    composers: [],
    composerName: '',
    isrc: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0]
    setFormData((prev) => ({ ...prev, [fileType]: file }))
  }

  const addComposer = () => {
    if (formData.composerName.trim()) {
      setFormData((prev) => ({
        ...prev,
        composers: [...prev.composers, prev.composerName],
        composerName: '',
      }))
    }
  }

  const removeComposer = (index) => {
    setFormData((prev) => ({
      ...prev,
      composers: prev.composers.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('Obra cadastrada com sucesso!')
    navigate('/meus-lancamentos')
  }

  return (
    <>
      <h1 className="page-title">CADASTRAR NOVA OBRA</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="form-section-title">Cadastro do Álbum</div>

          {/* Audio File Upload */}
          <div className="form-group">
            <label className="file-upload">
              <div className="file-upload-icon">🎵</div>
              <div className="file-upload-text">Escolha o arquivo e arraste-o aqui</div>
              <input
                type="file"
                accept=".wav,.mp3"
                onChange={(e) => handleFileChange(e, 'audioFile')}
              />
            </label>
            {formData.audioFile && (
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginTop: '8px' }}>
                ✓ {formData.audioFile.name}
              </div>
            )}
          </div>

          {/* Title */}
          <div className="form-group">
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="Título da Obra"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>

          {/* Lyrics */}
          <div className="form-group">
            <textarea
              name="lyrics"
              className="form-textarea"
              placeholder="Letra da Música"
              value={formData.lyrics}
              onChange={handleInputChange}
            />
          </div>

          {/* Composers */}
          <div className="form-group">
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                name="composerName"
                className="form-input"
                placeholder="Compositores"
                value={formData.composerName}
                onChange={handleInputChange}
                style={{ flex: 1, marginTop: 0 }}
              />
              <button
                type="button"
                className="btn-icon"
                onClick={addComposer}
                style={{ marginTop: 0 }}
              >
                +
              </button>
            </div>
            {formData.composers.length > 0 && (
              <div className="composers-list">
                {formData.composers.map((composer, index) => (
                  <div key={index} className="composer-item">
                    <span>{composer}</span>
                    <button
                      type="button"
                      className="composer-remove-btn"
                      onClick={() => removeComposer(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ISRC Code */}
          <div className="form-group">
            <input
              type="text"
              name="isrc"
              className="form-input"
              placeholder="Código ISRC"
              value={formData.isrc}
              onChange={handleInputChange}
            />
          </div>

          {/* Archive Upload */}
          <div className="form-group">
            <label className="file-upload">
              <div className="file-upload-icon">📁</div>
              <div className="file-upload-text">Escolha o arquivo e arraste-o aqui</div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'albumCover')}
              />
            </label>
            {formData.albumCover && (
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginTop: '8px' }}>
                ✓ {formData.albumCover.name}
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary">
            CADASTRAR
          </button>
        </div>
      </form>
    </>
  )
}

export default CadastrarNovaObra
