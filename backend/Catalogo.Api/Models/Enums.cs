namespace Catalogo.Api.Models;

// Listas fechadas: só mudam junto com regra de negócio. No banco são gravadas como texto.
public enum Modalidade
{
    Online,
    Presencial,
    Hibrido
}

public enum StatusCurso
{
    InscricoesAbertas,
    EmBreve,
    EmAndamento,
    Encerrado
}
