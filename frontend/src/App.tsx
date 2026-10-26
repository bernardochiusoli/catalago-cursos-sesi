import { useEffect } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { Cabecalho } from './components/Cabecalho'
import { Rodape } from './components/Rodape'
import { Ava } from './pages/Ava'
import { Catalogo } from './pages/Catalogo'
import { DetalheCurso } from './pages/DetalheCurso'
import { Inicio } from './pages/Inicio'
import { NaoEncontrada } from './pages/NaoEncontrada'

/** Ao trocar de página, volta ao topo; se o endereço tem âncora (#sobre), rola até ela. */
function GerenciarRolagem() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function Layout() {
  const { pathname } = useLocation()
  return (
    <>
      <a href="#conteudo" className="pular-conteudo">
        Pular para o conteúdo
      </a>
      <Cabecalho sobreposto={pathname === '/'} />
      <main id="conteudo" tabIndex={-1}>
        <Outlet />
      </main>
      <Rodape />
    </>
  )
}

export default function App() {
  return (
    <>
      <GerenciarRolagem />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="cursos" element={<Catalogo />} />
          <Route path="cursos/:slug" element={<DetalheCurso />} />
          <Route path="*" element={<NaoEncontrada />} />
        </Route>
        {/* O AVA ocupa a tela inteira, como no Figma (sem cabeçalho e rodapé) */}
        <Route path="cursos/:slug/aulas" element={<Ava />} />
        <Route path="area-do-aluno" element={<Navigate to="/cursos/matematica-para-a-precisao/aulas" replace />} />
      </Routes>
    </>
  )
}
