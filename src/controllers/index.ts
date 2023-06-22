import { profileRouter } from "./profile.controller.ts";
import { Router } from "/deps.ts";

const router = new Router();

router.use("/profile", profileRouter.routes(), profileRouter.allowedMethods());

export const appRouter = router;
