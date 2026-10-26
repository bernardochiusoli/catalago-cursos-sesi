using Catalogo.Api.Models;
using Catalogo.Api.Servicos;

namespace Catalogo.Api.Tests;

// Testa a regra de busca e filtros sem banco: a mesma função que o EF Core
// traduz para SQL roda aqui sobre uma lista em memória.
public class ConsultaCursosTests
{
    private static readonly Categoria Matematica = new() { Id = 1, Nome = "Matemática", Slug = "matematica" };
    private static readonly Categoria Ciencias = new() { Id = 2, Nome = "Ciências da Natureza", Slug = "ciencias-da-natureza" };

    private static IQueryable<Curso> Cursos() => new List<Curso>
    {
        Novo(1, "Matemática para a Precisão: Medidas e Escalas na Metalurgia", "MAT-PREC", Matematica, Modalidade.Online, StatusCurso.InscricoesAbertas),
        Novo(2, "Estatística e Controle de Qualidade na Produção", "EST-CQP", Matematica, Modalidade.Online, StatusCurso.EmBreve),
        Novo(3, "Física do Movimento e da Energia na Metalurgia", "FIS-MOV", Ciencias, Modalidade.Presencial, StatusCurso.EmAndamento),
        Novo(4, "Química e Sustentabilidade", "QUI-SUS", Ciencias, Modalidade.Online, StatusCurso.InscricoesAbertas),
    }.AsQueryable();

    private static Curso Novo(int id, string nome, string breve, Categoria cat, Modalidade m, StatusCurso s) => new()
    {
        Id = id, NomeCompleto = nome, NomeBreve = breve, Categoria = cat, CategoriaId = cat.Id,
        Modalidade = m, Status = s, NomeBusca = Texto.Normalizar($"{nome} {breve}")
    };

    private static List<string> Buscar(string? busca = null, string? categoria = null, string? modalidade = null, string? status = null)
    {
        var (filtro, erros) = FiltroCursos.Criar(busca, categoria, modalidade, status);
        Assert.Empty(erros);
        return ConsultaCursos.Aplicar(Cursos(), filtro!).Select(c => c.NomeBreve).OrderBy(x => x).ToList();
    }

    [Fact]
    public void Sem_filtros_retorna_todos() => Assert.Equal(4, Buscar().Count);

    [Fact]
    public void Busca_ignora_acento_e_maiusculas() =>
        Assert.Equal(new[] { "MAT-PREC" }, Buscar(busca: "MATEMATICA"));

    [Fact]
    public void Busca_com_varios_termos_exige_todos() =>
        Assert.Equal(new[] { "MAT-PREC" }, Buscar(busca: "metalurgia precisão"));

    [Fact]
    public void Busca_pelo_nome_breve() =>
        Assert.Equal(new[] { "QUI-SUS" }, Buscar(busca: "qui-sus"));

    [Fact]
    public void Busca_e_filtros_combinados() =>
        Assert.Equal(new[] { "FIS-MOV" }, Buscar(busca: "metalurgia", categoria: "ciencias-da-natureza", modalidade: "Presencial", status: "EmAndamento"));

    [Fact]
    public void Filtro_por_status_aceita_qualquer_caixa() =>
        Assert.Equal(new[] { "MAT-PREC", "QUI-SUS" }, Buscar(status: "inscricoesabertas"));

    [Fact]
    public void Nenhum_resultado_retorna_lista_vazia() =>
        Assert.Empty(Buscar(busca: "robotica"));
}
