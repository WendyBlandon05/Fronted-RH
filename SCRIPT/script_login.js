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
        window.location.href = '/HTML/index.html'; // cambia esta ruta según tu proyecto
      } else {
        alert('Usuario o contraseña incorrectos.');
      }

    } catch (error) {
      console.error('Error en el login:', error);
      alert('Error al conectar con el servidor.');
    }
  });
});
