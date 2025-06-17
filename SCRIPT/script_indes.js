
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('access_token');

  if (!token) {
    window.location.href = '/HTML/login.html';  
  }

  try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/HTML/login.html';
    }
  } catch (e) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/HTML/login.html';
  }
});
