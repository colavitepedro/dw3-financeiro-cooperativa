const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const action = process.argv[2];
const localData = process.env.LOCALAPPDATA || process.env.HOME;
const dataDir = path.join(localData, 'DW3_Trab01', 'postgres-data');
const logPath = path.join(localData, 'DW3_Trab01', 'postgres.log');
const binDir = process.env.POSTGRES_BIN || 'C:/Program Files/PostgreSQL/17/bin';
const pgCtl = path.join(binDir, 'pg_ctl.exe');

if (!['start', 'stop', 'status'].includes(action)) {
  console.error('Uso: npm run db:start | db:stop | db:status');
  process.exit(2);
}
if (!fs.existsSync(pgCtl)) {
  console.error(`pg_ctl não encontrado em ${pgCtl}. Ajuste POSTGRES_BIN para a pasta bin do PostgreSQL 17.`);
  process.exit(1);
}
if (!fs.existsSync(path.join(dataDir, 'PG_VERSION'))) {
  console.error(`Cluster local não encontrado em ${dataDir}. Configure seu PostgreSQL e as variáveis DB_* do .env conforme o README.`);
  process.exit(1);
}

const args = ['-D', dataDir];
const currentStatus = spawnSync(pgCtl, ['-D', dataDir, 'status'], {
  encoding: 'utf8',
  timeout: 10000,
});
if (currentStatus.error) {
  console.error(`Não foi possível consultar pg_ctl: ${currentStatus.error.message}`);
  process.exit(1);
}
if (action === 'status') {
  if (currentStatus.stdout) process.stdout.write(currentStatus.stdout);
  if (currentStatus.stderr) process.stderr.write(currentStatus.stderr);
  process.exit(currentStatus.status ?? 1);
}

if (action === 'start' && currentStatus.status === 0) {
  console.log('PostgreSQL local já está em execução.');
  process.exit(0);
}
if (action === 'stop' && currentStatus.status !== 0) {
  console.log('PostgreSQL local já está parado.');
  process.exit(0);
}

if (action === 'start') {
  args.push('-l', logPath, '-o', '-h 127.0.0.1 -p 55432', '-w', 'start');
} else if (action === 'stop') {
  args.push('-m', 'fast', '-w', 'stop');
} else {
  args.push('status');
}

const result = spawnSync(pgCtl, args, { stdio: 'inherit' });
if (result.error) {
  console.error(`Não foi possível executar pg_ctl: ${result.error.message}`);
  process.exit(1);
}
process.exit(result.status ?? 1);
