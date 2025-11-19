const form = document.getElementById("register-form");
const responseMsg = document.getElementById("response-msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    responseMsg.textContent = data.message || "Registro exitoso ";

    // Redirigir al login después de 2 segundos
    if (res.ok) {
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    }
  } catch (error) {
    responseMsg.textContent = "Error al conectar con el servidor ";
  }
});
