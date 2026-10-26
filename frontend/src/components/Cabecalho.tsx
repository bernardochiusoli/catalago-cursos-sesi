import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { IconeFechar, IconeMenu } from './Icones'
import './Cabecalho.css'

type Props = { sobreposto?: boolean }

const links = [
  { para: '/', rotulo: 'Início', fim: true },
  { para: '/cursos', rotulo: 'Cursos', fim: false },
  { para: '/#sobre', rotulo: 'Sobre', fim: true },
]

/** Cabeçalho do Figma. Na página inicial fica sobre o banner vermelho (variante "sobreposto"). */
export function Cabecalho({ sobreposto = false }: Props) {
  const [aberto, setAberto] = useState(false)
  const [rolou, setRolou] = useState(false)
  const local = useLocation()

  useEffect(() => setAberto(false), [local.pathname, local.hash])

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 24)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  const transparente = sobreposto && !rolou && !aberto
  const logo = transparente ? '/assets/icons/logo-sesi-industria-white.svg' : '/assets/icons/logo-sesi-industria-primary.svg'

  return (
    <header className={`cabecalho ${transparente ? 'cabecalho--transparente' : ''}`}>
      <div className="container cabecalho__barra">
        <Link to="/" className="cabecalho__logo">
          <img src={logo} alt="SESI Indústria, página inicial" width={188} height={19} />
        </Link>

        <button
          type="button"
          className="cabecalho__alternar"
          aria-expanded={aberto}
          aria-controls="menu-principal"
          onClick={() => setAberto((a) => !a)}
        >
          {aberto ? <IconeFechar /> : <IconeMenu />}
          <span className="visualmente-oculto">{aberto ? 'Fechar menu' : 'Abrir menu'}</span>
        </button>

        <nav id="menu-principal" aria-label="Principal" className={`cabecalho__nav ${aberto ? 'cabecalho__nav--aberto' : ''}`}>
          <ul>
            {links.map((l) => (
              <li key={l.rotulo}>
                {l.para.includes('#') ? (
                  <Link to={l.para} className="cabecalho__link">
                    {l.rotulo}
                  </Link>
                ) : (
                  <NavLink to={l.para} end={l.fim} className="cabecalho__link">
                    {l.rotulo}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
          <Link to="/area-do-aluno" className="botao cabecalho__aluno">
            Área do aluno
          </Link>
        </nav>
      </div>
    </header>
  )
}
