import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useObras } from '../hooks/useObras'
import { useArtistas } from '../hooks/useArtistas'

function CadastrarNovaObra() {
  const navigate = useNavigate()
  const { criarObra } = useObras()
  const { artistas } = useArtistas()
  
  const [formData, setFormData] = useState({
    titulo: '',
    letra: '',
    isrc: '',
    status: 'cadastrada',
    artista_id: '',
    composers: [],
    composerName: '',
  })
  
  const [uploading, setUploading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0]
    if (file) {
      // TODO: Implementar upload para Supabase Storage
      alert('Upload de arquivos será implementado em breve.')
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.artista_id) {
      alert('Selecione um artista!')
      return
    }

    if (!formData.titulo) {
      alert('Digite o título da obra!')
      return
    }

    setUploading(true)
    
    try {
      const obraData = {
        titulo: formData.titulo,
        letra: formData.letra,
        isrc: formData.isrc,
        status: formData.status,
        artista_id: formData.artista_id,
      }
      
      await criarObra(obraData)
      
      // TODO: Cadastrar compositores após criar a obra
      
      alert('Obra cadastrada com sucesso!')
      navigate('/meus-lancamentos')
    } catch (error) {
      console.error('Erro ao cadastrar obra:', error)
      alert('Erro ao cadastrar obra: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <h1 className="page-title">CADASTRAR NOVA OBRA</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="form-section-title">Cadastro da Obra</div>

          {/* Título */}
          <div className="form-group">
            <input
              type="text"
              name="titulo"
              className="form-input"
              placeholder="Título da Obra *"
              value={formData.titulo}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Selecionar Artista */}
          <div className="form-group">
            <select
              name="artista_id"
              className="form-input"
              value={formData.artista_id}
              onChange={handleInputChange}
              required
              style={{ color: formData.artista_id ? 'white' : 'rgba(255,255,255,0.5)' }}
            >
              <option value="">Selecione o Artista *</option>
              {artistas.map((artista) => (
                <option key={artista.id} value={artista.id}>
                  {artista.pseudonimo_artistico || artista.nome_completo}
                </option>
              ))}
            </select>
          </div>

          {/* Letra */}
          <div className="form-group">
            <textarea
              name="letra"
              className="form-textarea"
              placeholder="Letra da Música (opcional)"
              value={formData.letra}
              onChange={handleInputChange}
              rows={6}
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
              placeholder="Código ISRC (opcional)"
              value={formData.isrc}
              onChange={handleInputChange}
            />
          </div>

          {/* Status */}
          <div className="form-group">
            <select
              name="status"
              className="form-input"
              value={formData.status}
              onChange={handleInputChange}
              style={{ color: 'white' }}
            >
              <option value="cadastrada">Cadastrada</option>
              <option value="em_analise">Em Análise</option>
              <option value="aprovada">Aprovada</option>
              <option value="rejeitada">Rejeitada</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" disabled={uploading}>
            {uploading ? 'CADASTRANDO...' : 'CADASTRAR'}
          </button>
        </div>
      </form>
    </>
  )
}

export default CadastrarNovaObra
