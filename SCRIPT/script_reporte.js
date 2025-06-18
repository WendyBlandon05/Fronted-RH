document.getElementById('btn-generar-reporte').addEventListener('click', async () => {
  const genero = document.getElementById('genero-select').value;
  const loader = document.getElementById('report-loader');
  const preview = document.getElementById('preview-container');
  const iframe = document.getElementById('pdf-viewer');
  const downloadLink = document.getElementById('download-link');

  if (!genero) {
    alert('Por favor selecciona un género.');
    return;
  }

  //show loader y ocultar vista previa
  loader.style.display = 'block';
  preview.style.display = 'none';

  try {
    const token = localStorage.getItem('access_token');

    const response = await fetch('http://127.0.0.1:8000/adminrh/empleado/reporte-pdf/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ sexo: genero })
    });

    if (!response.ok) {
      loader.style.display = 'none';
      const errorBlob = await response.blob();
      const reader = new FileReader();
      reader.onload = () => alert("Error: " + reader.result);
      reader.readAsText(errorBlob);
      return;
    }

    const blob = await response.blob();
    const pdfUrl = URL.createObjectURL(blob);

    // show pdf y habilitar descarga
    iframe.src = pdfUrl;
    downloadLink.href = pdfUrl;

    preview.style.display = 'block';

  } catch (error) {
    alert("Error al generar el reporte: " + error.message);
  } finally {
    loader.style.display = 'none';
  }
});
