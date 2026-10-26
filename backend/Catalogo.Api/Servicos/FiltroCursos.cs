using Catalogo.Api.Models;

namespace Catalogo.Api.Servicos;

/// <summary>Filtros já validados vindos da query string.</summary>
public sealed record FiltroCursos(string[] TermosBusca, string? Categoria, Modalidade? Modalidade, StatusCurso? Status)
{
    public const int TamanhoMaximoBusca = 100;

    public static FiltroCursos Vazio => new([], null, null, null);

    /// <summary>
    /// Valida os parâmetros recebidos. Valores inválidos viram erros por campo,
    /// devolvidos pela API como 400 (ValidationProblem).
    /// </summary>
    public static (FiltroCursos? Filtro, Dictionary<string, string[]> Erros) Criar(
        string? busca, string? categoria, string? modalidade, string? status)
    {
        var erros = new Dictionary<string, string[]>();

        if (busca is { Length: > TamanhoMaximoBusca })
            erros["busca"] = [$"A busca pode ter no máximo {TamanhoMaximoBusca} caracteres."];

        Modalidade? modalidadeValida = null;
        if (!string.IsNullOrWhiteSpace(modalidade))
        {
            if (TentarEnum<Modalidade>(modalidade, out var m)) modalidadeValida = m;
            else erros["modalidade"] = [$"Modalidade inválida. Use: {string.Join(", ", Enum.GetNames<Modalidade>())}."];
        }

        StatusCurso? statusValido = null;
        if (!string.IsNullOrWhiteSpace(status))
        {
            if (TentarEnum<StatusCurso>(status, out var s)) statusValido = s;
            else erros["status"] = [$"Status inválido. Use: {string.Join(", ", Enum.GetNames<StatusCurso>())}."];
        }

        if (erros.Count > 0) return (null, erros);

        var termos = Texto.Normalizar(busca).Split(' ', StringSplitOptions.RemoveEmptyEntries);
        var categoriaSlug = string.IsNullOrWhiteSpace(categoria) ? null : categoria.Trim().ToLowerInvariant();

        return (new FiltroCursos(termos, categoriaSlug, modalidadeValida, statusValido), erros);
    }

    // Aceita só um nome exato da lista (sem diferenciar maiúsculas). Comparar com os nomes evita
    // duas armadilhas do Enum.TryParse: aceitar números ("7") e listas com vírgula ("Online,Presencial").
    private static bool TentarEnum<T>(string valor, out T resultado) where T : struct, Enum
    {
        var nome = Enum.GetNames<T>().FirstOrDefault(n => string.Equals(n, valor.Trim(), StringComparison.OrdinalIgnoreCase));
        resultado = default;
        return nome is not null && Enum.TryParse(nome, out resultado);
    }
}
