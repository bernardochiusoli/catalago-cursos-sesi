using Catalogo.Api.Servicos;

namespace Catalogo.Api.Tests;

public class FiltroCursosTests
{
    [Theory]
    [InlineData("Remoto")]
    [InlineData("7")]
    [InlineData("Online,Presencial")]
    public void Modalidade_invalida_gera_erro(string valor)
    {
        var (filtro, erros) = FiltroCursos.Criar(null, null, valor, null);
        Assert.Null(filtro);
        Assert.True(erros.ContainsKey("modalidade"));
    }

    [Fact]
    public void Status_invalido_gera_erro()
    {
        var (filtro, erros) = FiltroCursos.Criar(null, null, null, "Cancelado");
        Assert.Null(filtro);
        Assert.True(erros.ContainsKey("status"));
    }

    [Fact]
    public void Busca_longa_demais_gera_erro()
    {
        var (_, erros) = FiltroCursos.Criar(new string('a', FiltroCursos.TamanhoMaximoBusca + 1), null, null, null);
        Assert.True(erros.ContainsKey("busca"));
    }

    [Theory]
    [InlineData("  Matemática  ", "matematica")]
    [InlineData("CIÊNCIAS   da Natureza", "ciencias da natureza")]
    [InlineData("Ação", "acao")]
    [InlineData(null, "")]
    public void Normalizar_remove_acento_caixa_e_espacos(string? entrada, string esperado) =>
        Assert.Equal(esperado, Texto.Normalizar(entrada));

    [Fact]
    public void Url_do_banco_vira_connection_string()
    {
        var cs = ConexaoBanco.DeUrl("postgresql://usuario:s%40nha@ep-exemplo.neon.tech/catalogo?sslmode=require");
        Assert.Contains("Host=ep-exemplo.neon.tech", cs);
        Assert.Contains("Database=catalogo", cs);
        Assert.Contains("Username=usuario", cs);
        Assert.Contains("Password=s@nha", cs);
        Assert.Contains("SSL Mode=Require", cs);
    }
}
