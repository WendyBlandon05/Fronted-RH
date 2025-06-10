//MANEJO DE LA ALERTA
function showAlert(message, type = "success", duration = 3000) {
  const alertBox = document.getElementById("custom-alert");
  const alertMessage = document.getElementById("alert-message");

  // Limpiar clases anteriores
  alertBox.className = "alert-hidden";
  alertBox.classList.add(`alert-${type}`, "alert-show");

  alertMessage.textContent = message;

  // Ocultar después del tiempo
  setTimeout(() => {
    alertBox.classList.remove("alert-show");
  }, duration);
}

//MANEJO DE LA API
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('usuario').value.trim();
    const password = document.getElementById('contrasena').value;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.access) {
        // Guardar los tokens en localStorage
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        // Redirigir al usuario a la siguiente vista del sistema
        window.location.href = '/HTML/index.html'; 
       alert("Bienvenido al Sistema de Administraciòn de RH");
      } else {
        alert("Bienvenido al Sistema de Administraciòn de RH");
      }

    } catch (error) {
      console.error('Error en el login:', error);
      alert('Error al conectar con el servidor.');
    }
  });
});
