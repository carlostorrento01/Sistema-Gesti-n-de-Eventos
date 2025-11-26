const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Datos en memoria (se pierden al apagar el servidor)
let eventos = [
  {
    id: "1",
    titulo: "Reunión de vecinos (backend)",
    fecha: "2025-11-30",
    hora: "18:00",
    ubicacion: "Casa comunal",
    descripcion: "Evento de ejemplo desde el backend.",
  },
];

// Obtener todos los eventos
app.get("/eventos", (req, res) => {
  res.json(eventos);
});

// Crear un nuevo evento
app.post("/eventos", (req, res) => {
  const evento = req.body;
  eventos.push(evento);
  res.status(201).json(evento);
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
