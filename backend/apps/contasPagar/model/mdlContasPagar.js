const db = require("../../../database/databaseconfig");

const GetAllContasPagar = async () => {
   const resultado = await db.query(
      "SELECT cp.id, cp.descricao, cp.fornecedor, cp.valor, " +
         "TO_CHAR(cp.data_vencimento, 'YYYY-MM-DD') AS data_vencimento, " +
         "cp.plano_contas_id, pc.codigo AS plano_codigo, pc.descricao AS plano_descricao, cp.removido " +
         "FROM contas_pagar cp INNER JOIN plano_contas pc ON pc.id = cp.plano_contas_id " +
         "WHERE cp.removido = FALSE ORDER BY cp.data_vencimento, cp.id"
   );
   return resultado.rows;
};

const GetContaPagarByID = async (id) => {
   const resultado = await db.query(
      "SELECT cp.id, cp.descricao, cp.fornecedor, cp.valor, " +
         "TO_CHAR(cp.data_vencimento, 'YYYY-MM-DD') AS data_vencimento, " +
         "cp.plano_contas_id, pc.codigo AS plano_codigo, pc.descricao AS plano_descricao, cp.removido " +
         "FROM contas_pagar cp INNER JOIN plano_contas pc ON pc.id = cp.plano_contas_id " +
         "WHERE cp.id = $1 AND cp.removido = FALSE",
      [id]
   );
   return resultado.rows;
};

const InsertContaPagar = async (registro) => {
   const resultado = await db.query(
      "INSERT INTO contas_pagar (descricao, fornecedor, valor, data_vencimento, plano_contas_id) " +
         "VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [registro.descricao.trim(), registro.fornecedor.trim(), registro.valor,
         registro.data_vencimento, registro.plano_contas_id]
   );
   return resultado.rowCount;
};

const UpdateContaPagar = async (id, registro) => {
   const resultado = await db.query(
      "UPDATE contas_pagar SET descricao = $2, fornecedor = $3, valor = $4, " +
         "data_vencimento = $5, plano_contas_id = $6 " +
         "WHERE id = $1 AND removido = FALSE",
      [id, registro.descricao.trim(), registro.fornecedor.trim(), registro.valor,
         registro.data_vencimento, registro.plano_contas_id]
   );
   return resultado.rowCount;
};

const DeleteContaPagar = async (id) => {
   const resultado = await db.query(
      "UPDATE contas_pagar SET removido = TRUE WHERE id = $1 AND removido = FALSE",
      [id]
   );
   return resultado.rowCount;
};

module.exports = { GetAllContasPagar, GetContaPagarByID, InsertContaPagar, UpdateContaPagar, DeleteContaPagar };
