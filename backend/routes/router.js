const express = require("express");
const routerApp = express.Router();
const { Login } = require("../apps/login/controller/ctlLogin");
const AutenticaJWT = require("../middleware/autenticaJWT");
const plano = require("../apps/planoContas/controller/ctlPlanoContas");
const contas = require("../apps/contasPagar/controller/ctlContasPagar");

routerApp.post("/Login", Login);
routerApp.use(AutenticaJWT);

routerApp.get("/getAllPlanoContas", plano.GetAllPlanoContas);
routerApp.get("/getPlanoContasByID/:id", plano.GetPlanoContasByID);
routerApp.post("/insertPlanoContas", plano.InsertPlanoContas);
routerApp.put("/updatePlanoContas/:id", plano.UpdatePlanoContas);
routerApp.delete("/deletePlanoContas/:id", plano.DeletePlanoContas);

routerApp.get("/getAllContasPagar", contas.GetAllContasPagar);
routerApp.get("/getContaPagarByID/:id", contas.GetContaPagarByID);
routerApp.post("/insertContaPagar", contas.InsertContaPagar);
routerApp.put("/updateContaPagar/:id", contas.UpdateContaPagar);
routerApp.delete("/deleteContaPagar/:id", contas.DeleteContaPagar);

module.exports = routerApp;
