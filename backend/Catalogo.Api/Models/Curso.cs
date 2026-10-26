namespace Catalogo.Api.Models;

public class Curso
{
    public int Id { get; set; }
    public string Slug { get; set; } = "";
    public string NomeCompleto { get; set; } = "";
    public string NomeBreve { get; set; } = "";
    public string Resumo { get; set; } = "";
    public string Descricao { get; set; } = "";

    public int CategoriaId { get; set; }
    public Categoria Categoria { get; set; } = null!;

    public Modalidade Modalidade { get; set; }
    public int CargaHorariaHoras { get; set; }
    public string PublicoAlvo { get; set; } = "";
    public StatusCurso Status { get; set; }
    public string ImagemUrl { get; set; } = "";
    public string ImagemAlt { get; set; } = "";

    // Opcional: só faz sentido para turmas com data (ex.: status "Em breve").
    public DateOnly? DataDisponibilizacao { get; set; }

    // Nome completo + nome breve em minúsculas e sem acento. Preenchido pelo script de seed.
    public string NomeBusca { get; set; } = "";

    public List<Modulo> Modulos { get; set; } = [];
}
