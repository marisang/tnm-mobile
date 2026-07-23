import { useState, useEffect } from 'react'
import { calcularSplitFinanceiro } from '../utils/calcularSplitFinanceiro'

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

function PainelFinanceiro() {
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [dadosFinanceiros, setDadosFinanceiros] = useState({
    valorBrutoTotal: 0,
    temVinculoEditorial: false,
    atualizadoEm: '',
    reproducoesMensais: [],
  })
  const [mostrarModalSaque, setMostrarModalSaque] = useState(false)

  useEffect(() => {
    async function carregarDadosFinanceiros() {
      try {
        setCarregando(true)


        // --- Mock temporário, apenas para desenvolvimento ---
        await new Promise((resolve) => setTimeout(resolve, 400))
        const mock = {
          valorBrutoTotal: 20000.0,
          temVinculoEditorial: false, // troque para true para testar o cenário com editora
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
        // --- fim do mock ---
      } catch (e) {
        setErro('Não foi possível carregar os dados financeiros.')
      } finally {
        setCarregando(false)
      }
    }

    carregarDadosFinanceiros()
  }, [])

 
  const split = calcularSplitFinanceiro(
    dadosFinanceiros.valorBrutoTotal,
    dadosFinanceiros.temVinculoEditorial
  )

  const saldoFormatado = split.artista.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  const percentualArtistaFormatado = split.percentualArtista.toLocaleString('pt-BR', {
    maximumFractionDigits: 1,
  })

  function handleConfirmarSaque() {
    window.open('https://dashboard.onerpm.com/login', '_blank')
    setMostrarModalSaque(false)
  }

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
        <div className="balance-percentual">
          {percentualArtistaFormatado}% do faturamento bruto
          {dadosFinanceiros.temVinculoEditorial && ' (após repasse à editora)'}
        </div>
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

      {/* Modal de aviso de redirecionamento do saque */}
      {mostrarModalSaque && (
        <div className="modal-overlay" onClick={() => setMostrarModalSaque(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Redirecionamento</h3>
            <p>
              Você será redirecionado(a) para a plataforma da <strong>ONErpm</strong>, onde o saque deverá ser realizado. O aplicativo da Tô na Mídia não processa solicitações de saque.
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