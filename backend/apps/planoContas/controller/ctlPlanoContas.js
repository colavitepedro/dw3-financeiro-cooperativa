const mdlPlanoContas = require("../model/mdlPlanoContas");
const { validarId, validarPlanoContas } = require("../../../utils/validacao");

const GetAllPlanoContas = async (req, res, next) => {
   try {
      const registro = await mdlPlanoContas.GetAllPlanoContas();
      res.json({ status: "ok", registro });
   } catch (error) { next(error); }
};

const GetPlanoContasByID = async (req, res, next) => {
   try {
      const id = validarId(req.params.id);
      if (!id) return res.status(400).json({ status: "erro", message: "ID inválido." });
      const registro = await mdlPlanoContas.GetPlanoContasByID(id);
      if (!registro.length) return res.status(404).json({ status: "erro", message: "Plano de contas não encontrado." });
      res.json({ status: "ok", registro: registro[0] });
   } catch (error) { next(error); }
};

const InsertPlanoContas = async (req, res, next) => {
   try {
      const erros = validarPlanoContas(req.body || {});
      if (erros.length) return res.status(400).json({ status: "erro", erros });
      const linhasAfetadas = await mdlPlanoContas.InsertPlanoContas(req.body);
      res.status(201).json({ status: "ok", linhasAfetadas });
   } catch (error) { next(error); }
};

const UpdatePlanoContas = async (req, res, next) => {
   try {
      const id = validarId(req.params.id);
      if (!id) return res.status(400).json({ status: "erro", message: "ID inválido." });
      const erros = validarPlanoContas(req.body || {});
      if (erros.length) return res.status(400).json({ status: "erro", erros });
      const linhasAfetadas = await mdlPlanoContas.UpdatePlanoContas(id, req.body);
      if (!linhasAfetadas) return res.status(404).json({ status: "erro", message: "Plano de contas não encontrado." });
      res.json({ status: "ok", linhasAfetadas });
   } catch (error) { next(error); }
};

const DeletePlanoContas = async (req, res, next) => {
   try {
      const id = validarId(req.params.id);
      if (!id) return res.status(400).json({ status: "erro", message: "ID inválido." });
      const linhasAfetadas = await mdlPlanoContas.DeletePlanoContas(id);
      if (!linhasAfetadas) return res.status(404).json({ status: "erro", message: "Plano de contas não encontrado." });
      res.json({ status: "ok", linhasAfetadas });
   } catch (error) { next(error); }
};

module.exports = { GetAllPlanoContas, GetPlanoContasByID, InsertPlanoContas, UpdatePlanoContas, DeletePlanoContas };
