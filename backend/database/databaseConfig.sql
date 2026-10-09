CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(60) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    removido BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS plano_contas (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    descricao VARCHAR(120) NOT NULL,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('Receita', 'Despesa')),
    removido BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS contas_pagar (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(160) NOT NULL,
    fornecedor VARCHAR(120) NOT NULL,
    valor NUMERIC(12, 2) NOT NULL CHECK (valor > 0),
    data_vencimento DATE NOT NULL,
    plano_contas_id INTEGER NOT NULL REFERENCES plano_contas(id),
    removido BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_contas_pagar_vencimento
    ON contas_pagar(data_vencimento) WHERE removido = FALSE;

INSERT INTO plano_contas (codigo, descricao, tipo)
VALUES
    ('3.1.01', 'Despesas administrativas', 'Despesa'),
    ('3.1.02', 'Despesas com pessoal', 'Despesa'),
    ('3.1.03', 'Despesas operacionais', 'Despesa')
ON CONFLICT (codigo) DO NOTHING;
