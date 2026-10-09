const test = require("node:test");
const assert = require("node:assert/strict");
const { filtrarVencimentosProximos } = require("./vencimentos");

test("mantém vencimentos de hoje até sete dias e exclui atrasados e datas distantes", () => {
   const hoje = new Date(2026, 9, 9, 15, 30);
   const contas = [
      { id: 1, data_vencimento: "2026-10-08" },
      { id: 2, data_vencimento: "2026-10-09" },
      { id: 3, data_vencimento: "2026-10-16" },
      { id: 4, data_vencimento: "2026-10-17" },
   ];

   assert.deepEqual(filtrarVencimentosProximos(contas, hoje).map((conta) => conta.id), [2, 3]);
});
