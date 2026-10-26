-- Esquema do catálogo de cursos (PostgreSQL 14+).
-- Idempotente: pode rodar mais de uma vez sem erro.

CREATE TABLE IF NOT EXISTS categoria (
    id      INTEGER      PRIMARY KEY,
    nome    VARCHAR(80)  NOT NULL UNIQUE,
    slug    VARCHAR(80)  NOT NULL UNIQUE,
    icone   VARCHAR(120) NOT NULL
);

CREATE TABLE IF NOT EXISTS curso (
    id                     INTEGER      PRIMARY KEY,
    slug                   VARCHAR(120) NOT NULL UNIQUE,
    nome_completo          VARCHAR(200) NOT NULL,
    nome_breve             VARCHAR(40)  NOT NULL UNIQUE,
    resumo                 VARCHAR(300) NOT NULL,
    descricao              TEXT         NOT NULL,
    categoria_id           INTEGER      NOT NULL REFERENCES categoria (id),
    modalidade             VARCHAR(20)  NOT NULL,
    carga_horaria_horas    INTEGER      NOT NULL,
    publico_alvo           VARCHAR(300) NOT NULL,
    status                 VARCHAR(30)  NOT NULL,
    imagem_url             VARCHAR(300) NOT NULL,
    imagem_alt             VARCHAR(300) NOT NULL,
    data_disponibilizacao  DATE         NULL,
    -- nome completo + nome breve em minúsculas e sem acento, para a busca
    nome_busca             VARCHAR(300) NOT NULL,
    CONSTRAINT ck_curso_modalidade CHECK (modalidade IN ('Online', 'Presencial', 'Hibrido')),
    CONSTRAINT ck_curso_status CHECK (status IN ('InscricoesAbertas', 'EmBreve', 'EmAndamento', 'Encerrado')),
    CONSTRAINT ck_curso_carga CHECK (carga_horaria_horas > 0),
    -- curso "Em breve" sempre informa quando fica disponível
    CONSTRAINT ck_curso_em_breve_tem_data CHECK (status <> 'EmBreve' OR data_disponibilizacao IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS ix_curso_categoria ON curso (categoria_id);
CREATE INDEX IF NOT EXISTS ix_curso_status ON curso (status);
CREATE INDEX IF NOT EXISTS ix_curso_modalidade ON curso (modalidade);

CREATE TABLE IF NOT EXISTS modulo (
    id        INTEGER      PRIMARY KEY,
    curso_id  INTEGER      NOT NULL REFERENCES curso (id) ON DELETE CASCADE,
    ordem     INTEGER      NOT NULL,
    titulo    VARCHAR(200) NOT NULL,
    CONSTRAINT uq_modulo_ordem UNIQUE (curso_id, ordem)
);

CREATE TABLE IF NOT EXISTS aula (
    id         INTEGER      PRIMARY KEY,
    modulo_id  INTEGER      NOT NULL REFERENCES modulo (id) ON DELETE CASCADE,
    ordem      INTEGER      NOT NULL,
    titulo     VARCHAR(200) NOT NULL,
    descricao  VARCHAR(500) NOT NULL,
    CONSTRAINT uq_aula_ordem UNIQUE (modulo_id, ordem)
);
