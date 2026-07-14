import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import ContratoDistribuicaoTemplate from '../templates/documentos/ContratoDistribuicaoTemplate'
import AutorizacaoImagemTemplate from '../templates/documentos/AutorizacaoImagemTemplate'
import { gerarPdf, gerarPdfComoBlob } from '../utils/pdfGenerator'
import { supabase } from '../lib/supabaseClient'
import { mapArtistaParaDadosDocumento } from '../utils/mapArtistaParaDadosDocumento'

// Componente de gráfico de linha simples, feito em SVG puro (sem dependências externas)
function GraficoLinha({ dados }) {
  const largura = 320
  const altura = 160
  const paddingEsquerda = 36
  const paddingBaixo = 24
  const paddingTopo = 12

  const valores = dados.map((d) => d.value)
  const valorMax = Math.max(...valores, 1)

  const areaLargura = largura - paddingEsquerda - 12
  const areaAltura = altura - paddingBaixo - paddingTopo

  const pontos = dados.map((d, i) => {
    const x = paddingEsquerda + (i / (dados.length - 1)) * areaLargura
    const y = paddingTopo + areaAltura - (d.value / valorMax) * areaAltura
    return { x, y, ...d }
  })

  const pathLinha = pontos
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  // Linhas guia horizontais (0, metade, máximo)
  const guias = [0, 0.5, 1].map((frac) => ({
    y: paddingTopo + areaAltura - frac * areaAltura,
    valor: Math.round(valorMax * frac),
  }))

  return (
    <svg viewBox={`0 0 ${largura} ${altura}`} width="100%" height="auto">
      {guias.map((g, i) => (
        <g key={i}>
          <line
            x1={paddingEsquerda}
            y1={g.y}
            x2={largura - 12}
            y2={g.y}
            stroke="#e0e0e0"
            strokeWidth="1"
          />
          <text x="0" y={g.y + 4} fontSize="9" fill="#888">
            {g.valor.toLocaleString('pt-BR')}
          </text>
        </g>
      ))}

      <path d={pathLinha} fill="none" stroke="#6A1B9A" strokeWidth="2.5" />

      {pontos.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#6A1B9A" />
      ))}

      {pontos.map((p, i) => (
        <text
          key={i}
          x={p.x}
          y={altura - 6}
          fontSize="9"
          fill="#888"
          textAnchor="middle"
        >
          {p.label}
        </text>
      ))}
    </svg>
  )
}

//  Motor de Geração de PDFs 
// Cada tipo de documento aponta pro seu componente de template e define
// quais campos o formulário precisa pedir pro usuário.
const TIPOS_DE_DOCUMENTO = [
  {
    id: 'contrato-distribuicao',
    titulo: 'Contrato de Distribuição Digital',
    descricao: 'Administração exclusiva de masters e distribuição digital.',
    Template: ContratoDistribuicaoTemplate,
  },
  {
    id: 'autorizacao-imagem',
    titulo: 'Autorização para Uso de Imagem',
    descricao: 'Termo de uso de imagem e voz (LGPD).',
    Template: AutorizacaoImagemTemplate,
  },
]

const CAMPOS_INICIAIS_DOCUMENTO = {
  nomeCompleto: '',
  pseudonimoArtistico: '',
  nacionalidade: 'Brasileira',
  estadoCivil: '',
  profissao: '',
  rg: '',
  orgaoEmissor: '',
  cpf: '',
  endereco: '',
  bairro: '',
  municipio: '',
  uf: '',
  cep: '',
  email: '',
  celular: '',
  dataNascimento: '',
  dataAssinatura: '',
}

function PainelFinanceiro() {
  // Estado do painel financeiro (saldo + gráfico) 
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [dadosFinanceiros, setDadosFinanceiros] = useState({
    saldo: 0,
    atualizadoEm: '',
    reproducoesMensais: [],
  })
  const [mostrarModalSaque, setMostrarModalSaque] = useState(false)

  // Estado do gerador de documentos 
  const [searchParams] = useSearchParams()
  const artistaId = searchParams.get('artistaId') // ex: /?artistaId=123

  const [tipoSelecionado, setTipoSelecionado] = useState(null)
  const [dadosDocumento, setDadosDocumento] = useState(CAMPOS_INICIAIS_DOCUMENTO)
  const [gerandoPdf, setGerandoPdf] = useState(false)
  const [carregandoArtista, setCarregandoArtista] = useState(false)
  const [erroArtista, setErroArtista] = useState(null)
  const areaRenderizacaoRef = useRef(null)

  useEffect(() => {
    async function carregarDadosFinanceiros() {
      try {
        setCarregando(true)

      

        // Mock temporário, apenas para desenvolvimento 
        await new Promise((resolve) => setTimeout(resolve, 400))
        const mock = {
          saldo: 10000.0,
          atualizadoEm: '17/06/2026 às 15:00',
          reproducoesMensais: [
            { label: 'Jan', value: 2050 },
            { label: 'Fev', value: 2300 },
            { label: 'Mar', value: 1200 },
            { label: 'Abr', value: 1650 },
            { label: 'Mai', value: 1500 },
            { label: 'Jun', value: 1700 },
          ],
        }
        setDadosFinanceiros(mock)
        //  fim do mock 
      } catch (e) {
        setErro('Não foi possível carregar os dados financeiros.')
      } finally {
        setCarregando(false)
      }
    }

    carregarDadosFinanceiros()
  }, [])

 
  useEffect(() => {
    if (!artistaId) return

    async function carregarArtista() {
      setCarregandoArtista(true)
      setErroArtista(null)
      try {
        const { data, error } = await supabase
          .from('artistas')
          .select('*')
          .eq('id', artistaId)
          .single()

        if (error) throw error

        setDadosDocumento((anterior) => ({
          ...anterior,
          ...mapArtistaParaDadosDocumento(data),
        }))
      } catch (e) {
        setErroArtista('Não foi possível carregar os dados deste artista.')
      } finally {
        setCarregandoArtista(false)
      }
    }

    carregarArtista()
  }, [artistaId])

  const saldoFormatado = dadosFinanceiros.saldo.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  function handleConfirmarSaque() {
  
    window.open('https://dashboard.onerpm.com/login', '_blank')
    setMostrarModalSaque(false)
  }

  function handleChangeCampoDocumento(campo, valor) {
    setDadosDocumento((anterior) => ({ ...anterior, [campo]: valor }))
  }

  async function handleGerarPdf() {
    if (!tipoSelecionado) return
    setGerandoPdf(true)
    try {
      const nomeArquivo = `${tipoSelecionado.id}-${dadosDocumento.nomeCompleto || 'documento'}.pdf`
      await gerarPdf(areaRenderizacaoRef.current, nomeArquivo)

     
      if (artistaId) {
        const pdfBlob = await gerarPdfComoBlob(areaRenderizacaoRef.current)

        const { error: erroUpload } = await supabase.storage
          .from('documentos')
          .upload(`${artistaId}/${nomeArquivo}`, pdfBlob, {
            contentType: 'application/pdf',
            upsert: true,
          })
        if (erroUpload) throw erroUpload

        const { error: erroInsert } = await supabase
          .from('documentos_gerados')
          .insert({
            artista_id: artistaId,
            tipo: tipoSelecionado.id,
            arquivo: `${artistaId}/${nomeArquivo}`,
            criado_em: new Date().toISOString(),
          })
        if (erroInsert) throw erroInsert
      }
    } finally {
      setGerandoPdf(false)
    }
  }

  const TemplateSelecionado = tipoSelecionado?.Template

  if (carregando) {
    return <p style={{ textAlign: 'center', marginTop: 40 }}>Carregando dados...</p>
  }

  if (erro) {
    return <p style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>{erro}</p>
  }

  return (
    <>
      {/* Saldo Disponível */}
      <div className="balance-card">
        <div className="balance-label">Saldo Disponível</div>
        <div className="balance-amount">{saldoFormatado}</div>
        <div className="balance-updated">
          Atualizado em: {dadosFinanceiros.atualizadoEm}
        </div>
      </div>

      {/* Reproduções Mensais */}
      <div className="chart-card">
        <div className="chart-title">Reproduções Mensais</div>
        <div className="chart-wrapper">
          <GraficoLinha dados={dadosFinanceiros.reproducoesMensais} />
        </div>
      </div>

      {/* Solicitar Saque */}
      <button className="btn btn-primary" onClick={() => setMostrarModalSaque(true)}>
        Acesso à ONErpm
      </button>

      {/* Gerar Documentos */}
      <div className="page-title" style={{ marginTop: 28 }}>
        Gerar Documentos
      </div>

      {carregandoArtista && <p>Carregando dados do artista...</p>}
      {erroArtista && <p style={{ color: 'red' }}>{erroArtista}</p>}

      {TIPOS_DE_DOCUMENTO.map((tipo) => (
        <div
          key={tipo.id}
          className={`doc-type-card ${tipoSelecionado?.id === tipo.id ? 'selected' : ''}`}
          onClick={() => setTipoSelecionado(tipo)}
        >
          <div className="doc-type-card-title">{tipo.titulo}</div>
          <div className="doc-type-card-desc">{tipo.descricao}</div>
        </div>
      ))}

      {tipoSelecionado && (
        <>
          
          <button className="btn btn-primary" onClick={handleGerarPdf} disabled={gerandoPdf}>
            {gerandoPdf ? 'Gerando PDF...' : 'Gerar PDF'}
          </button>
        </>
      )}

      {/* Área escondida onde o template do contrato é montado antes de virar PDF */}
      <div className="pdf-render-area" ref={areaRenderizacaoRef}>
        {TemplateSelecionado && <TemplateSelecionado dados={dadosDocumento} />}
      </div>

      {/* Modal de aviso de redirecionamento do saque */}
      {mostrarModalSaque && (
        <div className="modal-overlay" onClick={() => setMostrarModalSaque(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Redirecionamento</h3>
            <p>
              Você será redirecionado para o ambiente da <strong>ONErpm</strong> .
            </p>
            <div className="modal-actions">
              <button className="btn-secondary btn-small" onClick={() => setMostrarModalSaque(false)}>
                Cancelar
              </button>
              <button className="btn-primary btn-small" onClick={handleConfirmarSaque}>
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PainelFinanceiro