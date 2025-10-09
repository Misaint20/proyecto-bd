import express from "express";
import { errorHandler } from "./middlewares/ErrorHandler";
import authRoutes from "./routes/AuthRoutes";
import vinoRoutes from "./routes/VinoRoutes";
import usuarioRoutes from "./routes/UsuarioRoutes";
import maestrosRoutes from "./routes/MaestrosRoutes";
import trazabilidadRoutes from "./routes/TrazabilidadRoutes";
import { requestLogger } from "./middlewares/RequestLogger";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger());

app.use('/api/auth', authRoutes);

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/vinos', vinoRoutes)
app.use('/api/maestros', maestrosRoutes);
// Rutas de trazabilidad (RF02)
app.use('/api/trazabilidad', trazabilidadRoutes);

app.get("/", (req, res) => {
    res.send("API de la Bodega en funcionamiento");
});

app.use(errorHandler);

export default app;