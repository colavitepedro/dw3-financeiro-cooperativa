const apiUrl = document.querySelector("[data-api-url]").dataset.apiUrl.replace(/\/$/, "");

async function requestAPI(path, options = {}) {
   const token = localStorage.getItem("token");
   const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
   if (token) headers.Authorization = `Bearer ${token}`;

   let response;
   try {
      response = await fetch(`${apiUrl}${path}`, { ...options, headers });
   } catch {
      throw new Error("Não foi possível conectar à API financeira. Confira se o servidor está em execução e tente novamente.");
   }
   const data = await response.json().catch(() => ({}));
   if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      window.location.href = "/login";
      throw new Error("Sua sessão expirou. Entre novamente para continuar.");
   }
   if (!response.ok) {
      throw new Error(data.message || (data.erros && data.erros.join(" ")) || "A operação não foi concluída. Confira os dados e tente novamente.");
   }
   return data;
}

const planoContasAPI = {
   GetAllPlanoContas: () => requestAPI("/getAllPlanoContas").then((data) => data.registro),
   GetPlanoContasByID: (id) => requestAPI(`/getPlanoContasByID/${encodeURIComponent(id)}`).then((data) => data.registro),
   InsertPlanoContas: (registro) => requestAPI("/insertPlanoContas", { method: "POST", body: JSON.stringify(registro) }),
   UpdatePlanoContas: (id, registro) => requestAPI(`/updatePlanoContas/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(registro) }),
   DeletePlanoContas: (id) => requestAPI(`/deletePlanoContas/${encodeURIComponent(id)}`, { method: "DELETE" }),
};

const contasPagarAPI = {
   GetAllContasPagar: () => requestAPI("/getAllContasPagar").then((data) => data.registro),
   GetContaPagarByID: (id) => requestAPI(`/getContaPagarByID/${encodeURIComponent(id)}`).then((data) => data.registro),
   InsertContaPagar: (registro) => requestAPI("/insertContaPagar", { method: "POST", body: JSON.stringify(registro) }),
   UpdateContaPagar: (id, registro) => requestAPI(`/updateContaPagar/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(registro) }),
   DeleteContaPagar: (id) => requestAPI(`/deleteContaPagar/${encodeURIComponent(id)}`, { method: "DELETE" }),
};

function escapeHTML(valor) {
   return String(valor ?? "").replace(/[&<>"']/g, (caractere) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
   })[caractere]);
}

function formatarMoeda(valor) {
   return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(valor));
}

function formatarData(valor) {
   const [ano, mes, dia] = String(valor).slice(0, 10).split("-");
   return `${dia}/${mes}/${ano}`;
}

window.planoContasAPI = planoContasAPI;
window.contasPagarAPI = contasPagarAPI;
window.escapeHTML = escapeHTML;
window.formatarMoeda = formatarMoeda;
window.formatarData = formatarData;
