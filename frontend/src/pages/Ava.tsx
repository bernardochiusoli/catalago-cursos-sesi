import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { obterCurso } from '../api/cliente'
import type { CursoDetalhe } from '../api/tipos'
import { EstadoErro } from '../components/Estados'
import { IconeBusca, IconeCheck, IconeSetaEsquerda } from '../components/Icones'
import { useApi } from '../hooks/useApi'
import { useTitulo } from '../hooks/useTitulo'
import { Texto } from '../utils/texto'
import { NaoEncontrada } from './NaoEncontrada'
import './Ava.css'

/**
 * Demonstração da tela "AVA" do Figma (Ambiente Virtual de Aprendizagem).
 * Não faz parte dos requisitos obrigatórios: navega pelos módulos e aulas do curso,
 * sem login nem progresso salvo. Em produção, este papel seria do Moodle.
 */
export function Ava() {
  const { slug = '' } = useParams()
  const { estado, tentarNovamente } = useApi((sinal) => obterCurso(slug, sinal), [slug])
  useTitulo(estado.tipo === 'sucesso' ? `AVA: ${estado.dados.nomeBreve}` : 'Ambiente de aprendizagem')

  if (estado.tipo === 'carregando')
    return (
      <p className="ava-carregando" role="status">
        Carregando ambiente de aprendizagem…
      </p>
    )
  if (estado.tipo === 'erro') {
    if (estado.status === 404) return <NaoEncontrada titulo="Curso não encontrado" texto="Não há ambiente de aprendizagem para este curso." />
    return (
      <div className="container secao">
        <EstadoErro mensagem={estado.mensagem} aoTentarNovamente={tentarNovamente} />
      </div>
    )
  }
  return <Ambiente curso={estado.dados} />
}

function Ambiente({ curso }: { curso: CursoDetalhe }) {
  const aulas = useMemo(
    () => curso.modulos.flatMap((m) => m.aulas.map((a) => ({ ...a, modulo: m.ordem, moduloTitulo: m.titulo, chave: `${m.ordem}.${a.ordem}` }))),
    [curso],
  )
  const [atual, setAtual] = useState(aulas[0]?.chave ?? '')
  const [filtro, setFiltro] = useState('')
  const indice = Math.max(0, aulas.findIndex((a) => a.chave === atual))
  const aula = aulas[indice]
  const progresso = aulas.length ? Math.round(((indice + 1) / aulas.length) * 100) : 0
  const termo = Texto.normalizar(filtro)

  return (
    <div className="ava">
      <aside className="ava__lateral" aria-label="Conteúdo do curso">
        <div className="ava__cabecalho">
          <Link to={`/cursos/${curso.slug}`} className="ava__voltar">
            <IconeSetaEsquerda />
            <span className="visualmente-oculto">Voltar para a página do curso</span>
          </Link>
          <p className="ava__rotulo">Certificação</p>
          <p className="ava__curso">{curso.nomeCompleto}</p>
        </div>
        <div className="ava__progresso">
          <div role="progressbar" aria-label="Progresso no curso" aria-valuenow={progresso} aria-valuemin={0} aria-valuemax={100}>
            <span style={{ width: `${progresso}%` }} />
          </div>
          <span aria-hidden="true">{progresso}%</span>
        </div>
        <div className="ava__busca">
          <label htmlFor="busca-aula" className="visualmente-oculto">
            Buscar aula
          </label>
          <input id="busca-aula" type="search" value={filtro} onChange={(e) => setFiltro(e.target.value)} placeholder="Buscar aula" />
          <IconeBusca />
        </div>
        <nav aria-label="Módulos e aulas">
          <ol className="ava__modulos">
            {curso.modulos.map((m) => {
              const visiveis = m.aulas.filter((a) => !termo || Texto.normalizar(`${a.titulo} ${m.titulo}`).includes(termo))
              if (!visiveis.length) return null
              return (
                <li key={m.ordem}>
                  <p className="ava__modulo">
                    {m.ordem}. {m.titulo}
                  </p>
                  <ol>
                    {visiveis.map((a) => {
                      const chave = `${m.ordem}.${a.ordem}`
                      const concluida = aulas.findIndex((x) => x.chave === chave) < indice
                      return (
                        <li key={chave}>
                          <button
                            type="button"
                            className="ava__aula"
                            aria-current={chave === atual ? 'step' : undefined}
                            onClick={() => setAtual(chave)}
                          >
                            <span className={`ava__marcador ${concluida ? 'ava__marcador--ok' : ''}`} aria-hidden="true">
                              {concluida && <IconeCheck />}
                            </span>
                            {chave} {a.titulo}
                            {concluida && <span className="visualmente-oculto"> (concluída)</span>}
                          </button>
                        </li>
                      )
                    })}
                  </ol>
                </li>
              )
            })}
          </ol>
        </nav>
      </aside>

      <main id="conteudo" className="ava__principal" tabIndex={-1}>
        <img className="ava__banner" src="/assets/img/banner-ava.webp" alt="" width={1600} height={891} />
        {aula && (
          <article>
            <p className="ava__modulo-atual">
              Módulo {aula.modulo}: {aula.moduloTitulo}
            </p>
            <h1>{aula.titulo}</h1>
            <p>{aula.descricao}</p>
            <p>
              Neste ambiente de demonstração, o conteúdo completo da aula (vídeos, textos e atividades) viria do Moodle. Use a
              navegação ao lado para percorrer os {aulas.length} conteúdos deste curso.
            </p>
            <div className="ava__navegacao">
              <button type="button" className="botao botao--contorno" disabled={indice === 0} onClick={() => setAtual(aulas[indice - 1].chave)}>
                Aula anterior
              </button>
              <button
                type="button"
                className="botao botao--escuro"
                disabled={indice === aulas.length - 1}
                onClick={() => setAtual(aulas[indice + 1].chave)}
              >
                Próxima aula
              </button>
            </div>
          </article>
        )}
      </main>
    </div>
  )
}
