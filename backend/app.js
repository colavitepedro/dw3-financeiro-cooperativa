require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const db = require("./database/databaseconfig");
const routerApp = require("./routes/router");

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
   throw new Error("JWT_SECRET precisa ter pelo menos 32 caracteres.");
}

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(express.json({ limit: "32kb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 200, standardHeaders: "draft-7", legacyHeaders: false }));
app.use((req, res, next) => {
   res.header("Access-Control-Allow-Origin", process.env.WEB_ORIGIN || "http://localhost:40100");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
   if (req.method === "OPTIONS") return res.sendStatus(204);
   next();
});
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/", routerApp);
app.use((error, req, res, next) => {
   if (res.headersSent) return next(error);
   if (error.code === "23505") return res.status(409).json({ status: "erro", message: "Esse código já está em uso no plano de contas. Informe outro código." });
   if (error.code === "23503") return res.status(400).json({ status: "erro", message: "A categoria selecionada não está disponível. Escolha outra categoria do plano de contas." });
   if (error.code === "23514" || error.code === "22P02") return res.status(400).json({ status: "erro", message: "Confira o tipo da categoria, a data de vencimento e o valor informado." });
   console.error(error.message);
   res.status(500).json({ status: "erro", message: "O sistema não conseguiu concluir a solicitação. Tente novamente; se o problema continuar, avise o responsável." });
});

const port = Number(process.env.API_PORT || 40000);
const server = app.listen(port, () => console.log(`API disponível na porta ${port}.`));

async function encerrar() {
   server.close(async () => {
      await db.end();
      process.exit(0);
   });
}
process.on("SIGINT", encerrar);
process.on("SIGTERM", encerrar);

module.exports = app;
