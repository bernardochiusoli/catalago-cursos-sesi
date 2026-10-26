import { Link, useParams } from 'react-router-dom'
import { obterCurso } from '../api/cliente'
import type { CursoDetalhe } from '../api/tipos'
import { Acordeao } from '../components/Acordeao'
import { BadgeCategoria, BadgeStatus } from '../components/BadgeCategoria'
import { Beneficios } from '../components/Beneficios'
import { Depoimentos } from '../components/Depoimentos'
import { EstadoErro } from '../components/Estados'
import { IconeCalendario, IconeCertificado, IconeLocal, IconePessoas, IconeRelogio, IconeSeta } from '../components/Icones'
import { aulasOnline, duvidasFrequentes } from '../data/conteudo'
import { useApi } from '../hooks/useApi'
import { useTitulo } from '../hooks/useTitulo'
import { formatarCarga, formatarData } from '../utils/formatar'
import { NaoEncontrada } from './NaoEncontrada'
import './DetalheCurso.css'

export function DetalheCurso() {
  const { slug = '' } = useParams()
  const { estado, tentarNovamente } = useApi((sinal) => obterCurso(slug, sinal), [slug])

  useTitulo(estado.tipo === 'sucesso' ? estado.dados.nomeCompleto : 'Curso')

  if (estado.tipo === 'carregando') {
    return (
      <div className="container detalhe-carregando" role="status" aria-live="polite">
        <span className="visualmente-oculto">Carregando curso…</span>
        <div className="esqueleto esqueleto--titulo" aria-hidden="true" />
        <div className="esqueleto esqueleto--midia" aria-hidden="true" />
      </div>
    )
  }

  if (estado.tipo === 'erro') {
    if (estado.status === 404) return <NaoEncontrada titulo="Curso não encontrado" texto="O curso que você procura não existe ou foi removido do catálogo." />
    return (
      <div className="container secao">
        <EstadoErro mensagem={estado.mensagem} aoTentarNovamente={tentarNovamente} />
      </div>
    )
  }

  return <Conteudo curso={estado.dados} />
}

function Conteudo({ curso }: { curso: CursoDetalhe }) {
  const data = formatarData(curso.dataDisponibilizacao)

  return (
    <>
      <nav aria-label="Trilha de navegação" className="container trilha">
        <ol>
          <li>
            <Link to="/">Início</Link>
          </li>
          <li>
            <Link to="/cursos">Cursos</Link>
          </li>
          <li aria-current="page">{curso.nomeBreve}</li>
        </ol>
      </nav>

      <section className="container detalhe-topo">
        <div className="detalhe-topo__texto">
          <BadgeCategoria categoria={curso.categoria} />
          <h1>{curso.nomeCompleto}</h1>
          <ul className="detalhe-info">
            <li>
              <IconeCalendario />
              {data ? (
                <span>
                  {curso.status.valor === 'EmBreve' ? 'Disponível a partir de' : 'Início do curso'}: <strong>{data}</strong>
                </span>
              ) : (
                <span>
                  Início: <strong>acesso imediato</strong>
                </span>
              )}
            </li>
            <li>
              <IconeCertificado />
              <span>
                Certificação: <strong>SESI</strong>
              </span>
            </li>
            <li>
              <IconeLocal />
              <span>
                Modalidade: <strong>{curso.modalidade.rotulo}</strong>
              </span>
            </li>
            <li>
              <IconeRelogio />
              <span>
                Carga horária: <strong>{formatarCarga(curso.cargaHorariaHoras)}</strong>
              </span>
            </li>
          </ul>
          <div className="detalhe-topo__acoes">
            <BotaoMatricula curso={curso} />
            <BadgeStatus valor={curso.status.valor} rotulo={curso.status.rotulo} />
          </div>
        </div>
        <img className="detalhe-topo__imagem" src={curso.imagemUrl} alt={curso.imagemAlt} width={600} height={800} />
      </section>

      <section className="container secao detalhe-beneficios" aria-labelledby="por-que-sesi">
        <h2 id="por-que-sesi" className="visualmente-oculto">
          Por que estudar no SESI
        </h2>
        <Beneficios variante="bege" />
      </section>

      <section className="container detalhe-sobre" aria-labelledby="sobre-curso">
        <div>
          <h2 id="sobre-curso" className="titulo-secao">
            Sobre o curso
          </h2>
          <p className="detalhe-sobre__descricao">{curso.descricao}</p>
          <dl className="detalhe-sobre__ficha">
            <div>
              <dt>
                <IconePessoas /> Público-alvo
              </dt>
              <dd>{curso.publicoAlvo}</dd>
            </div>
            <div>
              <dt>Código do curso</dt>
              <dd>{curso.nomeBreve}</dd>
            </div>
          </dl>
        </div>
        <Acordeao
          abertoInicial={0}
          itens={[
            {
              titulo: `Módulos (${curso.modulos.length})`,
              conteudo: (
                <ol className="modulos">
                  {curso.modulos.map((m) => (
                    <li key={m.ordem}>
                      <h4>
                        {m.ordem}. {m.titulo}
                      </h4>
                      <ul>
                        {m.aulas.map((a) => (
                          <li key={a.ordem}>
                            <strong>{a.titulo}:</strong> {a.descricao}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              ),
            },
            { titulo: 'Aulas online e avaliações', conteudo: <p>{aulasOnline}</p> },
            {
              titulo: 'Dúvidas frequentes',
              conteudo: (
                <dl className="duvidas">
                  {duvidasFrequentes.map((d) => (
                    <div key={d.pergunta}>
                      <dt>{d.pergunta}</dt>
                      <dd>{d.resposta}</dd>
                    </div>
                  ))}
                </dl>
              ),
            },
          ]}
        />
      </section>

      <Depoimentos variante="bege" />

      <section className="fale-conosco" aria-labelledby="fale-titulo">
        <div className="container">
          <p className="sobretitulo">Precisa de ajuda para decidir?</p>
          <h2 id="fale-titulo" className="titulo-secao">
            Fale com a gente
          </h2>
          <a className="botao botao--claro" href="mailto:contato@sesindustria.com.br">
            Mandar uma mensagem <IconeSeta />
          </a>
        </div>
      </section>

      {/* Barra fixa do Figma com o nome do curso e a matrícula sempre à mão */}
      <aside className="barra-matricula" aria-label="Matrícula">
        <div className="barra-matricula__conteudo">
          <p>{curso.nomeCompleto}</p>
          <BotaoMatricula curso={curso} claro />
        </div>
      </aside>
    </>
  )
}

function BotaoMatricula({ curso, claro = false }: { curso: CursoDetalhe; claro?: boolean }) {
  if (curso.status.valor === 'InscricoesAbertas') {
    return (
      <Link to={`/cursos/${curso.slug}/aulas`} className={`botao ${claro ? 'botao--claro' : 'botao--escuro'}`}>
        Matricule-se <IconeSeta />
      </Link>
    )
  }
  const aviso = curso.status.valor === 'EmBreve' ? 'Matrículas em breve' : 'Matrículas encerradas'
  return <span className={`aviso-matricula ${claro ? 'aviso-matricula--claro' : ''}`}>{aviso}</span>
}
