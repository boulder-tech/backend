const express = require('express');
const app = express();
const port = 3000;

// Ruta de ejemplo
app.get('/', (req, res) => {
  res.send('¡Hola! Este es un servidor Express básico.');
});

// Iniciar el servidor en el puerto especificado
app.listen(port, () => {
  console.log(`El servidor está corriendo en http://localhost:${port}`);
}); 