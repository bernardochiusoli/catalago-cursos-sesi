using Catalogo.Api.Models;

namespace Catalogo.Api.Servicos;

public static class ConsultaCursos
{
    /// <summary>
    /// Aplica busca e filtros de forma combinada. Cada filtro só entra se foi informado,
    /// como um WHERE com AND dinâmico. Com o EF Core, tudo vira uma única consulta SQL;
    /// nos testes, a mesma função roda sobre uma lista em memória.
    /// </summary>
    public static IQueryable<Curso> Aplicar(IQueryable<Curso> cursos, FiltroCursos filtro)
    {
        // Cada termo precisa aparecer no nome: "matematica precisao" encontra
        // "Matemática para a Precisão".
        foreach (var termo in filtro.TermosBusca)
            cursos = cursos.Where(c => c.NomeBusca.Contains(termo));

        if (filtro.Categoria is not null)
            cursos = cursos.Where(c => c.Categoria.Slug == filtro.Categoria);

        if (filtro.Modalidade is { } modalidade)
            cursos = cursos.Where(c => c.Modalidade == modalidade);

        if (filtro.Status is { } status)
            cursos = cursos.Where(c => c.Status == status);

        return cursos;
    }
}
