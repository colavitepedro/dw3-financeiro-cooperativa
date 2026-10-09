function filtrarVencimentosProximos(contas, hoje = new Date()) {
   const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
   const limite = new Date(inicio);
   limite.setDate(limite.getDate() + 7);

   return contas.filter((conta) => {
      const [ano, mes, dia] = conta.data_vencimento.slice(0, 10).split("-").map(Number);
      const vencimento = new Date(ano, mes - 1, dia);
      return vencimento >= inicio && vencimento <= limite;
   });
}

if (typeof module !== "undefined" && module.exports) {
   module.exports = { filtrarVencimentosProximos };
}
if (typeof window !== "undefined") {
   window.filtrarVencimentosProximos = filtrarVencimentosProximos;
}
