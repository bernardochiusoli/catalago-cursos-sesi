using Catalogo.Api.Models;

namespace Catalogo.Api.Servicos;

// Texto exibido na tela para cada valor das listas fechadas.
public static class Rotulos
{
    public static string De(Modalidade modalidade) => modalidade switch
    {
        Modalidade.Online => "Online",
        Modalidade.Presencial => "Presencial",
        Modalidade.Hibrido => "Híbrido",
        _ => modalidade.ToString()
    };

    public static string De(StatusCurso status) => status switch
    {
        StatusCurso.InscricoesAbertas => "Inscrições abertas",
        StatusCurso.EmBreve => "Em breve",
        StatusCurso.EmAndamento => "Em andamento",
        StatusCurso.Encerrado => "Encerrado",
        _ => status.ToString()
    };
}
