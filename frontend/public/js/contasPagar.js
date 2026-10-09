document.addEventListener("DOMContentLoaded", () => {
   const rows = document.getElementById("recordRows");
   const count = document.getElementById("recordCount");
   const modal = document.getElementById("recordModal");
   const form = document.getElementById("recordForm");
   const formError = document.getElementById("formError");
   const pageMessage = document.getElementById("pageMessage");
   const categoria = form.elements.plano_contas_id;
   let registros = [];
   let planos = [];
   let editando = null;

   function mostrarMensagem(texto, tipo = "ok") {
      pageMessage.textContent = texto;
      pageMessage.className = `notice ${tipo === "erro" ? "notice-error" : "notice-success"}`;
      pageMessage.hidden = false;
   }

   function renderizar() {
      count.textContent = `${registros.length} ${registros.length === 1 ? "item" : "itens"}`;
      if (!registros.length) {
         rows.innerHTML = '<tr><td colspan="6" class="table-state">Ainda não há contas a pagar. Clique em “Nova conta” para lançar a primeira.</td></tr>';
         return;
      }
      rows.innerHTML = registros.map((registro) => `
         <tr><td class="cell-strong">${escapeHTML(registro.descricao)}</td><td>${escapeHTML(registro.fornecedor)}</td>
         <td><span class="tag">${escapeHTML(registro.plano_codigo)} · ${escapeHTML(registro.plano_descricao)}</span></td>
         <td>${formatarData(registro.data_vencimento)}</td><td class="align-right cell-strong">${formatarMoeda(registro.valor)}</td>
         <td class="align-right"><button class="table-action" data-action="edit" data-id="${registro.id}">Editar</button><button class="table-action danger" data-action="delete" data-id="${registro.id}">Excluir</button></td></tr>
      `).join("");
   }

   async function GetAllContasPagar() {
      rows.innerHTML = '<tr><td colspan="6" class="table-state">Buscando contas a pagar e categorias…</td></tr>';
      [registros, planos] = await Promise.all([contasPagarAPI.GetAllContasPagar(), planoContasAPI.GetAllPlanoContas()]);
      renderizar();
   }

   function carregarCategorias(selecionado = "") {
      categoria.innerHTML = '<option value="">Selecione uma categoria</option>' + planos.map((plano) =>
         `<option value="${plano.id}" ${Number(selecionado) === plano.id ? "selected" : ""}>${escapeHTML(plano.codigo)} · ${escapeHTML(plano.descricao)}</option>`
      ).join("");
   }

   function abrirModal(registro = null) {
      editando = registro ? registro.id : null;
      form.reset();
      formError.hidden = true;
      document.getElementById("modalTitle").textContent = registro ? "Editar conta" : "Nova conta";
      carregarCategorias(registro ? registro.plano_contas_id : "");
      if (registro) {
         form.elements.descricao.value = registro.descricao;
         form.elements.fornecedor.value = registro.fornecedor;
         form.elements.valor.value = registro.valor;
         form.elements.data_vencimento.value = registro.data_vencimento;
      }
      modal.hidden = false;
      form.elements.descricao.focus();
   }

   function fecharModal() { modal.hidden = true; }
   document.getElementById("newRecord").addEventListener("click", () => abrirModal());
   modal.querySelectorAll("[data-close-modal]").forEach((elemento) => elemento.addEventListener("click", fecharModal));
   document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !modal.hidden) fecharModal(); });

   rows.addEventListener("click", async (event) => {
      const botao = event.target.closest("button[data-action]");
      if (!botao) return;
      const registro = registros.find((item) => item.id === Number(botao.dataset.id));
      if (!registro) return;
      try {
         if (botao.dataset.action === "edit") {
            const atual = await contasPagarAPI.GetContaPagarByID(registro.id);
            abrirModal(atual);
         } else if (window.confirm(`Excluir a conta “${registro.descricao}”?`)) {
            await contasPagarAPI.DeleteContaPagar(registro.id);
            mostrarMensagem("Conta a pagar removida.");
            await GetAllContasPagar();
         }
      } catch (error) { mostrarMensagem(error.message, "erro"); }
   });

   form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const botao = form.querySelector("button[type='submit']");
      const dados = Object.fromEntries(new FormData(form));
      dados.valor = Number(dados.valor);
      dados.plano_contas_id = Number(dados.plano_contas_id);
      botao.disabled = true;
      try {
         if (editando) await contasPagarAPI.UpdateContaPagar(editando, dados);
         else await contasPagarAPI.InsertContaPagar(dados);
         fecharModal();
         mostrarMensagem(editando ? "Conta a pagar atualizada." : "Conta a pagar cadastrada.");
         await GetAllContasPagar();
      } catch (error) {
         formError.textContent = error.message;
         formError.hidden = false;
      } finally { botao.disabled = false; }
   });

   GetAllContasPagar().catch((error) => mostrarMensagem(error.message, "erro"));
});
