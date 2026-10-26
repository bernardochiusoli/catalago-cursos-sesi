# Catálogo de cursos SESI Indústria

Aplicação web para consultar, pesquisar e filtrar os cursos de um ambiente educacional (AVA/Moodle), com página de detalhes de cada oferta. Front-end em React, API em C#/.NET e banco PostgreSQL.

| | |
| --- | --- |
| Aplicação publicada | `https://catalogo-cursos-sesi-lx1e.onrender.com` |
| Documentação da API (Swagger) | `https://catalogo-cursos-sesi-lx1e.onrender.com/docs/`|
| Documento OpenAPI | `https://catalogo-cursos-sesi-lx1e.onrender.com/openapi/v1.json` |
| Protótipo de referência | Figma "[TEST DEV] SESI Indústria" |

> O serviço gratuito de hospedagem "dorme" sem uso: a primeira visita pode levar cerca de um minuto. A aplicação mostra o estado de carregamento enquanto isso. Para rodar localmente, veja [Instruções para execução](#instruções-para-execução).

## Sumário

1. [Objetivo da aplicação](#objetivo-da-aplicação)
2. [Tecnologias utilizadas](#tecnologias-utilizadas)
3. [Arquitetura da solução](#arquitetura-da-solução)
4. [Estrutura das pastas](#estrutura-das-pastas)
5. [Instruções para execução](#instruções-para-execução)
6. [Configuração do banco](#configuração-do-banco)
7. [Endpoints](#endpoints)
8. [Modelo de dados](#modelo-de-dados)
9. [Estratégia de responsividade](#estratégia-de-responsividade)
10. [Decisões de acessibilidade](#decisões-de-acessibilidade)
11. [Processo de publicação](#processo-de-publicação)
12. [Limitações conhecidas](#limitações-conhecidas)

Outros documentos: [USO_DE_IA.md](USO_DE_IA.md) (registro do uso de inteligência artificial) e [LIMITACOES.md](LIMITACOES.md) (diferenças em relação ao Figma e itens não concluídos).

---

## Objetivo da aplicação

Apresentar o catálogo de cursos do Centro de Tecnologias e Educação Digital (CTED). A pessoa pode:

- ver todos os cursos, que vêm da API;
- pesquisar pelo nome (sem diferenciar maiúsculas e acentos);
- filtrar por categoria, modalidade e status, combinando filtros e pesquisa;
- ver a quantidade de resultados e limpar os filtros;
- abrir o detalhe de cada curso, com módulos e aulas;
- ver mensagens claras de carregamento, de erro e de nenhum resultado;
- usar tudo isso em qualquer tamanho de tela e só com o teclado.

Todos os dados são fictícios: 9 cursos, 4 categorias, 3 modalidades e 4 status.

## Tecnologias utilizadas

| Camada | Tecnologia | Versão | Por que |
| --- | --- | --- | --- |
| Back-end | ASP.NET Core (Minimal API), C# | .NET 10 (LTS) | Exigido pelo case; Minimal API é enxuta para 3 endpoints de leitura |
| Acesso a dados | Entity Framework Core + Npgsql | 10.x | ORM oficial do .NET; consultas parametrizadas (sem SQL injection) |
| Banco | PostgreSQL | 16 | Código aberto, padrão de mercado e com plano gratuito em nuvem (Neon) |
| Documentação da API | OpenAPI nativo do ASP.NET Core + Swagger UI | 10.x / 5.17 | O avaliador testa a API pelo navegador |
| Front-end | React + TypeScript + Vite | 19 / 5.8 / 6 | Componentes reaproveitáveis; TypeScript garante o contrato com a API |
| Rotas | React Router | 7 | Cada curso tem URL própria; busca e filtros ficam na URL |
| Testes | xUnit (back), Vitest + Testing Library (front) | 2.9 / 3 | Regras de busca, filtros e componentes acessíveis |
| Publicação | Docker, Render (aplicação) e Neon (banco) | | Planos gratuitos, sem custo |
| Integração contínua | GitHub Actions | | Compila, testa e gera a imagem a cada push |

## Arquitetura da solução

```mermaid
flowchart LR
    N["Navegador<br/>React + TypeScript"] -- "HTTPS (/ e /api)" --> A
    subgraph R["Render, plano gratuito (contêiner Docker)"]
      A["ASP.NET Core<br/>serve o front (wwwroot)<br/>+ API /api/*"]
    end
    A -- "SQL (EF Core + Npgsql)" --> B[("PostgreSQL<br/>Neon, plano gratuito")]
    G["GitHub"] -- "push gera deploy" --> R
```

- **Uma imagem, uma URL.** O front compilado fica na pasta `wwwroot` da API, que entrega as telas e responde as consultas. Não há CORS para configurar.
- **Busca e filtros no servidor.** O front só monta a URL (`/api/cursos?busca=...&status=...`); a API transforma isso numa única consulta SQL. Isso escala para milhares de cursos sem mudar o front.
- **Camadas do back-end:** `Endpoints` (HTTP) → `Servicos` (regras de busca, validação e mapeamento) → `Data` (EF Core) → banco. A API devolve **DTOs**, nunca as entidades.
- **Banco como fonte da verdade.** O esquema e os dados estão em scripts SQL idempotentes (`database/`). A API executa esses scripts na subida; o EF Core só mapeia as tabelas.

## Estrutura das pastas

```
catalogo-cursos-sesi/
├── README.md, USO_DE_IA.md, LIMITACOES.md
├── Dockerfile               # imagem única: compila o front, publica a API, junta os dois
├── docker-compose.yml       # execução local: PostgreSQL + aplicação
├── render.yaml              # configuração do Render (publicação)
├── .env.example             # variáveis de ambiente esperadas (sem valores reais)
├── .github/workflows/ci.yml # integração contínua
├── database/
│   ├── 01_schema.sql        # tabelas, chaves, índices e regras (CHECK)
│   └── 02_seed.sql          # 9 cursos fictícios com módulos e aulas
├── backend/
│   ├── Catalogo.Api/
│   │   ├── Program.cs       # configuração da aplicação e do pipeline HTTP
│   │   ├── Endpoints/       # rotas /api/cursos, /api/cursos/{slug}, /api/filtros
│   │   ├── Servicos/        # busca e filtros, validação, normalização de texto, conexão, inicialização do banco
│   │   ├── Models/          # entidades: Categoria, Curso, Modulo, Aula, enums
│   │   ├── Dtos/            # formato das respostas da API
│   │   └── Data/            # AppDbContext (mapeamento EF Core)
│   └── Catalogo.Api.Tests/  # testes xUnit das regras de busca e filtros
├── frontend/
│   ├── public/assets/       # imagens (WebP), ícones SVG e fonte do pacote do SESI
│   ├── public/docs/         # Swagger UI
│   └── src/
│       ├── api/             # cliente HTTP e tipos do contrato da API
│       ├── components/      # cabeçalho, rodapé, card, carrossel, acordeão, estados...
│       ├── pages/           # Início, Catálogo, Detalhe do curso, AVA
│       ├── hooks/           # useApi (carregando/sucesso/erro), useTitulo
│       └── styles/          # tokens de cor, fonte e espaçamento do Figma
├── scripts/                 # geração do ZIP de publicação
└── publicacao/              # ZIP com os arquivos publicados
```

## Instruções para execução

### Opção 1: Docker (um comando)

Pré-requisito: Docker Desktop.

```bash
docker compose up --build
```

- Aplicação: http://localhost:8080
- Documentação da API: http://localhost:8080/docs

O Compose sobe o PostgreSQL e a aplicação. Na primeira subida, a API cria as tabelas e insere os cursos.

### Opção 2: sem Docker (desenvolvimento)

Pré-requisitos: [.NET SDK 10](https://dotnet.microsoft.com/download), Node.js 20 ou superior e PostgreSQL 14 ou superior rodando localmente.

```bash
# 1. Banco: crie um banco vazio chamado "catalogo"
createdb -U postgres catalogo

# 2. API (porta 5080). A conexão padrão de desenvolvimento está em appsettings.Development.json
cd backend/Catalogo.Api
dotnet run

# 3. Front (porta 5173), em outro terminal. O Vite redireciona /api para a porta 5080
cd frontend
npm install
npm run dev
```

Abra http://localhost:5173. Se o seu PostgreSQL usa outra senha, defina a variável `ConnectionStrings__Default` antes do `dotnet run`.

### Testes

```bash
dotnet test backend/Catalogo.Api.Tests
cd frontend && npm test && npm run lint
```

## Configuração do banco

- **Conexão.** A API procura, nesta ordem:
  1. `ConnectionStrings__Default` no formato Npgsql (`Host=...;Database=...;Username=...;Password=...`);
  2. `DATABASE_URL` no formato URI (`postgresql://usuario:senha@host/banco?sslmode=require`), que é o formato entregue pelo Neon.
- **Criação e carga.** Os scripts de `database/` são copiados junto com a API e executados em ordem a cada subida. São idempotentes (`CREATE TABLE IF NOT EXISTS`, `INSERT ... ON CONFLICT DO NOTHING`), então rodar várias vezes não duplica nada. Para desligar: `Banco__InicializarNaSubida=false`.
- **Execução manual**, se preferir:
  ```bash
  psql "$DATABASE_URL" -f database/01_schema.sql -f database/02_seed.sql
  ```
- **Regras no próprio banco:** valores válidos de modalidade e status (`CHECK`), carga horária positiva e curso "Em breve" sempre com data de disponibilização.
- **Busca sem acento:** a coluna `nome_busca` guarda nome completo + nome breve em minúsculas e sem acento. Assim "matematica" encontra "Matemática" sem depender de extensão do banco.

## Endpoints

Base: `/api`. Respostas em JSON. Erros no formato padrão **ProblemDetails** (RFC 9457).

| Método e rota | Descrição | Respostas |
| --- | --- | --- |
| `GET /api/cursos` | Lista os cursos. Parâmetros opcionais e combináveis: `busca`, `categoria` (slug), `modalidade` (`Online`, `Presencial`, `Hibrido`), `status` (`InscricoesAbertas`, `EmBreve`, `EmAndamento`, `Encerrado`) | 200 `{ total, itens }`; 400 se um valor for inválido |
| `GET /api/cursos/{slug}` | Detalhe do curso com módulos e aulas | 200; 404 se não existir |
| `GET /api/filtros` | Opções de categoria, modalidade e status para montar os filtros | 200 |
| `GET /health` | Verificação de saúde usada pela hospedagem | 200 `{ status: "ok" }` |
| `GET /openapi/v1.json` | Documento OpenAPI | 200 |

**Exemplo: busca + filtros combinados**

`GET /api/cursos?busca=metalurgia&categoria=ciencias-da-natureza&status=EmAndamento`

```json
{
  "total": 1,
  "itens": [
    {
      "slug": "fisica-do-movimento-e-da-energia",
      "nomeCompleto": "Física do Movimento e da Energia na Metalurgia",
      "nomeBreve": "FIS-MOV",
      "resumo": "Estudo de forças, atrito, calor e energia em máquinas, fornos e prensas.",
      "categoria": { "slug": "ciencias-da-natureza", "nome": "Ciências da Natureza", "icone": "/assets/icons/icon-ciencias-natureza-20px.svg" },
      "modalidade": { "valor": "Presencial", "rotulo": "Presencial" },
      "status": { "valor": "EmAndamento", "rotulo": "Em andamento" },
      "cargaHorariaHoras": 48,
      "publicoAlvo": "Operadores de máquinas, mantenedores e técnicos de metalurgia.",
      "imagemUrl": "/assets/img/cursos/fisica-movimento-energia.webp",
      "imagemAlt": "Ferramenta de corte de um torno com cavacos metálicos",
      "dataDisponibilizacao": "2026-09-14"
    }
  ]
}
```

**Exemplo: valor inválido**

`GET /api/cursos?status=Cancelado` → `400`

```json
{
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": { "status": ["Status inválido. Use: InscricoesAbertas, EmBreve, EmAndamento, Encerrado."] }
}
```

O detalhe (`/api/cursos/{slug}`) devolve os mesmos campos, mais `descricao` e `modulos: [{ ordem, titulo, aulas: [{ ordem, titulo, descricao }] }]`.

## Modelo de dados

```mermaid
erDiagram
    categoria ||--o{ curso : "agrupa"
    curso ||--|{ modulo : "tem"
    modulo ||--|{ aula : "tem"
    categoria {
        int id PK
        varchar nome
        varchar slug
        varchar icone
    }
    curso {
        int id PK
        varchar slug
        varchar nome_completo
        varchar nome_breve
        varchar resumo
        text descricao
        int categoria_id FK
        varchar modalidade
        int carga_horaria_horas
        varchar publico_alvo
        varchar status
        varchar imagem_url
        varchar imagem_alt
        date data_disponibilizacao
        varchar nome_busca
    }
    modulo {
        int id PK
        int curso_id FK
        int ordem
        varchar titulo
    }
    aula {
        int id PK
        int modulo_id FK
        int ordem
        varchar titulo
        varchar descricao
    }
```

| Campo pedido no case | Coluna |
| --- | --- |
| Nome completo | `curso.nome_completo` |
| Nome breve | `curso.nome_breve` (código do curso, como o "nome breve" do Moodle) |
| Descrição | `curso.descricao` (texto longo) e `curso.resumo` (texto curto do card) |
| Categoria | `curso.categoria_id` → `categoria` |
| Modalidade | `curso.modalidade` |
| Carga horária | `curso.carga_horaria_horas` |
| Público-alvo | `curso.publico_alvo` |
| Status | `curso.status` |
| Imagem de apresentação | `curso.imagem_url` + `curso.imagem_alt` (texto alternativo) |
| Data de disponibilização | `curso.data_disponibilizacao` (opcional) |

Decisões: **modalidade e status** são listas fechadas (enums no C#, gravados como texto para o banco ficar legível); **categoria** é tabela própria porque tem ícone e pode crescer; **imagem_alt** é dado, porque a descrição da imagem muda de curso para curso.

## Estratégia de responsividade

- **Mobile first, sem framework de CSS.** Tokens do Figma (cores, fonte, raios) em variáveis CSS; tamanhos de título com `clamp()`, que crescem com a tela sem saltos.
- **Grades fluidas:** o catálogo usa `grid-template-columns: repeat(auto-fill, minmax(250px, 1fr))`, de 1 coluna no celular a 4 no desktop, sem pontos de quebra manuais.
- **Pontos de quebra só onde o layout muda:** 760 px (menu vira botão), 860 px (colunas do detalhe e da home empilham), 960 px e 600 px (painel de filtros).
- **Carrosséis com rolagem nativa** (`scroll-snap`), que funcionam com toque, trackpad e teclado; as setas apenas rolam a faixa.
- **Imagens:** WebP redimensionado (o pacote original tinha fotos de cerca de 3 MB; cada capa ficou com menos de 40 KB), `width`/`height` definidos para evitar salto de layout e `loading="lazy"` fora da primeira dobra.
- **Validação:** sem rolagem horizontal em 320, 390, 768 e 1440 px em todas as páginas (teste automatizado com Playwright, executado durante o desenvolvimento; os scripts não estão versionados, veja [LIMITACOES.md](LIMITACOES.md)).

## Decisões de acessibilidade

Meta: WCAG 2.1 nível AA.

- **Estrutura:** HTML semântico (`header`, `nav`, `main`, `footer`, `article`), um `h1` por página e títulos em ordem; `lang="pt-BR"`; título da aba muda a cada página.
- **Teclado:** tudo funciona sem mouse; link "Pular para o conteúdo" é o primeiro item; foco sempre visível; a faixa do carrossel recebe foco para rolar com as setas.
- **Formulário de busca:** `role="search"`, todo campo com `label`; a quantidade de resultados fica numa região `aria-live`, então o leitor de tela anuncia "3 cursos encontrados" a cada mudança.
- **Estados:** carregando com `role="status"`; erro com `role="alert"` e botão "Tentar novamente"; nenhum resultado com explicação e ação.
- **Componentes:** acordeão com `aria-expanded` e `aria-controls`; menu móvel com `aria-expanded`; cada card tem um único link, com o nome do curso, e o card inteiro continua clicável.
- **Imagens:** capas dos cards são decorativas (`alt=""`) para não repetir informação; na página de detalhe a imagem tem texto alternativo vindo do banco; ícones decorativos com `aria-hidden`.
- **Cor e contraste:** status sempre com texto (nunca só cor); vermelho `#D00602` sobre branco tem contraste de 5,7:1; textos sobre fotos ficam sobre camada vermelha opaca; bordas de campos com contraste de 3:1.
- **Movimento:** `prefers-reduced-motion` desliga animações e rolagem suave.
- **Validação:** axe-core sem violações WCAG A/AA nas páginas e estados testados; Lighthouse de acessibilidade 100 em Início, Catálogo e Detalhe (medições feitas durante o desenvolvimento, não repetidas no CI).

## Processo de publicação

1. **Banco (Neon, gratuito):** criar projeto e banco `catalogo`, copiar a URL de conexão (`postgresql://...?sslmode=require`).
2. **Aplicação (Render, gratuito):** "New Web Service" a partir do repositório do GitHub, ambiente **Docker** (o Render lê o `Dockerfile` da raiz; o `render.yaml` traz a mesma configuração).
3. **Variáveis de ambiente no Render:** `DATABASE_URL` com a URL do Neon e `PORT=8080` (já no `render.yaml`). Nenhum segredo fica no repositório.
4. **Health check:** `/health`.
5. **Deploy automático:** cada push na `main` gera nova imagem e nova publicação. Na subida, a API aplica os scripts do banco.
6. **ZIP de publicação:** `scripts/gerar-publicacao.sh` (ou `.ps1` no Windows) gera `publicacao/catalogo-publicacao.zip` com a API publicada e o front compilado em `wwwroot`. O pipeline de CI (`.github/workflows/ci.yml`) também gera esse ZIP a cada push e o disponibiliza como artefato (Actions > execução > Artifacts). Para rodar o pacote: `dotnet Catalogo.Api.dll` com a variável de conexão definida.

Nenhum serviço pago foi contratado. Limite conhecido do plano gratuito: o serviço dorme após um período sem acesso.

## Limitações conhecidas

Resumo; a lista completa, com as diferenças em relação ao Figma, está em [LIMITACOES.md](LIMITACOES.md).

- Sem integração real com o Moodle (diferencial opcional); a tela de AVA é uma demonstração navegável.
- Sem paginação na API, porque o catálogo tem 9 cursos; seria o primeiro passo para crescer.
- Cadastro, edição e exclusão de cursos estão fora do escopo, conforme o enunciado.
- Plano gratuito do Render: primeira visita após inatividade pode demorar cerca de um minuto.
- A inicialização do banco roda na subida da aplicação, o que é prático para o case; em produção, seria um passo separado do pipeline.
