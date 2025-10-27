import express, { Router } from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/ErrorHandler";
import { logger } from "./utils/logger";
import { routes } from "./routes";
import { requestLogger } from "./middlewares/RequestLogger";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger());

async function loadAndApplyRoutes() {
    logger.info("Cargando rutas dinámicamente...");

    for (const route of routes) {
        try {
            const module = await route.module;
            const router = module.default as Router;

            if (router) {
                app.use(route.path, router);
                logger.info(`Ruta montada: ${route.path}`);
            } else {
                logger.error(`Error: El módulo en ${route.path} no exporta un 'default' router.`);
            }

        } catch (error) {
            logger.error(`Error al cargar el módulo para la ruta ${route.path}:`, error);
        }
    }
}

loadAndApplyRoutes().then(() => {
    app.get("/", (req, res) => {
        res.send("API de la Bodega en funcionamiento");
    });

    app.use(errorHandler);

    logger.info("Todas las rutas han sido cargadas.");
}).catch((error) => {
    logger.error("Error al cargar las rutas dinámicamente:", error);
    process.exit(1);
});

export default app;