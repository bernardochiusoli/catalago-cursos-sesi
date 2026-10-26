import { useRef, type ReactNode } from 'react'
import { IconeSeta, IconeSetaEsquerda } from './Icones'
import './Carrossel.css'

type Props = {
  rotulo: string
  children: ReactNode
  rodapeEsquerda?: ReactNode
  tema?: 'claro' | 'escuro'
}

/**
 * Lista com rolagem horizontal e setas, como no Figma. Sem biblioteca:
 * a rolagem é nativa (funciona com toque, trackpad e teclado) e as setas
 * só rolam o contêiner. Cada item continua sendo um elemento da lista.
 */
export function Carrossel({ rotulo, children, rodapeEsquerda, tema = 'claro' }: Props) {
  const trilho = useRef<HTMLUListElement>(null)

  const rolar = (direcao: 1 | -1) => {
    const el = trilho.current
    if (!el) return
    el.scrollBy({ left: direcao * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <div className={`carrossel carrossel--${tema}`}>
      {/* tabIndex=0: quem usa teclado consegue focar a faixa e rolar com as setas,
          mesmo quando os itens não têm links (ex.: depoimentos). */}
      <ul ref={trilho} className="carrossel__trilho" aria-label={rotulo} tabIndex={0}>
        {children}
      </ul>
      <div className="carrossel__rodape">
        <div>{rodapeEsquerda}</div>
        <div className="carrossel__setas">
          <button type="button" className="carrossel__seta" onClick={() => rolar(-1)}>
            <IconeSetaEsquerda />
            <span className="visualmente-oculto">Ver itens anteriores de {rotulo}</span>
          </button>
          <button type="button" className="carrossel__seta" onClick={() => rolar(1)}>
            <IconeSeta />
            <span className="visualmente-oculto">Ver próximos itens de {rotulo}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
