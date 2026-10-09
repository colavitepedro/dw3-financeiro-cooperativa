document.addEventListener("DOMContentLoaded", () => {
   const username = localStorage.getItem("username");
   const nameLabel = document.getElementById("currentUsername");
   if (nameLabel && username) nameLabel.textContent = username;

   document.querySelectorAll(".app-shell").forEach(() => {
      if (!localStorage.getItem("token")) window.location.replace("/login");
   });

   const logoutButton = document.getElementById("logoutButton");
   if (logoutButton) {
      logoutButton.addEventListener("click", () => {
         localStorage.removeItem("token");
         localStorage.removeItem("username");
         window.location.href = "/login";
      });
   }
});
