# Uso de Inteligência Artificial

## Ferramenta utilizada

| Ferramenta | Uso |
| --- | --- |
| Claude (Anthropic), em conversa com acesso a terminal e navegador | Leitura do enunciado e do Figma, geração da base de código (API, front, scripts SQL), dados fictícios, testes e documentação |
| Claude (Anthropic), segunda sessão, com terminal | Revisão do código e da documentação, compilação parcial da API com o SDK .NET 10, teste dos scripts SQL em PostgreSQL 16, ajustes de configuração e do pipeline, roteiro de entrega |

## Objetivo do uso

1. **Acelerar a estrutura inicial:** organização do repositório, configuração do Vite, do projeto .NET, do Docker e do CI.
2. **Gerar dados fictícios coerentes:** 9 cursos com módulos e aulas, seguindo os nomes e textos que aparecem no Figma e completando as categorias sugeridas pelos ícones do pacote.
3. **Reproduzir o Figma:** extrair cores, textos e componentes do protótipo e transformá-los em componentes React.
4. **Revisar acessibilidade e qualidade:** rodar testes automatizados (Playwright, axe-core, Lighthouse) e corrigir o que foi apontado.
5. **Redigir a documentação:** README, este arquivo e LIMITACOES.md.

## Prompts relevantes

A base foi gerada a partir de um pedido único e amplo: construir uma solução de referência completa para este enunciado (instruções em PDF, pacote de imagens e protótipo no Figma), seguindo um roteiro de estudo já combinado. A tabela abaixo registra, por etapa, o que a IA propôs, o que ficou e o que foi descartado.

| Etapa | O que a IA propôs | Aproveitado | Descartado e por quê |
| --- | --- | --- | --- |
| Arquitetura | Stack gratuita para C#/.NET + banco open source | Imagem Docker única (a API serve o front), PostgreSQL no Neon, Render | SQLite como banco principal: menos representativo do mercado; ficou como plano B |
| Banco | Esquema e seed idempotentes, com regra para curso "Em breve" | Scripts com `IF NOT EXISTS`, `ON CONFLICT`, `CHECK`s e coluna de busca sem acento | Migrations do EF Core: o ambiente da IA não tinha o SDK do .NET; os scripts SQL foram testados num PostgreSQL real |
| API | Busca e filtros combináveis, detalhe, opções de filtro, erros em ProblemDetails | Regra de busca isolada em `ConsultaCursos` (testável sem banco); validação de enum que rejeita números | Filtrar no front: o enunciado pede listar pela API, e não escala |
| Front | Reproduzir as telas do Figma e criar o catálogo no mesmo estilo | Componentes de card, carrossel, acordeão e estados | Biblioteca de carrossel: rolagem nativa é mais leve e mais acessível |
| Testes | Verificar cada requisito obrigatório e rodar axe em cada estado | 56 verificações ponta a ponta | |

Na segunda sessão, o pedido foi estruturar as entregas e revisar o projeto, já que não havia computador disponível para compilar e testar localmente.

| Pedido (resumido) | O que a IA propôs | Aproveitado | Descartado e por quê |
| --- | --- | --- | --- |
| "Estruture as entregas: o que subir no GitHub, como publicar e os demais passos" | Roteiro em 7 passos (validar, completar a documentação, repositório, Neon + Render, ZIP, montagem da entrega) e checklist | O roteiro e o checklist, na ordem proposta | Nada |
| "Rode o build do front e revise o back-end, detalhando o que foi revisado e o que mudar" | Lint, testes e build do front; compilação da lógica da API; execução dos scripts SQL; revisão do restante do back-end por leitura | Todos os resultados e as três alterações abaixo | Restore completo da API: o NuGet não era acessível no ambiente da IA (NU1301) |
| Alterações propostas na revisão | `PORT=8080` no `render.yaml`; job do CI que gera o ZIP de publicação; ajuste de frases do README sobre testes não versionados | As três | Redirecionamento explícito de `/docs` para `/docs/` no `Program.cs`: a rota `/docs/` já é servida pelos arquivos estáticos, e a mudança não pôde ser testada sem o NuGet; ficou como item de conferência na publicação |

## Como o conteúdo foi validado

- **Banco:** scripts executados duas vezes seguidas num PostgreSQL 16 (prova de idempotência); consulta de conferência dos 9 cursos; tentativa proposital de inserir curso "Em breve" sem data, recusada pelo `CHECK`.
- **Front:** `tsc` sem erros, ESLint sem avisos, 9 testes unitários (Vitest) e 56 verificações ponta a ponta com Playwright: listagem, busca sem acento, filtros combinados, contador, limpar, detalhe, voltar do navegador, 404, carregamento, erro do servidor, falta de conexão, menu móvel e ausência de rolagem horizontal em 320, 390, 768 e 1440 px.
- **Acessibilidade:** axe-core sem violações WCAG A/AA nas páginas e estados; Lighthouse de acessibilidade 100.
- **Comparação visual:** capturas de tela de cada página lado a lado com o Figma.
- **API:** o ambiente da IA não tinha o SDK do .NET, então a API foi validada por **revisão independente do código** e o front foi testado contra uma réplica do mesmo contrato. Na segunda sessão, o SDK .NET 10 foi instalado e os arquivos de modelo, DTOs, `FiltroCursos`, `ConsultaCursos`, `CursoMapeamento`, `Rotulos` e `Texto` foram compilados sem erros nem avisos. Os dois arquivos de teste do projeto rodaram sem alteração, com um executor mínimo no lugar do xUnit (pacote indisponível offline): 16 verificações passaram e 1 (`Url_do_banco_vira_connection_string`, que usa o Npgsql) não pôde ser executada. Também foi conferido que o `nome_busca` gravado no seed é idêntico ao resultado de `Texto.Normalizar` para os 9 cursos. A camada de EF Core, os endpoints e o `Program.cs` foram revisados por leitura (mapeamento de colunas contra o esquema SQL, tipos de retorno dos endpoints, tradução das consultas para SQL), mas não compilados; a compilação completa e o `dotnet test` ficam a cargo do CI do GitHub (`ci.yml`) e do build Docker feito pelo Render.
- **Banco (segunda sessão):** `01_schema.sql` e `02_seed.sql` executados duas vezes seguidas em PostgreSQL 16, sem erro; contagem final: 4 categorias, 9 cursos, 33 módulos e 79 aulas; 9 cargas horárias e 9 públicos-alvo distintos; 3 modalidades e 4 status em uso.
- **Front (segunda sessão):** `npm ci`, `npm run lint`, `npm test` (9 testes) e `npm run build` passaram.

## Exemplos de erros ou inadequações identificados e correções

| Erro identificado | Como foi percebido | Correção |
| --- | --- | --- |
| A camada vermelha dos cards ficou **atrás** da foto, deixando texto branco sobre a imagem, sem contraste | Captura de tela da página inicial comparada ao Figma | Ordem de empilhamento explícita (`z-index`): foto, camada vermelha, texto |
| Uma falha ao carregar as opções de filtro deixava os campos de filtro vazios, mesmo depois de "Tentar novamente" | Teste ponta a ponta simulando erro do servidor: o filtro de status ficou sem opções | "Tentar novamente" passou a recarregar também os filtros, e há um aviso próprio quando só os filtros falham |
| O carrossel de depoimentos não podia ser rolado pelo teclado | axe-core: regra `scrollable-region-focusable` | Faixa do carrossel com `tabIndex=0` |
| Pulo de nível de título (h1 para h3) na página de detalhe | Lighthouse: `heading-order` | Título de seção `h2` (visualmente oculto) antes da lista de benefícios |
| O CSS global era carregado depois do CSS dos componentes, e o botão "Área do aluno" perdia a borda | Captura de tela da página de catálogo | Importação do CSS global antes dos componentes, com comentário explicando |
| `vite.config.ts` usava `process.env` sem os tipos do Node, e o build quebrava | Erro do TypeScript na compilação | Dependência `@types/node` |
| Imagens com atributos `width`/`height` ignoravam a proporção definida no CSS e ficavam esticadas | Captura de tela da seção final da home | `height: auto` global para imagens |
| `/robots.txt` devolvia a página do app, inválida para buscadores | Lighthouse: SEO | Arquivo `robots.txt` real |
| Duas capas de curso mostravam a mesma pessoa | Revisão visual das capas | Novo recorte da foto |

Revisão da segunda sessão:

| Erro ou risco identificado | Como foi percebido | Correção |
| --- | --- | --- |
| O `render.yaml` não fixava a porta: a imagem escuta em 8080, e o Render espera a variável `PORT` (padrão 10000), o que podia atrasar ou impedir a detecção do serviço | Leitura cruzada do `Dockerfile` e do `render.yaml` | `PORT=8080` no `render.yaml` |
| O README citava testes Playwright e medições do Lighthouse sem deixar claro que os scripts não estão no repositório | Busca por essas menções no README e comparação com a árvore de arquivos | Frases ajustadas, com remissão ao `LIMITACOES.md` |
| O ZIP de publicação só podia ser gerado com .NET e Node instalados localmente | Tentativa de gerar o pacote no ambiente da IA, sem acesso ao NuGet | Job `publicacao` no CI, que gera o ZIP e o oferece como artefato |
| Não foi possível restaurar os pacotes da API no ambiente da IA (erro NU1301) | Saída do `dotnet restore` | Compilação parcial da lógica sem pacotes; o restante fica para o CI |
