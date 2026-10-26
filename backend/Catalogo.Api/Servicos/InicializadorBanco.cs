using Npgsql;

namespace Catalogo.Api.Servicos;

/// <summary>
/// Na subida da aplicação, executa os scripts de database/ em ordem (01_schema, 02_seed).
/// Os scripts são idempotentes, então rodar a cada deploy é seguro.
/// Tenta algumas vezes porque bancos gratuitos "acordam" devagar.
/// Em produção real, isso seria um passo separado do pipeline de deploy.
/// </summary>
public static class InicializadorBanco
{
    public static async Task ExecutarAsync(string conexao, ILogger logger, CancellationToken ct = default)
    {
        var pasta = Path.Combine(AppContext.BaseDirectory, "database");
        string[] scripts = Directory.Exists(pasta)
            ? Directory.GetFiles(pasta, "*.sql").Order(StringComparer.Ordinal).ToArray()
            : [];

        if (scripts.Length == 0)
        {
            logger.LogWarning("Nenhum script encontrado em {Pasta}. Inicialização do banco ignorada.", pasta);
            return;
        }

        const int tentativas = 5;
        for (var tentativa = 1; ; tentativa++)
        {
            try
            {
                await using var conn = new NpgsqlConnection(conexao);
                await conn.OpenAsync(ct);
                foreach (var script in scripts)
                {
                    await using var cmd = new NpgsqlCommand(await File.ReadAllTextAsync(script, ct), conn);
                    await cmd.ExecuteNonQueryAsync(ct);
                    logger.LogInformation("Script executado: {Script}", Path.GetFileName(script));
                }
                return;
            }
            // Só repete falhas de conexão; erro no próprio SQL (PostgresException) para na hora.
            catch (NpgsqlException ex) when (ex is not PostgresException && tentativa < tentativas)
            {
                logger.LogWarning(ex, "Banco indisponível (tentativa {Tentativa}/{Total}). Tentando de novo.", tentativa, tentativas);
                await Task.Delay(TimeSpan.FromSeconds(3 * tentativa), ct);
            }
        }
    }
}
