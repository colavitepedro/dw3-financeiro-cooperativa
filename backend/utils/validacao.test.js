const test = require("node:test");
const assert = require("node:assert/strict");
const { validarId, validarPlanoContas, validarContaPagar } = require("./validacao");

test("aceita somente identificadores inteiros positivos", () => {
   assert.equal(validarId("12"), 12);
   assert.equal(validarId("0"), null);
   assert.equal(validarId("1.5"), null);
});

test("valida campos obrigatórios e tipo do plano de contas", () => {
   assert.deepEqual(validarPlanoContas({ codigo: "3.1", descricao: "Energia", tipo: "Despesa" }), []);
   assert.equal(validarPlanoContas({ codigo: "", descricao: "", tipo: "Outro" }).length, 3);
});

test("valida valor, data e vínculo da conta a pagar", () => {
   const conta = {
      descricao: "Conta de energia", fornecedor: "Cooperativa elétrica",
      valor: "245.90", data_vencimento: "2026-10-20", plano_contas_id: "1"
   };

   assert.deepEqual(validarContaPagar(conta), []);
   assert.equal(validarContaPagar({ ...conta, valor: "-1", data_vencimento: "2026-02-31" }).length, 2);
});

test("rejeita datas de vencimento que não sejam texto no formato ISO", () => {
   const conta = {
      descricao: "Conta de energia", fornecedor: "Cooperativa elétrica",
      valor: 245.90, data_vencimento: 2026, plano_contas_id: 1
   };

   assert.ok(validarContaPagar(conta).includes("Informe uma data de vencimento válida."));
});
