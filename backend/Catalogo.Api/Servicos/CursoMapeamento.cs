using Catalogo.Api.Dtos;
using Catalogo.Api.Models;

namespace Catalogo.Api.Servicos;

public static class CursoMapeamento
{
    public static CategoriaDto ParaDto(Categoria c) => new(c.Slug, c.Nome, $"/assets/icons/{c.Icone}");

    public static CursoResumoDto ParaResumo(Curso c) => new(
        c.Slug, c.NomeCompleto, c.NomeBreve, c.Resumo,
        ParaDto(c.Categoria),
        new OpcaoDto(c.Modalidade.ToString(), Rotulos.De(c.Modalidade)),
        new OpcaoDto(c.Status.ToString(), Rotulos.De(c.Status)),
        c.CargaHorariaHoras, c.PublicoAlvo, c.ImagemUrl, c.ImagemAlt, c.DataDisponibilizacao);

    public static CursoDetalheDto ParaDetalhe(Curso c) => new(
        c.Slug, c.NomeCompleto, c.NomeBreve, c.Resumo, c.Descricao,
        ParaDto(c.Categoria),
        new OpcaoDto(c.Modalidade.ToString(), Rotulos.De(c.Modalidade)),
        new OpcaoDto(c.Status.ToString(), Rotulos.De(c.Status)),
        c.CargaHorariaHoras, c.PublicoAlvo, c.ImagemUrl, c.ImagemAlt, c.DataDisponibilizacao,
        c.Modulos.OrderBy(m => m.Ordem)
            .Select(m => new ModuloDto(m.Ordem, m.Titulo,
                m.Aulas.OrderBy(a => a.Ordem).Select(a => new AulaDto(a.Ordem, a.Titulo, a.Descricao)).ToList()))
            .ToList());
}
