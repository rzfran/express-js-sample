const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Configuración de Seguridad (CORS) ---
// Esto es MUY IMPORTANTE. Solo permite que tu aplicación de Cloudflare
// (u otra URL que especifiques) pueda hacer peticiones a esta API.
// Si no sabes la URL final de tu app, puedes usar '*' temporalmente, pero es menos seguro.
const whitelist = ['https://ia-winners-hub.pages.dev']; // <-- CAMBIA ESTO por la URL de tu app en Cloudflare
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use(cors(corsOptions));

// --- Endpoint de la API ---
app.get('/api/prompt-config', (req, res) => {
  const filePath = path.join(__dirname, 'prompt-config.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error al leer el archivo de configuración:", err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    try {
      res.status(200).json(JSON.parse(data));
    } catch (parseError) {
      console.error("Error al parsear el JSON:", parseError);
      return res.status(500).json({ error: 'Error en el formato del archivo de configuración' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor de configuración escuchando en el puerto ${PORT}`);
});