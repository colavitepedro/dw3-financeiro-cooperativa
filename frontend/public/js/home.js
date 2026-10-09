document.addEventListener("DOMContentLoaded", async () => {
   const rows = document.getElementById("upcomingRows");
   const message = document.getElementById("pageMessage");
   try {
      const [contas, planos] = await Promise.all([
         contasPagarAPI.GetAllContasPagar(),
         planoContasAPI.GetAllPlanoContas(),
      ]);
      const proximas = window.filtrarVencimentosProximos(contas);

      document.getElementById("summaryTotal").textContent = contas.length;
      document.getElementById("summaryAmount").textContent = formatarMoeda(contas.reduce((soma, conta) => soma + Number(conta.valor), 0));
      document.getElementById("summaryDue").textContent = proximas.length;
      document.getElementById("summaryPlans").textContent = planos.length;

      if (!proximas.length) {
         rows.innerHTML = '<tr><td colspan="5" class="table-state">Nenhuma conta vence entre hoje e os próximos sete dias.</td></tr>';
         return;
      }
      rows.innerHTML = proximas.slice(0, 8).map((conta) => `
         <tr><td class="cell-strong">${escapeHTML(conta.descricao)}</td>
         <td>${escapeHTML(conta.fornecedor)}</td>
         <td><span class="tag">${escapeHTML(conta.plano_codigo)} · ${escapeHTML(conta.plano_descricao)}</span></td>
         <td>${formatarData(conta.data_vencimento)}</td>
         <td class="align-right cell-strong">${formatarMoeda(conta.valor)}</td></tr>
      `).join("");
   } catch (error) {
      rows.innerHTML = '<tr><td colspan="5" class="table-state">Não foi possível consultar os próximos vencimentos. Atualize a página e tente novamente.</td></tr>';
      message.textContent = error.message;
      message.className = "notice notice-error";
      message.hidden = false;
   }
});
