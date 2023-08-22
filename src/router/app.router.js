import { Router } from "express";
import { authRouter } from "./auth.router.js";
import { materialRouter } from "./material.router.js";
import { collectionRouter } from "./collections.router.js";
import { recyclingRouter } from "./recycling.router.js";
import { AuthenticateMiddleware } from "../middlewares/authenticate.middleware.js";

const appRouter = Router();

const authenticateMiddleware = new AuthenticateMiddleware();

appRouter.use(authRouter);
appRouter.use(authenticateMiddleware.run, materialRouter);
appRouter.use(authenticateMiddleware.run, collectionRouter);
appRouter.use(authenticateMiddleware.run , recyclingRouter)

export { appRouter };
