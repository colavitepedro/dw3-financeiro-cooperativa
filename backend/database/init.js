require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const fs = require("fs");
const path = require("path");
const db = require("./databaseconfig");

async function initializeDatabase() {
   const schemaPath = path.join(__dirname, "databaseConfig.sql");
   const schema = fs.readFileSync(schemaPath, "utf8");
   await db.query(schema);
   console.log("Tabelas e categorias iniciais preparadas.");
}

initializeDatabase()
   .catch((error) => {
      console.error(`Não foi possível preparar o banco: ${error.message}`);
      process.exitCode = 1;
   })
   .finally(() => db.end());
