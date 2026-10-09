const mdlContasPagar = require("../model/mdlContasPagar");
const { validarId, validarContaPagar } = require("../../../utils/validacao");

const GetAllContasPagar = async (req, res, next) => {
   try {
      const registro = await mdlContasPagar.GetAllContasPagar();
      res.json({ status: "ok", registro });
   } catch (error) { next(error); }
};

const GetContaPagarByID = async (req, res, next) => {
   try {
      const id = validarId(req.params.id);
      if (!id) return res.status(400).json({ status: "erro", message: "ID inválido." });
      const registro = await mdlContasPagar.GetContaPagarByID(id);
      if (!registro.length) return res.status(404).json({ status: "erro", message: "Conta a pagar não encontrada." });
      res.json({ status: "ok", registro: registro[0] });
   } catch (error) { next(error); }
};

const InsertContaPagar = async (req, res, next) => {
   try {
      const erros = validarContaPagar(req.body || {});
      if (erros.length) return res.status(400).json({ status: "erro", erros });
      const linhasAfetadas = await mdlContasPagar.InsertContaPagar(req.body);
      res.status(201).json({ status: "ok", linhasAfetadas });
   } catch (error) { next(error); }
};

const UpdateContaPagar = async (req, res, next) => {
   try {
      const id = validarId(req.params.id);
      if (!id) return res.status(400).json({ status: "erro", message: "ID inválido." });
      const erros = validarContaPagar(req.body || {});
      if (erros.length) return res.status(400).json({ status: "erro", erros });
      const linhasAfetadas = await mdlContasPagar.UpdateContaPagar(id, req.body);
      if (!linhasAfetadas) return res.status(404).json({ status: "erro", message: "Conta a pagar não encontrada." });
      res.json({ status: "ok", linhasAfetadas });
   } catch (error) { next(error); }
};

const DeleteContaPagar = async (req, res, next) => {
   try {
      const id = validarId(req.params.id);
      if (!id) return res.status(400).json({ status: "erro", message: "ID inválido." });
      const linhasAfetadas = await mdlContasPagar.DeleteContaPagar(id);
      if (!linhasAfetadas) return res.status(404).json({ status: "erro", message: "Conta a pagar não encontrada." });
      res.json({ status: "ok", linhasAfetadas });
   } catch (error) { next(error); }
};

module.exports = { GetAllContasPagar, GetContaPagarByID, InsertContaPagar, UpdateContaPagar, DeleteContaPagar };
