const form = document.getElementById("auth-form");
const title = document.getElementById("form-title");
const toggleText = document.getElementById("toggle-text");
const responseMsg = document.getElementById("response-msg");
const submitBtn = document.getElementById("submit-btn");

let isLogin = true;

//  Alternar entre login y registro
function updateForm() {
  if (isLogin) {
    title.textContent = "Inicia sesión";
    submitBtn.textContent = "Entrar";
    toggleText.innerHTML =
      '¿No tienes cuenta? <a href="#" id="toggle-link">Regístrate aquí</a>';
  } else {
    title.textContent = "Regístrate";
    submitBtn.textContent = "Crear cuenta";
    toggleText.innerHTML =
      '¿Ya tienes cuenta? <a href="#" id="toggle-link">Inicia sesión</a>';
  }

  document.getElementById("toggle-link").addEventListener("click", (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    updateForm();
  });
}

updateForm();

// Manejo del formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    responseMsg.textContent = "Por favor completa todos los campos ❗";
    return;
  }

  const endpoint = isLogin
    ? "http://localhost:5000/api/auth/login"
    : "http://localhost:5000/api/auth/register";

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    //  Mostrar respuesta
    responseMsg.textContent = data.message || "Operación exitosa ";

    //  Solo si es login exitoso
    if (isLogin && res.ok && data.token) {
      // Guardar token correctamente
      localStorage.setItem("token", data.token);

      // Confirmar que se guardó antes de redirigir
      setTimeout(() => {
        const checkToken = localStorage.getItem("token");
        if (checkToken) {
         window.location.href = "add-task.html";
        } else {
          responseMsg.textContent = "No se pudo guardar la sesión. Intenta de nuevo ";
        }
      }, 1200);
    }
  } catch (err) {
    console.error(err);
    responseMsg.textContent = "Error al conectar con el servidor ";
  }
});
