import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import PainelFinanceiro from './pages/PainelFinanceiro'
import CadastrarNovaObra from './pages/CadastrarNovaObra'
import MeusLancamentos from './pages/MeusLancamentos'
import CadastrarNovoShow from './pages/CadastrarNovoShow'
import VitrindeShows from './pages/VitrindeShows'
import AssinaturaBranding from './pages/AssinaturaBranding'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/cadastrar-obra" element={<CadastrarNovaObra />} />
          <Route path="/meus-lancamentos" element={<MeusLancamentos />} />
          <Route path="/cadastrar-show" element={<CadastrarNovoShow />} />
          <Route path="/shows" element={<VitrindeShows />} />
          <Route path="/assinatura" element={<AssinaturaBranding />} />
          <Route path="/" element={<CadastrarNovaObra />} />
          <Route path="/PainelFinanceiro" element={<PainelFinanceiro />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
