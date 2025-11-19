import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";
import { connectDB } from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import { verifyToken } from "./middlewares/auth.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//  Seguridad avanzada: Helmet + Rate Limit
app.use(
  helmet({
    crossOriginResourcePolicy: false, // permite servir archivos locales
  })
);

app.use(
  rateLimit({
    windowMs: 5 * 60 * 1000, 
    max: 200, 
    message: "Demasiadas solicitudes desde esta IP. Inténtalo más tarde.",
  })
);


app.use(
  cors({
    origin: "http://localhost:5000", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Rutas del backend
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

//  Ruta protegida de prueba
app.get("/api/secure", verifyToken, (req, res) => {
  res.json({ message: `Hola ${req.user.username}, esta es una ruta protegida` });
});

// Servidor el frontend (Docker + Local)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FRONTEND_PATH = path.resolve("./frontend");

app.use(express.static(FRONTEND_PATH));

// Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "index.html"));
});

// Servir cualquier HTML
app.get("/:page", (req, res, next) => {
  const page = req.params.page;
  if (page.endsWith(".html")) {
    const filePath = path.join(FRONTEND_PATH, page);
    return res.sendFile(filePath, (err) => {
      if (err) next();
    });
  }
  next();
});

// Página por defecto
app.use((req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "index.html"));
});

// Conexión a MongoDB
connectDB();

// Iniciar servidor
app.listen(PORT, () => {
  console.log(` SecureTask backend running on port ${PORT}`);
  console.log(` Frontend servido desde: ${FRONTEND_PATH}`);
});
