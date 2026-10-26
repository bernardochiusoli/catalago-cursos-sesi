namespace Catalogo.Api.Dtos;

// A API devolve DTOs, nunca as entidades: a tela recebe só o que precisa
// e o modelo interno pode mudar sem quebrar o front.

public record CategoriaDto(string Slug, string Nome, string Icone);

public record OpcaoDto(string Valor, string Rotulo);

public record CursoResumoDto(
    string Slug,
    string NomeCompleto,
    string NomeBreve,
    string Resumo,
    CategoriaDto Categoria,
    OpcaoDto Modalidade,
    OpcaoDto Status,
    int CargaHorariaHoras,
    string PublicoAlvo,
    string ImagemUrl,
    string ImagemAlt,
    DateOnly? DataDisponibilizacao);

public record ListaCursosDto(int Total, IReadOnlyList<CursoResumoDto> Itens);

public record AulaDto(int Ordem, string Titulo, string Descricao);

public record ModuloDto(int Ordem, string Titulo, IReadOnlyList<AulaDto> Aulas);

public record CursoDetalheDto(
    string Slug,
    string NomeCompleto,
    string NomeBreve,
    string Resumo,
    string Descricao,
    CategoriaDto Categoria,
    OpcaoDto Modalidade,
    OpcaoDto Status,
    int CargaHorariaHoras,
    string PublicoAlvo,
    string ImagemUrl,
    string ImagemAlt,
    DateOnly? DataDisponibilizacao,
    IReadOnlyList<ModuloDto> Modulos);

public record FiltrosDto(
    IReadOnlyList<CategoriaDto> Categorias,
    IReadOnlyList<OpcaoDto> Modalidades,
    IReadOnlyList<OpcaoDto> Status);
