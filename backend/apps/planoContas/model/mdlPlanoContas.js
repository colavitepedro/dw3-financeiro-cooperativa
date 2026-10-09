const db = require("../../../database/databaseconfig");

const GetAllPlanoContas = async () => {
   const resultado = await db.query(
      "SELECT id, codigo, descricao, tipo, removido FROM plano_contas " +
         "WHERE removido = FALSE ORDER BY codigo"
   );
   return resultado.rows;
};

const GetPlanoContasByID = async (id) => {
   const resultado = await db.query(
      "SELECT id, codigo, descricao, tipo, removido FROM plano_contas " +
         "WHERE id = $1 AND removido = FALSE",
      [id]
   );
   return resultado.rows;
};

const InsertPlanoContas = async (registro) => {
   const resultado = await db.query(
      "INSERT INTO plano_contas (codigo, descricao, tipo) VALUES ($1, $2, $3) RETURNING id",
      [registro.codigo.trim(), registro.descricao.trim(), registro.tipo]
   );
   return resultado.rowCount;
};

const UpdatePlanoContas = async (id, registro) => {
   const resultado = await db.query(
      "UPDATE plano_contas SET codigo = $2, descricao = $3, tipo = $4 " +
         "WHERE id = $1 AND removido = FALSE",
      [id, registro.codigo.trim(), registro.descricao.trim(), registro.tipo]
   );
   return resultado.rowCount;
};

const DeletePlanoContas = async (id) => {
   const resultado = await db.query(
      "UPDATE plano_contas SET removido = TRUE WHERE id = $1 AND removido = FALSE",
      [id]
   );
   return resultado.rowCount;
};

module.exports = {
   GetAllPlanoContas,
   GetPlanoContasByID,
   InsertPlanoContas,
   UpdatePlanoContas,
   DeletePlanoContas,
};
