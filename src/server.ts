import { main } from "./configs/mongo.config.ts";
import { appRouter } from "./controllers/index.ts";
import { logger } from "./utilities/logger.ts";
import { Application, Router } from "/deps.ts";

const app = new Application();
const router = new Router();

router.use("/api", appRouter.routes(), appRouter.allowedMethods());

app.use(router.routes());

main().then(() => logger.info("Mongo Connected")).catch((err) =>
  logger.error(err)
);

logger.info(`Server started at http://127.0.0.1:5001`);
await app.listen({ port: 5001, hostname: "127.0.0.1" });
