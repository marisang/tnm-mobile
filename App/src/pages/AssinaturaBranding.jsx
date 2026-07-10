import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AssinaturaBranding() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    contractFile: null,
    agreePrivacy: false,
    agreeUnpublished: false,
    signature: '',
  })

  const [currentStep, setCurrentStep] = useState('upload') // upload, review, sign

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData((prev) => ({ ...prev, contractFile: file }))
  }

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSignatureChange = (e) => {
    const { value } = e.target
    setFormData((prev) => ({ ...prev, signature: value }))
  }

  const isReviewDisabled = !formData.contractFile

  const isSignDisabled = !formData.agreePrivacy || !formData.agreeUnpublished || !formData.signature

  const handleProceed = () => {
    if (currentStep === 'upload' && formData.contractFile) {
      setCurrentStep('review')
    } else if (currentStep === 'review' && formData.agreePrivacy && formData.agreeUnpublished) {
      setCurrentStep('sign')
    }
  }

  const handleSubmit = () => {
    if (isSignDisabled) return

    console.log('Contrato assinado:', formData)
    alert('✅ Contrato assinado com sucesso!')
    navigate('/meus-lancamentos')
  }

  return (
    <>
      <h1 className="page-title">ASSINATURA DE CONTRATOS</h1>

      <div className="form-section">
        {/* Step 1: Upload */}
        {currentStep === 'upload' && (
          <>
            <div className="form-section-title">Etapa 1: Upload do Contrato</div>

            <div className="form-group">
              <label className="file-upload-large">
                <div className="file-upload-icon-large">📄</div>
                <div className="file-upload-text-large">Escolha o arquivo e arraste-o aqui</div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </label>
              {formData.contractFile && (
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginTop: '8px', textAlign: 'center' }}>
                  ✓ {formData.contractFile.name}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleProceed}
              disabled={isReviewDisabled}
              className="btn-primary"
              style={{
                opacity: isReviewDisabled ? 0.5 : 1,
                cursor: isReviewDisabled ? 'not-allowed' : 'pointer',
              }}
            >
              PRÓXIMA ETAPA
            </button>
          </>
        )}

        {/* Step 2: Review */}
        {currentStep === 'review' && (
          <>
            <div className="form-section-title">Etapa 2: Aceitar Termos</div>

            <div className="contract-preview">
              <div className="preview-header">📄 Contrato em Revisão</div>
              <div className="preview-content">
                {formData.contractFile?.name}
              </div>
            </div>

            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="agreePrivacy"
                  checked={formData.agreePrivacy}
                  onChange={handleCheckboxChange}
                  className="checkbox-input"
                />
                <span className="checkbox-text">Li e concordo com a Política de Privacidade</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="agreeUnpublished"
                  checked={formData.agreeUnpublished}
                  onChange={handleCheckboxChange}
                  className="checkbox-input"
                />
                <span className="checkbox-text">Declaro que a obra é inédita</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setCurrentStep('upload')}
                className="btn-primary"
                style={{ background: 'rgba(255,255,255,0.3)' }}
              >
                VOLTAR
              </button>
              <button
                type="button"
                onClick={handleProceed}
                disabled={!formData.agreePrivacy || !formData.agreeUnpublished}
                className="btn-primary"
                style={{
                  opacity: !formData.agreePrivacy || !formData.agreeUnpublished ? 0.5 : 1,
                  cursor: !formData.agreePrivacy || !formData.agreeUnpublished ? 'not-allowed' : 'pointer',
                }}
              >
                PRÓXIMA ETAPA
              </button>
            </div>
          </>
        )}

        {/* Step 3: Sign */}
        {currentStep === 'sign' && (
          <>
            <div className="form-section-title">Etapa 3: Assinar Digitalmente</div>

            <div className="contract-preview">
              <div className="preview-header">✅ Pronto para Assinar</div>
              <div className="preview-content">
                <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>
                  Resumo do Contrato:
                </div>
                <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
                  • Arquivo: {formData.contractFile?.name}
                  <br/>
                  • Privacidade: ✓ Aceito
                  <br/>
                  • Obra Inédita: ✓ Declaro
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Assinatura Digital</label>
              <input
                type="text"
                name="signature"
                className="form-input"
                placeholder="Digite seu nome completo"
                value={formData.signature}
                onChange={handleSignatureChange}
                style={{ textTransform: 'uppercase' }}
              />
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '6px' }}>
                Sua assinatura será registrada como: {formData.signature || 'Seu Nome'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
              <button
                type="button"
                onClick={() => setCurrentStep('review')}
                className="btn-primary"
                style={{ background: 'rgba(255,255,255,0.3)' }}
              >
                VOLTAR
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSignDisabled}
                className="btn-primary"
                style={{
                  opacity: isSignDisabled ? 0.5 : 1,
                  cursor: isSignDisabled ? 'not-allowed' : 'pointer',
                  backgroundColor: isSignDisabled ? '#999' : '#FFEB3B',
                }}
              >
                ASSINAR DIGITALMENTE
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default AssinaturaBranding
