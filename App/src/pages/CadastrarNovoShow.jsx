import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useShows } from '../hooks/useShows'
import { useArtistas } from '../hooks/useArtistas'

function CadastrarNovoShow() {
  const navigate = useNavigate()
  const { criarShow } = useShows()
  const { artistas } = useArtistas()
  
  const [formData, setFormData] = useState({
    titulo_evento: '',
    data_evento: '',
    local_nome: '',
    banner_url: '',
    link_ingressos: '',
    contato_whatsapp: '',
    release_texto: '',
    status_publicacao: 'publicado',
    artista_id: '',
  })
  
  const [uploading, setUploading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // TODO: Implementar upload para Supabase Storage
      // Por enquanto, apenas mostra o nome do arquivo
      alert('Upload de imagens será implementado em breve. Por enquanto, use uma URL.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.artista_id) {
      alert('Selecione um artista!')
      return
    }

    if (!formData.titulo_evento || !formData.data_evento || !formData.local_nome) {
      alert('Preencha todos os campos obrigatórios!')
      return
    }

    setUploading(true)
    
    try {
      await criarShow(formData)
      alert('Show cadastrado com sucesso!')
      navigate('/shows')
    } catch (error) {
      console.error('Erro ao cadastrar show:', error)
      alert('Erro ao cadastrar show: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <h1 className="page-title">CADASTRAR NOVO SHOW</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="form-section-title">Cadastro do Show</div>

          {/* Título do Evento */}
          <div className="form-group">
            <input
              type="text"
              name="titulo_evento"
              className="form-input"
              placeholder="Título do Evento *"
              value={formData.titulo_evento}
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

          {/* Data do Evento */}
          <div className="form-group">
            <input
              type="date"
              name="data_evento"
              className="form-input"
              value={formData.data_evento}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Local */}
          <div className="form-group">
            <input
              type="text"
              name="local_nome"
              className="form-input"
              placeholder="Local do Evento *"
              value={formData.local_nome}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* URL do Banner */}
          <div className="form-group">
            <input
              type="url"
              name="banner_url"
              className="form-input"
              placeholder="URL do Banner (opcional)"
              value={formData.banner_url}
              onChange={handleInputChange}
            />
            <small style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '4px', display: 'block' }}>
              Exemplo: https://exemplo.com/banner.jpg
            </small>
          </div>

          {/* Link de Ingressos */}
          <div className="form-group">
            <input
              type="url"
              name="link_ingressos"
              className="form-input"
              placeholder="URL da Venda de Ingressos (opcional)"
              value={formData.link_ingressos}
              onChange={handleInputChange}
            />
          </div>

          {/* WhatsApp */}
          <div className="form-group">
            <input
              type="tel"
              name="contato_whatsapp"
              className="form-input"
              placeholder="WhatsApp de Contato (opcional)"
              value={formData.contato_whatsapp}
              onChange={handleInputChange}
            />
          </div>

          {/* Release/Descrição */}
          <div className="form-group">
            <textarea
              name="release_texto"
              className="form-textarea"
              placeholder="Descrição / Release do Evento (opcional)"
              value={formData.release_texto}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          {/* Status */}
          <div className="form-group">
            <select
              name="status_publicacao"
              className="form-input"
              value={formData.status_publicacao}
              onChange={handleInputChange}
              style={{ color: 'white' }}
            >
              <option value="rascunho">Rascunho</option>
              <option value="publicado">Publicado</option>
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

export default CadastrarNovoShow
