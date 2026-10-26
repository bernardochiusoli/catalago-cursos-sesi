import type { Categoria } from '../api/tipos'
import './BadgeCategoria.css'

/** Etiqueta de categoria do Figma: ícone + nome em caixa alta, cor por categoria. */
export function BadgeCategoria({ categoria }: { categoria: Categoria }) {
  return (
    <span className={`badge-categoria badge-categoria--${categoria.slug}`}>
      <img src={categoria.icone} alt="" width={14} height={14} aria-hidden="true" />
      {categoria.nome}
    </span>
  )
}

/** Situação da oferta, sempre com texto (nunca só cor). */
export function BadgeStatus({ valor, rotulo }: { valor: string; rotulo: string }) {
  return <span className={`badge-status badge-status--${valor}`}>{rotulo}</span>
}
