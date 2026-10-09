function textoObrigatorio(valor, campo, limite) {
   if (typeof valor !== "string" || !valor.trim()) {
      return `${campo} é obrigatório.`;
   }

   if (valor.trim().length > limite) {
      return `${campo} deve ter no máximo ${limite} caracteres.`;
   }

   return null;
}

function validarId(valor) {
   const id = Number(valor);
   return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function validarPlanoContas(dados) {
   const erros = [];
   const codigoErro = textoObrigatorio(dados.codigo, "Código", 20);
   const descricaoErro = textoObrigatorio(dados.descricao, "Descrição", 120);

   if (codigoErro) erros.push(codigoErro);
   if (descricaoErro) erros.push(descricaoErro);
   if (!["Receita", "Despesa"].includes(dados.tipo)) {
      erros.push("Tipo deve ser Receita ou Despesa.");
   }

   return erros;
}

function validarContaPagar(dados) {
   const erros = [];
   const descricaoErro = textoObrigatorio(dados.descricao, "Descrição", 160);
   const fornecedorErro = textoObrigatorio(dados.fornecedor, "Fornecedor", 120);
   const valor = Number(dados.valor);
   const planoId = validarId(dados.plano_contas_id);

   if (descricaoErro) erros.push(descricaoErro);
   if (fornecedorErro) erros.push(fornecedorErro);
   if (!Number.isFinite(valor) || valor <= 0) erros.push("Valor deve ser maior que zero.");
   if (!planoId) erros.push("Selecione um plano de contas válido.");
   const dataVencimento = dados.data_vencimento;
   let dataValida = false;
   if (typeof dataVencimento === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dataVencimento)) {
      const [ano, mes, dia] = dataVencimento.split("-").map(Number);
      const data = new Date(Date.UTC(ano, mes - 1, dia));
      dataValida = data.getUTCFullYear() === ano &&
         data.getUTCMonth() === mes - 1 && data.getUTCDate() === dia;
   }
   if (!dataValida) {
      erros.push("Informe uma data de vencimento válida.");
   }

   return erros;
}

module.exports = { validarId, validarPlanoContas, validarContaPagar };
