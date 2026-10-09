require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const bcrypt = require("bcryptjs");
const db = require("./databaseconfig");

async function seedAdmin() {
   const username = process.env.ADMIN_USERNAME;
   const password = process.env.ADMIN_PASSWORD;

   if (!username || !password || password.length < 8) {
      throw new Error("Defina ADMIN_USERNAME e ADMIN_PASSWORD (mínimo 8 caracteres) no .env.");
   }

   const hash = await bcrypt.hash(password, 12);
   await db.query(
      "INSERT INTO usuarios (username, password) VALUES ($1, $2) " +
         "ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, removido = FALSE",
      [username, hash]
   );

   console.log(`Usuário ${username} preparado para acesso.`);
}

seedAdmin()
   .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
   })
   .finally(() => db.end());
