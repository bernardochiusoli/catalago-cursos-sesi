import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// O CSS global vem antes dos componentes: assim os estilos específicos
// (ex.: .cabecalho__aluno) vencem os genéricos (ex.: .botao) de mesma especificidade.
import './styles/global.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
