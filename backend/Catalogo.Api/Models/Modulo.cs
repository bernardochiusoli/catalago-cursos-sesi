namespace Catalogo.Api.Models;

public class Modulo
{
    public int Id { get; set; }
    public int CursoId { get; set; }
    public int Ordem { get; set; }
    public string Titulo { get; set; } = "";

    public List<Aula> Aulas { get; set; } = [];
}

public class Aula
{
    public int Id { get; set; }
    public int ModuloId { get; set; }
    public int Ordem { get; set; }
    public string Titulo { get; set; } = "";
    public string Descricao { get; set; } = "";
}
