using Catalogo.Api.Data;
using Catalogo.Api.Dtos;
using Catalogo.Api.Models;
using Catalogo.Api.Servicos;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Catalogo.Api.Endpoints;

public static class CursosEndpoints
{
    public static IEndpointRouteBuilder MapCursosEndpoints(this IEndpointRouteBuilder app)
    {
        var api = app.MapGroup("/api").WithTags("Catálogo");

        api.MapGet("/cursos", ListarAsync)
            .WithName("ListarCursos")
            .WithSummary("Lista os cursos com busca pelo nome e filtros combináveis")
            .WithDescription("Todos os parâmetros são opcionais e se combinam (AND). " +
                             "modalidade: Online, Presencial, Hibrido. " +
                             "status: InscricoesAbertas, EmBreve, EmAndamento, Encerrado. " +
                             "categoria: slug da categoria (veja /api/filtros).");

        api.MapGet("/cursos/{slug}", DetalharAsync)
            .WithName("DetalharCurso")
            .WithSummary("Detalhe de um curso, com módulos e aulas");

        api.MapGet("/filtros", FiltrosAsync)
            .WithName("ListarFiltros")
            .WithSummary("Opções de categoria, modalidade e status para montar os filtros da tela");

        return app;
    }

    private static async Task<Results<Ok<ListaCursosDto>, ValidationProblem>> ListarAsync(
        AppDbContext db, CancellationToken ct,
        string? busca = null, string? categoria = null, string? modalidade = null, string? status = null)
    {
        var (filtro, erros) = FiltroCursos.Criar(busca, categoria, modalidade, status);
        if (filtro is null) return TypedResults.ValidationProblem(erros);

        var cursos = await ConsultaCursos.Aplicar(db.Cursos.AsNoTracking(), filtro)
            .Include(c => c.Categoria)
            .OrderBy(c => c.NomeCompleto)
            .ToListAsync(ct);

        var itens = cursos.Select(CursoMapeamento.ParaResumo).ToList();
        return TypedResults.Ok(new ListaCursosDto(itens.Count, itens));
    }

    private static async Task<Results<Ok<CursoDetalheDto>, ProblemHttpResult>> DetalharAsync(
        string slug, AppDbContext db, CancellationToken ct)
    {
        var curso = await db.Cursos.AsNoTracking()
            .Include(c => c.Categoria)
            .Include(c => c.Modulos).ThenInclude(m => m.Aulas)
            .AsSplitQuery()
            .FirstOrDefaultAsync(c => c.Slug == slug.ToLower(), ct);

        if (curso is null)
            return TypedResults.Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Curso não encontrado",
                detail: $"Não existe curso com o identificador '{slug}'.");

        return TypedResults.Ok(CursoMapeamento.ParaDetalhe(curso));
    }

    private static async Task<Ok<FiltrosDto>> FiltrosAsync(AppDbContext db, CancellationToken ct)
    {
        var categorias = await db.Categorias.AsNoTracking().OrderBy(c => c.Nome).ToListAsync(ct);

        var modalidades = Enum.GetValues<Modalidade>()
            .Select(m => new OpcaoDto(m.ToString(), Rotulos.De(m))).ToList();
        var status = Enum.GetValues<StatusCurso>()
            .Select(s => new OpcaoDto(s.ToString(), Rotulos.De(s))).ToList();

        return TypedResults.Ok(new FiltrosDto(categorias.Select(CursoMapeamento.ParaDto).ToList(), modalidades, status));
    }
}
