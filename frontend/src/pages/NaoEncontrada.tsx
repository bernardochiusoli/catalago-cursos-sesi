import { Link } from 'react-router-dom'
import { IconeBusca } from '../components/Icones'
import { useTitulo } from '../hooks/useTitulo'
import '../components/Estados.css'

type Props = { titulo?: string; texto?: string }

export function NaoEncontrada({ titulo = 'Página não encontrada', texto = 'O endereço acessado não existe.' }: Props) {
  useTitulo(titulo)
  return (
    <div className="container secao">
      <div className="estado">
        <IconeBusca className="estado__icone" />
        <h1 className="estado__titulo">{titulo}</h1>
        <p>{texto}</p>
        <Link to="/cursos" className="botao botao--escuro">
          Ver catálogo de cursos
        </Link>
      </div>
    </div>
  )
}
