import { Link } from 'react-router-dom'
import type { CursoResumo } from '../api/tipos'
import { formatarCarga } from '../utils/formatar'
import { BadgeCategoria } from './BadgeCategoria'
import './CardCurso.css'

type Props = {
  curso: CursoResumo
  /** No catálogo o card mostra também modalidade, carga horária e status. */
  detalhado?: boolean
  nivelTitulo?: 'h2' | 'h3'
}

/**
 * Card do Figma: foto de fundo com degradê vermelho, etiqueta da categoria,
 * título e resumo. O card inteiro é clicável, mas só o título é o link
 * (o leitor de tela anuncia um link por card, com o nome do curso).
 */
export function CardCurso({ curso, detalhado = false, nivelTitulo: Titulo = 'h3' }: Props) {
  return (
    <article className={`card-curso ${detalhado ? 'card-curso--detalhado' : ''}`}>
      {/* No card a foto é fundo decorativo (alt vazio) para o leitor de tela não repetir
          informação; a descrição da imagem aparece na página de detalhe. */}
      <img className="card-curso__imagem" src={curso.imagemUrl} alt="" loading="lazy" width={600} height={800} />
      <div className="card-curso__topo">
        <BadgeCategoria categoria={curso.categoria} />
      </div>
      <div className="card-curso__conteudo">
        <Titulo className="card-curso__titulo">
          <Link to={`/cursos/${curso.slug}`} className="card-curso__link">
            {curso.nomeCompleto}
          </Link>
        </Titulo>
        <p className="card-curso__resumo">{curso.resumo}</p>
        {detalhado && (
          <dl className="card-curso__meta">
            <div>
              <dt className="visualmente-oculto">Situação</dt>
              <dd className="card-curso__status">{curso.status.rotulo}</dd>
            </div>
            <div>
              <dt className="visualmente-oculto">Modalidade</dt>
              <dd>{curso.modalidade.rotulo}</dd>
            </div>
            <div>
              <dt className="visualmente-oculto">Carga horária</dt>
              <dd>{formatarCarga(curso.cargaHorariaHoras)}</dd>
            </div>
          </dl>
        )}
      </div>
    </article>
  )
}
