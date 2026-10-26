import { useCallback, useEffect, useState } from 'react'

export type EstadoRequisicao<T> =
  | { tipo: 'carregando' }
  | { tipo: 'sucesso'; dados: T }
  | { tipo: 'erro'; mensagem: string; status: number }

/**
 * Executa uma chamada à API e expõe os três estados que a tela precisa mostrar:
 * carregando, sucesso ou erro. Cancela a chamada anterior quando os parâmetros mudam,
 * para uma resposta antiga nunca sobrescrever uma nova.
 */
export function useApi<T>(buscar: (sinal: AbortSignal) => Promise<T>, dependencias: unknown[]) {
  const [estado, setEstado] = useState<EstadoRequisicao<T>>({ tipo: 'carregando' })
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    const controle = new AbortController()
    setEstado({ tipo: 'carregando' })
    buscar(controle.signal)
      .then((dados) => setEstado({ tipo: 'sucesso', dados }))
      .catch((erro: unknown) => {
        if (controle.signal.aborted) return
        const status = typeof erro === 'object' && erro !== null && 'status' in erro ? Number(erro.status) : 0
        const mensagem = erro instanceof Error ? erro.message : 'Ocorreu um erro inesperado.'
        setEstado({ tipo: 'erro', mensagem, status })
      })
    return () => controle.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencias, tentativa])

  const tentarNovamente = useCallback(() => setTentativa((t) => t + 1), [])

  return { estado, tentarNovamente }
}
