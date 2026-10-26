using Catalogo.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Catalogo.Api.Data;

// O esquema é definido em database/01_schema.sql (fonte da verdade).
// Aqui o EF Core só mapeia as classes para as tabelas e colunas que já existem.
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Categoria> Categorias => Set<Categoria>();
    public DbSet<Curso> Cursos => Set<Curso>();
    public DbSet<Modulo> Modulos => Set<Modulo>();
    public DbSet<Aula> Aulas => Set<Aula>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Categoria>(e =>
        {
            e.ToTable("categoria");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id").ValueGeneratedNever();
            e.Property(x => x.Nome).HasColumnName("nome");
            e.Property(x => x.Slug).HasColumnName("slug");
            e.Property(x => x.Icone).HasColumnName("icone");
        });

        modelBuilder.Entity<Curso>(e =>
        {
            e.ToTable("curso");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id").ValueGeneratedNever();
            e.Property(x => x.Slug).HasColumnName("slug");
            e.Property(x => x.NomeCompleto).HasColumnName("nome_completo");
            e.Property(x => x.NomeBreve).HasColumnName("nome_breve");
            e.Property(x => x.Resumo).HasColumnName("resumo");
            e.Property(x => x.Descricao).HasColumnName("descricao");
            e.Property(x => x.CategoriaId).HasColumnName("categoria_id");
            e.Property(x => x.Modalidade).HasColumnName("modalidade").HasConversion<string>();
            e.Property(x => x.CargaHorariaHoras).HasColumnName("carga_horaria_horas");
            e.Property(x => x.PublicoAlvo).HasColumnName("publico_alvo");
            e.Property(x => x.Status).HasColumnName("status").HasConversion<string>();
            e.Property(x => x.ImagemUrl).HasColumnName("imagem_url");
            e.Property(x => x.ImagemAlt).HasColumnName("imagem_alt");
            e.Property(x => x.DataDisponibilizacao).HasColumnName("data_disponibilizacao");
            e.Property(x => x.NomeBusca).HasColumnName("nome_busca");

            e.HasOne(x => x.Categoria).WithMany(c => c.Cursos).HasForeignKey(x => x.CategoriaId);
            e.HasMany(x => x.Modulos).WithOne().HasForeignKey(m => m.CursoId);
        });

        modelBuilder.Entity<Modulo>(e =>
        {
            e.ToTable("modulo");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id").ValueGeneratedNever();
            e.Property(x => x.CursoId).HasColumnName("curso_id");
            e.Property(x => x.Ordem).HasColumnName("ordem");
            e.Property(x => x.Titulo).HasColumnName("titulo");
            e.HasMany(x => x.Aulas).WithOne().HasForeignKey(a => a.ModuloId);
        });

        modelBuilder.Entity<Aula>(e =>
        {
            e.ToTable("aula");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id").ValueGeneratedNever();
            e.Property(x => x.ModuloId).HasColumnName("modulo_id");
            e.Property(x => x.Ordem).HasColumnName("ordem");
            e.Property(x => x.Titulo).HasColumnName("titulo");
            e.Property(x => x.Descricao).HasColumnName("descricao");
        });
    }
}
