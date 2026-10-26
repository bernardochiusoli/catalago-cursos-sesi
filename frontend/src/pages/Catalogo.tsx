import { useEffect, useId, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { listarCursos, obterFiltros } from '../api/cliente'
import type { Opcao } from '../api/tipos'
import { CardCurso } from '../components/CardCurso'
import { EstadoCarregando, EstadoErro, EstadoVazio } from '../components/Estados'
import { IconeBusca, IconeFechar } from '../components/Icones'
import { useApi } from '../hooks/useApi'
import { useTitulo } from '../hooks/useTitulo'
import { pluralizarCursos } from '../utils/formatar'
import './Catalogo.css'

const CAMPOS = ['busca', 'categoria', 'modalidade', 'status'] as const
const ATRASO_BUSCA_MS = 300

/**
 * Catálogo com busca e filtros. Não existe no Figma: foi criado com os mesmos
 * componentes e cores do protótipo (diferença registrada em LIMITACOES.md).
 * Busca e filtros ficam na URL (?busca=...&status=...), então dá para compartilhar
 * o link e recarregar a página sem perder a pesquisa.
 */
export function Catalogo() {
  useTitulo('Catálogo de cursos')
  const [params, setParams] = useSearchParams()
  const busca = params.get('busca') ?? ''
  const categoria = params.get('categoria') ?? ''
  const modalidade = params.get('modalidade') ?? ''
  const status = params.get('status') ?? ''

  // O campo de texto tem estado próprio e só atualiza a URL 300 ms depois que a pessoa
  // para de digitar (debounce), para não chamar a API a cada letra.
  const [texto, setTexto] = useState(busca)
  useEffect(() => setTexto(busca), [busca])
  useEffect(() => {
    if (texto.trim() === busca) return
    const espera = setTimeout(() => atualizar('busca', texto.trim()), ATRASO_BUSCA_MS)
    return () => clearTimeout(espera)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texto])

  function atualizar(campo: (typeof CAMPOS)[number], valor: string) {
    setParams(
      (atual) => {
        const novo = new URLSearchParams(atual)
        if (valor) novo.set(campo, valor)
        else novo.delete(campo)
        return novo
      },
      { replace: true },
    )
  }

  const temFiltro = CAMPOS.some((c) => params.get(c))
  const limpar = () => {
    setTexto('')
    setParams(new URLSearchParams(), { replace: true })
  }

  const filtros = useApi((sinal) => obterFiltros(sinal), [])
  const cursos = useApi((sinal) => listarCursos({ busca, categoria, modalidade, status }, sinal), [busca, categoria, modalidade, status])

  const opcoes = filtros.estado.tipo === 'sucesso' ? filtros.estado.dados : null
  const carregandoFiltros = filtros.estado.tipo === 'carregando'

  // "Tentar novamente" refaz tudo o que falhou: a lista e, se for o caso, as opções dos filtros.
  // (Sem isso, uma falha na primeira carga deixava os filtros vazios até recarregar a página.)
  const tentarNovamente = () => {
    cursos.tentarNovamente()
    if (filtros.estado.tipo === 'erro') filtros.tentarNovamente()
  }

  return (
    <>
      <section className="catalogo-topo">
        <div className="container">
          <p className="sobretitulo">Cursos</p>
          <h1 className="catalogo-topo__titulo">Catálogo de cursos</h1>
          <p className="catalogo-topo__texto">
            Pesquise pelo nome e combine os filtros para encontrar a formação certa para a sua carreira na indústria.
          </p>
        </div>
      </section>

      <div className="container catalogo">
        <form className="filtros" role="search" aria-label="Pesquisar cursos" onSubmit={(e) => e.preventDefault()}>
          <div className="filtros__campo filtros__campo--busca">
            <label htmlFor="busca">Buscar pelo nome</label>
            <div className="filtros__busca">
              <IconeBusca />
              <input
                id="busca"
                type="search"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Ex.: matemática, física, inglês"
                maxLength={100}
                autoComplete="off"
              />
            </div>
          </div>

          <Seletor
            rotulo="Categoria"
            valor={categoria}
            aoMudar={(v) => atualizar('categoria', v)}
            opcoes={opcoes?.categorias.map((c) => ({ valor: c.slug, rotulo: c.nome }))}
            carregando={carregandoFiltros}
            todas="Todas as categorias"
          />
          <Seletor
            rotulo="Modalidade"
            valor={modalidade}
            aoMudar={(v) => atualizar('modalidade', v)}
            opcoes={opcoes?.modalidades}
            carregando={carregandoFiltros}
            todas="Todas as modalidades"
          />
          <Seletor
            rotulo="Status"
            valor={status}
            aoMudar={(v) => atualizar('status', v)}
            opcoes={opcoes?.status}
            carregando={carregandoFiltros}
            todas="Todos os status"
          />
        </form>
        {filtros.estado.tipo === 'erro' && cursos.estado.tipo !== 'erro' && (
          <p className="filtros__aviso" role="alert">
            Não foi possível carregar as opções dos filtros.{' '}
            <button type="button" className="botao-link" onClick={filtros.tentarNovamente}>
              Tentar novamente
            </button>
          </p>
        )}

        <div className="catalogo__barra">
          {/* Região viva: o leitor de tela anuncia a nova quantidade a cada mudança */}
          <p className="catalogo__contagem" aria-live="polite" aria-atomic="true">
            {cursos.estado.tipo === 'sucesso' ? pluralizarCursos(cursos.estado.dados.total) : ''}
          </p>
          {temFiltro && (
            <button type="button" className="botao botao--contorno" onClick={limpar}>
              <IconeFechar /> Limpar filtros
            </button>
          )}
        </div>

        <section aria-labelledby="resultados-titulo" className="catalogo__resultados">
          <h2 id="resultados-titulo" className="visualmente-oculto">
            Resultados
          </h2>
          {cursos.estado.tipo === 'carregando' && <EstadoCarregando />}
          {cursos.estado.tipo === 'erro' && <EstadoErro mensagem={cursos.estado.mensagem} aoTentarNovamente={tentarNovamente} />}
          {cursos.estado.tipo === 'sucesso' && cursos.estado.dados.total === 0 && (
            <EstadoVazio titulo="Nenhum curso encontrado">
              <p>
                {busca ? <>Não encontramos cursos para “{busca}” com os filtros escolhidos.</> : 'Nenhum curso corresponde aos filtros escolhidos.'}{' '}
                Tente outros termos ou limpe os filtros.
              </p>
              <button type="button" className="botao botao--escuro" onClick={limpar}>
                Limpar filtros
              </button>
            </EstadoVazio>
          )}
          {cursos.estado.tipo === 'sucesso' && cursos.estado.dados.total > 0 && (
            <ul className="catalogo__grade">
              {cursos.estado.dados.itens.map((curso) => (
                <li key={curso.slug}>
                  <CardCurso curso={curso} detalhado />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}

type SeletorProps = {
  rotulo: string
  valor: string
  aoMudar: (valor: string) => void
  opcoes?: Opcao[]
  carregando: boolean
  todas: string
}

function Seletor({ rotulo, valor, aoMudar, opcoes, carregando, todas }: SeletorProps) {
  const id = useId()
  return (
    <div className="filtros__campo">
      <label htmlFor={id}>{rotulo}</label>
      <select id={id} value={valor} onChange={(e) => aoMudar(e.target.value)} disabled={carregando}>
        <option value="">{carregando ? 'Carregando…' : todas}</option>
        {opcoes?.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.rotulo}
          </option>
        ))}
      </select>
    </div>
  )
}
