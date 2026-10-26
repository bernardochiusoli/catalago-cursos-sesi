import { Link } from 'react-router-dom'
import { listarCursos } from '../api/cliente'
import { Beneficios } from '../components/Beneficios'
import { CardCurso } from '../components/CardCurso'
import { Carrossel } from '../components/Carrossel'
import { Depoimentos } from '../components/Depoimentos'
import { EstadoCarregando, EstadoErro } from '../components/Estados'
import { IconeSeta } from '../components/Icones'
import { impacto } from '../data/conteudo'
import { useApi } from '../hooks/useApi'
import { useTitulo } from '../hooks/useTitulo'
import './Inicio.css'

export function Inicio() {
  useTitulo('Cursos para a indústria')
  const { estado, tentarNovamente } = useApi((sinal) => listarCursos({}, sinal), [])

  return (
    <>
      <section className="hero" aria-labelledby="hero-titulo">
        <img className="hero__imagem" src="/assets/img/hero.webp" alt="" width={1920} height={1080} fetchPriority="high" />
        <div className="container hero__conteudo">
          <h1 id="hero-titulo">Impulsione sua carreira na indústria</h1>
          <p>Amplie seus conhecimentos com excelência na melhor plataforma de estudos da indústria brasileira</p>
          <Link to="/cursos" className="botao botao--claro">
            Conhecer cursos <IconeSeta />
          </Link>
        </div>
      </section>

      <section className="secao" aria-labelledby="principais-titulo">
        <div className="container">
          <h2 id="principais-titulo" className="titulo-secao inicio__titulo">Principais cursos</h2>
          {estado.tipo === 'carregando' && <EstadoCarregando quantidade={4} />}
          {estado.tipo === 'erro' && <EstadoErro mensagem={estado.mensagem} aoTentarNovamente={tentarNovamente} />}
          {estado.tipo === 'sucesso' && (
            <Carrossel
              rotulo="Principais cursos"
              rodapeEsquerda={
                <Link to="/cursos" className="botao botao--contorno">
                  Ver todos os cursos
                </Link>
              }
            >
              {estado.dados.itens.map((curso) => (
                <li key={curso.slug}>
                  <CardCurso curso={curso} />
                </li>
              ))}
              <li>
                <Link to="/cursos" className="card-todos">
                  Todos os cursos <IconeSeta />
                </Link>
              </li>
            </Carrossel>
          )}
        </div>
      </section>

      <section id="sobre" className="secao impacto" aria-labelledby="impacto-titulo">
        <div className="container impacto__grade">
          <div>
            <h2 id="impacto-titulo" className="titulo-secao">Impacto transformador</h2>
            <p className="impacto__texto">Resultados que demonstram o sucesso da nossa metodologia de capacitação contínua para a indústria</p>
          </div>
          <div>
            <dl className="impacto__numeros">
              {impacto.map((n) => (
                <div key={n.rotulo}>
                  <dt>{n.rotulo}</dt>
                  <dd>{n.numero}</dd>
                </div>
              ))}
            </dl>
            <div className="impacto__beneficios">
              <Beneficios variante="vermelho" quantidade={3} />
            </div>
          </div>
        </div>
      </section>

      <Depoimentos variante="vermelho" />

      <section className="secao chamada" aria-labelledby="chamada-titulo">
        <div className="container chamada__grade">
          <div className="chamada__texto">
            <h2 id="chamada-titulo" className="titulo-secao">Pronto para transformar sua carreira?</h2>
            <p>Junte-se a milhares de profissionais que já estão transformando a indústria através dos nossos cursos. Invista no seu futuro hoje mesmo!</p>
            <Link to="/cursos" className="botao botao--claro">
              Matricule-se <IconeSeta />
            </Link>
          </div>
          <img
            className="chamada__imagem"
            src="/assets/img/video-thumb.webp"
            alt="Dois técnicos de capacete e uniforme azul conversando diante de uma máquina"
            width={1280}
            height={720}
            loading="lazy"
          />
        </div>
      </section>
    </>
  )
}
