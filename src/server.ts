import { environment } from "/configs/environments/index.ts";
import { mongoConnect } from "/configs/mongo.config.ts";
import { appRouter } from "/controllers/index.ts";
import { logger } from "/utilities/logger.ts";
import { Application, Router } from "/deps.ts";

const app = new Application();
const router = new Router();

router.use("/api", appRouter.routes(), appRouter.allowedMethods());

app.use(router.routes());

mongoConnect().then(() => logger.info("Mongo Connected")).catch((err) =>
  logger.error(err)
);

logger.info(
  `Server started at http://${environment.app.host}:${environment.app.port}`,
);
await app.listen({
  port: environment.app.port,
  hostname: environment.app.host,
});
