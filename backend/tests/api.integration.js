require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const test = require("node:test");
const assert = require("node:assert/strict");

const apiUrl = process.env.API_URL || "http://localhost:40000";
const username = process.env.ADMIN_USERNAME;
const password = process.env.ADMIN_PASSWORD;

async function requisicao(caminho, token, metodo = "GET", registro) {
   const headers = { "Content-Type": "application/json" };
   if (token) headers.Authorization = `Bearer ${token}`;

   const response = await fetch(`${apiUrl}${caminho}`, {
      method: metodo,
      headers,
      body: registro ? JSON.stringify(registro) : undefined,
   });
   const dados = await response.json();
   return { status: response.status, dados };
}

test("API exige token para as rotas de cadastro", async () => {
   const resposta = await requisicao("/getAllPlanoContas");
   assert.equal(resposta.status, 401);
});

test("CRUD de plano de contas e contas a pagar", async (context) => {
   assert.ok(username && password, "Configure ADMIN_USERNAME e ADMIN_PASSWORD no .env.");
   const login = await requisicao("/Login", null, "POST", { username, password });
   assert.equal(login.status, 200, "Login deve retornar sucesso.");
   assert.ok(login.dados.token, "A API deve emitir um JWT.");
   const token = login.dados.token;
   const sufixo = Date.now().toString();
   let planoId;
   let contaId;

   try {
      const insercaoPlano = await requisicao("/insertPlanoContas", token, "POST", {
         codigo: `T${sufixo}`,
         descricao: "Categoria de teste",
         tipo: "Despesa",
      });
      assert.equal(insercaoPlano.status, 201);

      const planos = await requisicao("/getAllPlanoContas", token);
      const plano = planos.dados.registro.find((item) => item.codigo === `T${sufixo}`);
      assert.ok(plano, "O novo plano deve aparecer na listagem.");
      planoId = plano.id;

      const planoPorId = await requisicao(`/getPlanoContasByID/${planoId}`, token);
      assert.equal(planoPorId.status, 200);
      assert.equal(planoPorId.dados.registro.descricao, "Categoria de teste");

      const atualizacaoPlano = await requisicao(`/updatePlanoContas/${planoId}`, token, "PUT", {
         codigo: `T${sufixo}`,
         descricao: "Categoria atualizada",
         tipo: "Despesa",
      });
      assert.equal(atualizacaoPlano.status, 200);

      const vencimento = new Date().toISOString().slice(0, 10);
      const insercaoConta = await requisicao("/insertContaPagar", token, "POST", {
         descricao: `Conta de teste ${sufixo}`,
         fornecedor: "Fornecedor de teste",
         valor: 123.45,
         data_vencimento: vencimento,
         plano_contas_id: planoId,
      });
      assert.equal(insercaoConta.status, 201);

      const contas = await requisicao("/getAllContasPagar", token);
      const conta = contas.dados.registro.find((item) => item.descricao === `Conta de teste ${sufixo}`);
      assert.ok(conta, "A nova conta deve aparecer na listagem.");
      contaId = conta.id;

      const contaPorId = await requisicao(`/getContaPagarByID/${contaId}`, token);
      assert.equal(contaPorId.status, 200);
      assert.equal(contaPorId.dados.registro.fornecedor, "Fornecedor de teste");

      const atualizacaoConta = await requisicao(`/updateContaPagar/${contaId}`, token, "PUT", {
         descricao: `Conta atualizada ${sufixo}`,
         fornecedor: "Fornecedor de teste",
         valor: 129.99,
         data_vencimento: vencimento,
         plano_contas_id: planoId,
      });
      assert.equal(atualizacaoConta.status, 200);

      const remocaoConta = await requisicao(`/deleteContaPagar/${contaId}`, token, "DELETE");
      assert.equal(remocaoConta.status, 200);
      const contaRemovida = await requisicao(`/getContaPagarByID/${contaId}`, token);
      assert.equal(contaRemovida.status, 404, "A exclusão deve ser lógica e ocultar a conta.");

      const remocaoPlano = await requisicao(`/deletePlanoContas/${planoId}`, token, "DELETE");
      assert.equal(remocaoPlano.status, 200);
      const planoRemovido = await requisicao(`/getPlanoContasByID/${planoId}`, token);
      assert.equal(planoRemovido.status, 404, "A exclusão deve ocultar o plano.");
   } finally {
      if (contaId) await requisicao(`/deleteContaPagar/${contaId}`, token, "DELETE").catch(() => {});
      if (planoId) await requisicao(`/deletePlanoContas/${planoId}`, token, "DELETE").catch(() => {});
   }
});
