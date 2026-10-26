// Contrato da API (espelha os DTOs do back-end em backend/Catalogo.Api/Dtos).

export interface Categoria {
  slug: string
  nome: string
  icone: string
}

export interface Opcao {
  valor: string
  rotulo: string
}

export interface CursoResumo {
  slug: string
  nomeCompleto: string
  nomeBreve: string
  resumo: string
  categoria: Categoria
  modalidade: Opcao
  status: Opcao
  cargaHorariaHoras: number
  publicoAlvo: string
  imagemUrl: string
  imagemAlt: string
  dataDisponibilizacao: string | null
}

export interface ListaCursos {
  total: number
  itens: CursoResumo[]
}

export interface Aula {
  ordem: number
  titulo: string
  descricao: string
}

export interface Modulo {
  ordem: number
  titulo: string
  aulas: Aula[]
}

export interface CursoDetalhe extends CursoResumo {
  descricao: string
  modulos: Modulo[]
}

export interface Filtros {
  categorias: Categoria[]
  modalidades: Opcao[]
  status: Opcao[]
}

export interface ParametrosBusca {
  busca?: string
  categoria?: string
  modalidade?: string
  status?: string
}
