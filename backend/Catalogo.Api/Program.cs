using Catalogo.Api.Data;
using Catalogo.Api.Endpoints;
using Catalogo.Api.Servicos;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var conexao = ConexaoBanco.Resolver(builder.Configuration);
builder.Services.AddDbContext<AppDbContext>(o => o.UseNpgsql(conexao));

// Erros sempre no formato padrão ProblemDetails (RFC 9457): o front lê "title" e "detail".
builder.Services.AddProblemDetails();
builder.Services.AddOpenApi();

var app = builder.Build();

// Cria as tabelas e insere os cursos fictícios, se ainda não existirem.
if (app.Configuration.GetValue("Banco:InicializarNaSubida", true))
    await InicializadorBanco.ExecutarAsync(conexao, app.Logger);

app.UseExceptionHandler();   // exceção não tratada vira 500 com ProblemDetails, sem detalhe interno
app.UseStatusCodePages();

// Em produção, o front compilado (React) fica em wwwroot e é servido pela própria API:
// uma única URL, sem CORS.
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapOpenApi();            // documento OpenAPI em /openapi/v1.json (interface em /docs)
app.MapCursosEndpoints();
app.MapGet("/health", () => TypedResults.Ok(new { status = "ok" })).ExcludeFromDescription();

// Rota de API inexistente responde 404 em JSON; qualquer outra rota devolve o front (SPA).
app.MapFallback("/api/{**resto}", () => TypedResults.Problem(statusCode: StatusCodes.Status404NotFound, title: "Rota não encontrada"))
   .ExcludeFromDescription();
app.MapFallbackToFile("index.html");

app.Run();
