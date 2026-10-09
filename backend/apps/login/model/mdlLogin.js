const db = require("../../../database/databaseconfig");

const GetCredencial = async (username) => {
   const resultado = await db.query(
      "SELECT id, username, password FROM usuarios WHERE username = $1 AND removido = FALSE",
      [username]
   );
   return resultado.rows;
};

module.exports = { GetCredencial };
