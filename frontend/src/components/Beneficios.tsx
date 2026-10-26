import { beneficios } from '../data/conteudo'
import './Beneficios.css'

type Props = { variante: 'vermelho' | 'bege'; quantidade?: number }

/** Lista de benefícios do Figma. Na página inicial são 3 ícones vermelhos; no detalhe, 4 ícones bege. */
export function Beneficios({ variante, quantidade = beneficios.length }: Props) {
  return (
    <ul className={`beneficios beneficios--${variante}`}>
      {beneficios.slice(0, quantidade).map((b) => (
        <li key={b.titulo}>
          <span className="beneficios__icone">
            <img src={`/assets/icons/${b.icone}-${variante === 'vermelho' ? 'red' : 'bege'}.svg`} alt="" width={24} height={24} />
          </span>
          <h3>{b.titulo}</h3>
          <p>{b.texto}</p>
        </li>
      ))}
    </ul>
  )
}
