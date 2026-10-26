namespace Catalogo.Api.Models;

public class Categoria
{
    public int Id { get; set; }
    public string Nome { get; set; } = "";
    public string Slug { get; set; } = "";
    public string Icone { get; set; } = "";

    public List<Curso> Cursos { get; set; } = [];
}
