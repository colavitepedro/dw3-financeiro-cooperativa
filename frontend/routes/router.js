const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.redirect("/login"));
router.get("/login", (req, res) => res.render("login", { apiUrl: process.env.API_URL }));
router.get("/home", (req, res) => res.render("home", { title: "Visão geral", active: "home", apiUrl: process.env.API_URL }));
router.get("/plano-contas", (req, res) => res.render("planoContas", { title: "Plano de contas", active: "plano", apiUrl: process.env.API_URL }));
router.get("/contas-pagar", (req, res) => res.render("contasPagar", { title: "Contas a pagar", active: "contas", apiUrl: process.env.API_URL }));
router.post("/Logout", (req, res) => res.redirect("/login"));

module.exports = router;
