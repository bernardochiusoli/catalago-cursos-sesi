using Npgsql;

namespace Catalogo.Api.Servicos;

public static class ConexaoBanco
{
    /// <summary>
    /// Ordem de prioridade:
    /// 1. ConnectionStrings:Default (variável de ambiente ConnectionStrings__Default);
    /// 2. DATABASE_URL no formato URI (postgresql://usuario:senha@host/banco?sslmode=require),
    ///    que é o formato entregue por Neon, Render e similares.
    /// </summary>
    public static string Resolver(IConfiguration configuracao)
    {
        var padrao = configuracao.GetConnectionString("Default");
        if (!string.IsNullOrWhiteSpace(padrao)) return padrao;

        var url = configuracao["DATABASE_URL"];
        if (!string.IsNullOrWhiteSpace(url)) return DeUrl(url);

        throw new InvalidOperationException(
            "Banco não configurado. Defina ConnectionStrings__Default ou DATABASE_URL (veja o README).");
    }

    public static string DeUrl(string url)
    {
        var uri = new Uri(url);
        var usuarioSenha = uri.UserInfo.Split(':', 2);

        var builder = new NpgsqlConnectionStringBuilder
        {
            Host = uri.Host,
            Port = uri.Port > 0 ? uri.Port : 5432,
            Database = uri.AbsolutePath.Trim('/'),
            Username = Uri.UnescapeDataString(usuarioSenha[0]),
            Password = usuarioSenha.Length > 1 ? Uri.UnescapeDataString(usuarioSenha[1]) : null
        };

        if (uri.Query.Contains("sslmode=require", StringComparison.OrdinalIgnoreCase))
            builder.SslMode = SslMode.Require;

        return builder.ConnectionString;
    }
}
