// Ícones de interface desenhados em SVG inline. Todos decorativos (aria-hidden):
// o significado sempre vem do texto ao lado ou do aria-label do botão.
type Props = { className?: string }

const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
}

export const IconeSeta = ({ className }: Props) => (
  <svg {...base} className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)
export const IconeSetaEsquerda = ({ className }: Props) => (
  <svg {...base} className={className}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
)
export const IconeBusca = ({ className }: Props) => (
  <svg {...base} className={className}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
)
export const IconeFechar = ({ className }: Props) => (
  <svg {...base} className={className}><path d="M6 6l12 12M18 6 6 18" /></svg>
)
export const IconeMenu = ({ className }: Props) => (
  <svg {...base} className={className}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
)
export const IconeMais = ({ className }: Props) => (
  <svg {...base} className={className}><path d="M12 5v14M5 12h14" /></svg>
)
export const IconeMenos = ({ className }: Props) => (
  <svg {...base} className={className}><path d="M5 12h14" /></svg>
)
export const IconeCalendario = ({ className }: Props) => (
  <svg {...base} className={className}><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16" /></svg>
)
export const IconeCertificado = ({ className }: Props) => (
  <svg {...base} className={className}><circle cx="12" cy="9" r="5" /><path d="m9 13-1.5 8L12 19l4.5 2L15 13" /></svg>
)
export const IconeRelogio = ({ className }: Props) => (
  <svg {...base} className={className}><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></svg>
)
export const IconeLocal = ({ className }: Props) => (
  <svg {...base} className={className}><path d="M12 21s-6-5.5-6-11a6 6 0 1 1 12 0c0 5.5-6 11-6 11Z" /><circle cx="12" cy="10" r="2" /></svg>
)
export const IconePessoas = ({ className }: Props) => (
  <svg {...base} className={className}><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><path d="M16 5.2a3 3 0 0 1 0 5.6M21 20c0-2.8-1.6-5-4-5.8" /></svg>
)
export const IconeCheck = ({ className }: Props) => (
  <svg {...base} className={className}><path d="m5 12 4 4 10-10" /></svg>
)
export const IconeAlerta = ({ className }: Props) => (
  <svg {...base} className={className}><circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 17h.01" /></svg>
)
export const IconePlay = ({ className }: Props) => (
  <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden focusable={false} className={className}><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
)
export const IconeEstrela = ({ className }: Props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden focusable={false} className={className}>
    <path fill="currentColor" d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
  </svg>
)
