import { Link } from 'react-router-dom'
import { rodape } from '../data/conteudo'
import './Rodape.css'

const redes = [
  { nome: 'LinkedIn', icone: 'icon-linkedIn-24px.svg', href: 'https://www.linkedin.com' },
  { nome: 'Instagram', icone: 'icon-instagram-24px.svg', href: 'https://www.instagram.com' },
  { nome: 'Facebook', icone: 'icon-facebook-24px.svg', href: 'https://www.facebook.com' },
]

export function Rodape() {
  return (
    <footer className="rodape">
      <div className="container rodape__grade">
        <div className="rodape__marca">
          <img src="/assets/icons/logo-sesi-industria-white.svg" alt="SESI Indústria" width={160} height={16} />
          <address>
            <a href={`mailto:${rodape.email}`}>{rodape.email}</a>
            <span>{rodape.endereco}</span>
          </address>
        </div>

        <nav aria-labelledby="rodape-navegacao">
          <h2 id="rodape-navegacao" className="rodape__titulo">Navegação</h2>
          <ul>
            {rodape.navegacao.map((l) => (
              <li key={l.rotulo}>
                <Link to={l.href}>{l.rotulo}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="rodape__titulo">Cursos populares</h2>
          <ul>
            {rodape.cursosPopulares.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="rodape__titulo">Suporte</h2>
          <ul>
            {rodape.suporte.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container rodape__base">
        <p>
          <img src="/assets/icons/logo-sesi.svg" alt="" width={42} height={14} aria-hidden="true" />
          <span>SESI. Todos os direitos reservados.</span>
        </p>
        <ul className="rodape__redes">
          {redes.map((r) => (
            <li key={r.nome}>
              <a href={r.href} target="_blank" rel="noreferrer">
                <img src={`/assets/icons/${r.icone}`} alt="" width={20} height={20} />
                <span className="visualmente-oculto">{r.nome} (abre em nova aba)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
