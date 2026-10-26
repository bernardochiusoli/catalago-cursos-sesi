import { depoimentos } from '../data/conteudo'
import { Carrossel } from './Carrossel'
import { IconeEstrela } from './Icones'
import './Depoimentos.css'

/** Faixa "Quem fez recomenda". Vermelha na página inicial, bege no detalhe do curso. */
export function Depoimentos({ variante }: { variante: 'vermelho' | 'bege' }) {
  return (
    <section className={`depoimentos depoimentos--${variante} secao`} aria-labelledby={`depoimentos-${variante}`}>
      <div className="container">
        <p className="sobretitulo">Depoimentos</p>
        <h2 id={`depoimentos-${variante}`} className="titulo-secao">Quem fez recomenda</h2>
        <div className="depoimentos__lista">
          <Carrossel rotulo="Depoimentos" tema={variante === 'vermelho' ? 'escuro' : 'claro'}>
            {depoimentos.map((d) => (
              <li key={d.nome}>
                <figure className="depoimento">
                  <blockquote>“{d.texto}”</blockquote>
                  <figcaption>
                    <strong>{d.nome}</strong>
                    <span>{d.cargo}</span>
                    <span className="depoimento__estrelas" role="img" aria-label="Avaliação: 5 de 5 estrelas">
                      {Array.from({ length: 5 }, (_, i) => (
                        <IconeEstrela key={i} />
                      ))}
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </Carrossel>
        </div>
      </div>
    </section>
  )
}
