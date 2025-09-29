import express from "express";
import morgan from "morgan";
import { errorHandler } from "./middlewares/ErrorHandler";
import vinoRoutes from "./routes/VinoRoutes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/vinos', vinoRoutes)

app.get("/", (req, res) => {
    res.send("API de la Bodega en funcionamiento");
});

app.use(errorHandler);

export default app;