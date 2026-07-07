import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CadastrarNovoShow() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    banner: null,
    date: '',
    time: '',
    address: '',
    ticketUrl: '',
    whatsapp: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData((prev) => ({ ...prev, banner: file }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Show form submitted:', formData)
    alert('Show cadastrado com sucesso!')
    navigate('/shows')
  }

  return (
    <>
      <h1 className="page-title">CADASTRAR NOVO SHOW</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="form-section-title">Cadastro do Álbum</div>

          {/* Banner Upload */}
          <div className="form-group">
            <label className="file-upload">
              <div className="file-upload-icon">📁</div>
              <div className="file-upload-text">Escolha o arquivo e arraste-o aqui</div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
            {formData.banner && (
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginTop: '8px' }}>
                ✓ {formData.banner.name}
              </div>
            )}
          </div>

          {/* Date and Time */}
          <div className="form-group">
            <input
              type="datetime-local"
              name="datetime"
              className="form-input"
              placeholder="18/06/2026 às 21:00"
              value={formData.datetime}
              onChange={handleInputChange}
            />
          </div>

          {/* Address */}
          <div className="form-group">
            <input
              type="text"
              name="address"
              className="form-input"
              placeholder="Endereço"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>

          {/* Ticket URL */}
          <div className="form-group">
            <input
              type="url"
              name="ticketUrl"
              className="form-input"
              placeholder="URL da Venda de Ingressos"
              value={formData.ticketUrl}
              onChange={handleInputChange}
            />
          </div>

          {/* WhatsApp Contact */}
          <div className="form-group">
            <input
              type="tel"
              name="whatsapp"
              className="form-input"
              placeholder="Whatsapp de Contato"
              value={formData.whatsapp}
              onChange={handleInputChange}
            />
          </div>

          <button type="submit" className="btn-primary">
            CADASTRAR
          </button>
        </div>
      </form>
    </>
  )
}

export default CadastrarNovoShow
