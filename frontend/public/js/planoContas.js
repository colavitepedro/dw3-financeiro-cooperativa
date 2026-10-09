document.addEventListener("DOMContentLoaded", () => {
   const rows = document.getElementById("recordRows");
   const count = document.getElementById("recordCount");
   const modal = document.getElementById("recordModal");
   const form = document.getElementById("recordForm");
   const formError = document.getElementById("formError");
   const pageMessage = document.getElementById("pageMessage");
   let registros = [];
   let editando = null;

   function mostrarMensagem(texto, tipo = "ok") {
      pageMessage.textContent = texto;
      pageMessage.className = `notice ${tipo === "erro" ? "notice-error" : "notice-success"}`;
      pageMessage.hidden = false;
   }

   function renderizar() {
      count.textContent = `${registros.length} ${registros.length === 1 ? "item" : "itens"}`;
      if (!registros.length) {
         rows.innerHTML = '<tr><td colspan="4" class="table-state">O plano de contas está vazio. Clique em “Nova categoria” para cadastrar a primeira.</td></tr>';
         return;
      }
      rows.innerHTML = registros.map((registro) => `
         <tr><td><span class="code-chip">${escapeHTML(registro.codigo)}</span></td>
         <td class="cell-strong">${escapeHTML(registro.descricao)}</td>
         <td><span class="type-tag ${registro.tipo === "Receita" ? "type-income" : "type-expense"}">${escapeHTML(registro.tipo)}</span></td>
         <td class="align-right"><button class="table-action" data-action="edit" data-id="${registro.id}">Editar</button><button class="table-action danger" data-action="delete" data-id="${registro.id}">Excluir</button></td></tr>
      `).join("");
   }

   async function GetAllPlanoContas() {
      rows.innerHTML = '<tr><td colspan="4" class="table-state">Buscando categorias do plano de contas…</td></tr>';
      registros = await planoContasAPI.GetAllPlanoContas();
      renderizar();
   }

   function abrirModal(registro = null) {
      editando = registro ? registro.id : null;
      form.reset();
      formError.hidden = true;
      document.getElementById("modalTitle").textContent = registro ? "Editar categoria" : "Nova categoria";
      if (registro) {
         form.elements.codigo.value = registro.codigo;
         form.elements.descricao.value = registro.descricao;
         form.elements.tipo.value = registro.tipo;
      }
      modal.hidden = false;
      form.elements.codigo.focus();
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
            const atual = await planoContasAPI.GetPlanoContasByID(registro.id);
            abrirModal(atual);
         } else if (window.confirm(`Excluir a categoria “${registro.descricao}”?`)) {
            await planoContasAPI.DeletePlanoContas(registro.id);
            mostrarMensagem("Categoria removida do plano de contas.");
            await GetAllPlanoContas();
         }
      } catch (error) { mostrarMensagem(error.message, "erro"); }
   });

   form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const botao = form.querySelector("button[type='submit']");
      const registro = Object.fromEntries(new FormData(form));
      botao.disabled = true;
      try {
         if (editando) await planoContasAPI.UpdatePlanoContas(editando, registro);
         else await planoContasAPI.InsertPlanoContas(registro);
         fecharModal();
         mostrarMensagem(editando ? "Categoria atualizada no plano de contas." : "Categoria adicionada ao plano de contas.");
         await GetAllPlanoContas();
      } catch (error) {
         formError.textContent = error.message;
         formError.hidden = false;
      } finally { botao.disabled = false; }
   });

   GetAllPlanoContas().catch((error) => mostrarMensagem(error.message, "erro"));
});
