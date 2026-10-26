import type { ReactNode } from 'react'
import { IconeAlerta, IconeBusca } from './Icones'
import './Estados.css'

/** Esqueleto dos cards enquanto a API responde. */
export function EstadoCarregando({ quantidade = 6, rotulo = 'Carregando cursos' }: { quantidade?: number; rotulo?: string }) {
  return (
    <div className="estado-carregando" role="status" aria-live="polite">
      <span className="visualmente-oculto">{rotulo}…</span>
      <div className="estado-carregando__grade" aria-hidden="true">
        {Array.from({ length: quantidade }, (_, i) => (
          <div key={i} className="esqueleto" />
        ))}
      </div>
    </div>
  )
}

export function EstadoErro({ mensagem, aoTentarNovamente }: { mensagem: string; aoTentarNovamente: () => void }) {
  return (
    <div className="estado estado--erro" role="alert">
      <IconeAlerta className="estado__icone" />
      <h2 className="estado__titulo">Não foi possível carregar os cursos</h2>
      <p>{mensagem}</p>
      <button type="button" className="botao botao--escuro" onClick={aoTentarNovamente}>
        Tentar novamente
      </button>
    </div>
  )
}

export function EstadoVazio({ titulo, children }: { titulo: string; children?: ReactNode }) {
  return (
    <div className="estado">
      <IconeBusca className="estado__icone" />
      <h2 className="estado__titulo">{titulo}</h2>
      {children}
    </div>
  )
}
