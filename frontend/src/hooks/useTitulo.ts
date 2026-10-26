import { useEffect } from 'react'

/** Título da aba muda a cada página: é o primeiro texto que o leitor de tela anuncia. */
export function useTitulo(titulo: string) {
  useEffect(() => {
    document.title = titulo ? `${titulo} | SESI Indústria` : 'SESI Indústria'
  }, [titulo])
}
