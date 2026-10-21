# Financeiro Cooperativa

## Preparar uma vez

Abra Terminal na pasta do projeto.

1. Instale dependências:

   ```bash
   npm install
   ```

2. Se `.env` ainda não existir, crie-o:

   ```bash
   cp .env.example .env
   ```

   Confira `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` e `DB_PASSWORD`. A senha precisa ser igual no `.env` e no PostgreSQL. Defina também `JWT_SECRET`, `ADMIN_USERNAME` e `ADMIN_PASSWORD`.

3. Inicie PostgreSQL e confira a conexão:

   ```bash
   brew services start postgresql@14
   pg_isready -h 127.0.0.1 -p 5432
   ```

4. Crie usuário e banco na primeira instalação. Conecte ao PostgreSQL:

   ```bash
   psql -h 127.0.0.1 -p 5432 -U "$(whoami)" -d postgres
   ```

   No prompt `postgres=#`, execute cada linha separadamente. `\password` pede a senha duas vezes; use o valor de `DB_PASSWORD` do `.env`.

   ```sql
   CREATE ROLE dw3_financeiro WITH LOGIN;
   \password dw3_financeiro
   CREATE DATABASE dw3_financeiro OWNER dw3_financeiro;
   \q
   ```

   Se a role ou o banco já existir, pule o comando de criação correspondente.

5. Crie tabelas, categorias iniciais e usuário de acesso:

   ```bash
   npm run db:init
   npm run seed:admin
   ```

## Iniciar o sistema

Mantenha PostgreSQL ativo:

```bash
brew services start postgresql@14
```

Abra dois terminais na pasta do projeto.

Terminal 1 — API:

```bash
npm run start:api
```

Terminal 2 — site:

```bash
npm run start:web
```

Abra `http://localhost:40100/login`. API responde em `http://localhost:40000/health`.

## Consultar banco pelo Terminal

Conecte ao banco do sistema:

```bash
psql -h 127.0.0.1 -p 5432 -U dw3_financeiro -d dw3_financeiro
```

Digite a senha configurada em `DB_PASSWORD` no `.env`. No prompt do PostgreSQL, confira tabelas e dados:

```sql
\dt
SELECT id, codigo, descricao, tipo FROM plano_contas WHERE removido = false;
SELECT id, descricao, fornecedor, valor FROM contas_pagar WHERE removido = false;
```

Saia do PostgreSQL com `\q`.

No macOS, use `brew services` para PostgreSQL. Os comandos `npm run db:start` e `npm run db:status` usam caminho de `pg_ctl.exe` do Windows.
