using System.Text;

namespace Catalogo.Api.Servicos;

public static class Texto
{
    // Tabela explícita de acentos do português. Evita depender de recursos de
    // globalização (ICU) do sistema operacional do container.
    private static readonly Dictionary<char, char> SemAcento = new()
    {
        ['á'] = 'a', ['à'] = 'a', ['â'] = 'a', ['ã'] = 'a', ['ä'] = 'a',
        ['é'] = 'e', ['è'] = 'e', ['ê'] = 'e', ['ë'] = 'e',
        ['í'] = 'i', ['ì'] = 'i', ['î'] = 'i', ['ï'] = 'i',
        ['ó'] = 'o', ['ò'] = 'o', ['ô'] = 'o', ['õ'] = 'o', ['ö'] = 'o',
        ['ú'] = 'u', ['ù'] = 'u', ['û'] = 'u', ['ü'] = 'u',
        ['ç'] = 'c', ['ñ'] = 'n'
    };

    /// <summary>Minúsculas, sem acento e com espaços simples. "  Matemática " vira "matematica".</summary>
    public static string Normalizar(string? texto)
    {
        if (string.IsNullOrWhiteSpace(texto)) return "";

        var sb = new StringBuilder(texto.Length);
        var ultimoFoiEspaco = false;
        foreach (var original in texto.Trim().ToLowerInvariant())
        {
            var c = SemAcento.GetValueOrDefault(original, original);
            if (char.IsWhiteSpace(c))
            {
                if (!ultimoFoiEspaco) sb.Append(' ');
                ultimoFoiEspaco = true;
                continue;
            }
            sb.Append(c);
            ultimoFoiEspaco = false;
        }
        return sb.ToString();
    }
}
