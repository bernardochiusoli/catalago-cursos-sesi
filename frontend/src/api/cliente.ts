import type { CursoDetalhe, Filtros, ListaCursos, ParametrosBusca } from './tipos'

// Em produção o front é servido pela própria API (mesma origem), então a URL é relativa.
// Em desenvolvimento, o Vite redireciona /api para a API local (veja vite.config.ts).
const BASE = import.meta.env.VITE_API_URL ?? ''

export class ErroApi extends Error {
  readonly status: number

  constructor(mensagem: string, status: number) {
    super(mensagem)
    this.name = 'ErroApi'
    this.status = status
  }
}

async function obter<T>(caminho: string, sinal?: AbortSignal): Promise<T> {
  let resposta: Response
  try {
    resposta = await fetch(`${BASE}${caminho}`, { signal: sinal, headers: { Accept: 'application/json' } })
  } catch (erro) {
    if (erro instanceof DOMException && erro.name === 'AbortError') throw erro
    throw new ErroApi('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.', 0)
  }

  if (!resposta.ok) {
    // A API responde erros no formato ProblemDetails: { title, detail, status }
    let mensagem = 'Ocorreu um erro ao carregar os dados.'
    try {
      const problema = (await resposta.json()) as { title?: string; detail?: string }
      mensagem = problema.detail ?? problema.title ?? mensagem
    } catch {
      /* resposta sem corpo JSON: mantém a mensagem padrão */
    }
    throw new ErroApi(mensagem, resposta.status)
  }

  return (await resposta.json()) as T
}

export function listarCursos(parametros: ParametrosBusca, sinal?: AbortSignal) {
  const query = new URLSearchParams()
  for (const [chave, valor] of Object.entries(parametros)) {
    if (valor) query.set(chave, valor)
  }
  const sufixo = query.toString() ? `?${query}` : ''
  return obter<ListaCursos>(`/api/cursos${sufixo}`, sinal)
}

export function obterCurso(slug: string, sinal?: AbortSignal) {
  return obter<CursoDetalhe>(`/api/cursos/${encodeURIComponent(slug)}`, sinal)
}

export function obterFiltros(sinal?: AbortSignal) {
  return obter<Filtros>('/api/filtros', sinal)
}
