import { useId, useState, type ReactNode } from 'react'
import { IconeMais, IconeMenos } from './Icones'
import './Acordeao.css'

type Item = { titulo: string; conteudo: ReactNode }

/**
 * Acordeão acessível (padrão "disclosure" da WAI-ARIA): cada título é um botão
 * com aria-expanded, ligado ao painel por aria-controls.
 */
export function Acordeao({ itens, abertoInicial }: { itens: Item[]; abertoInicial?: number }) {
  const id = useId()
  const [abertos, setAbertos] = useState<Set<number>>(() => new Set(abertoInicial === undefined ? [] : [abertoInicial]))

  const alternar = (i: number) =>
    setAbertos((atual) => {
      const novo = new Set(atual)
      if (novo.has(i)) novo.delete(i)
      else novo.add(i)
      return novo
    })

  return (
    <div className="acordeao">
      {itens.map((item, i) => {
        const aberto = abertos.has(i)
        const painel = `${id}-painel-${i}`
        return (
          <section key={item.titulo} className="acordeao__item">
            <h3 className="acordeao__cabecalho">
              <button type="button" aria-expanded={aberto} aria-controls={painel} onClick={() => alternar(i)}>
                <span>{item.titulo}</span>
                {aberto ? <IconeMenos /> : <IconeMais />}
              </button>
            </h3>
            <div id={painel} className="acordeao__painel" hidden={!aberto}>
              {item.conteudo}
            </div>
          </section>
        )
      })}
    </div>
  )
}
