document.addEventListener("DOMContentLoaded", () => {
   const form = document.getElementById("loginForm");
   const errorBox = document.getElementById("loginError");
   if (!form) return;

   if (localStorage.getItem("token")) window.location.replace("/home");

   form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = form.querySelector("button[type='submit']");
      errorBox.hidden = true;
      button.disabled = true;
      button.textContent = "Acessando…";

      try {
         const apiUrl = form.closest("[data-api-url]").dataset.apiUrl.replace(/\/$/, "");
         const response = await fetch(`${apiUrl}/Login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               username: form.elements.username.value.trim(),
               password: form.elements.password.value,
            }),
         });
         const data = await response.json();
         if (!response.ok || !data.token) throw new Error(data.message || "Usuário ou senha inválidos.");
         localStorage.setItem("token", data.token);
         localStorage.setItem("username", data.username);
         window.location.href = "/home";
      } catch (error) {
         errorBox.textContent = error instanceof TypeError
            ? "Não foi possível conectar à API. Confira se o servidor está em execução e tente novamente."
            : error.message || "Não foi possível validar o acesso. Confira os dados e tente novamente.";
         errorBox.hidden = false;
      } finally {
         button.disabled = false;
         button.textContent = "Acessar";
      }
   });
});
