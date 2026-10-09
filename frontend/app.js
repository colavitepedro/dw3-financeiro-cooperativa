require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const express = require("express");
const nunjucks = require("nunjucks");
const path = require("path");
const routes = require("./routes/router");

const app = express();
const viewsPath = path.join(__dirname, "views");

app.disable("x-powered-by");
app.set("views", viewsPath);
app.set("view engine", "njk");
nunjucks.configure(viewsPath, { autoescape: true, express: app, noCache: app.get("env") === "development" });
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/", routes);
app.use((req, res) => res.status(404).render("error", { title: "Página não encontrada" }));

const port = Number(process.env.WEB_PORT || 40100);
app.listen(port, () => console.log(`Sistema disponível em http://localhost:${port}.`));

module.exports = app;
