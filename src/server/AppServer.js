import express, { Router } from "express";
import cors from "cors";
import { SystemEnv } from "../environments/system.env.js";
import { appRouter } from "../router/app.router.js";

export class AppServer {
  /** @type {express.Application} */
  #app;

  /** @type {SystemEnv} */
  #systemEnv;

  constructor() {
    this.#app = express();
    this.#systemEnv = SystemEnv.getInstance();
    this.#middlewares();
    this.#routers();
  }

  #middlewares() {
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(cors({
      origin: "*", // Cambiar a la lista de orígenes permitidos
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      optionsSuccessStatus: 204,
    }));
  }

  #routers() {
    const router = Router();
    router.use(appRouter);
    this.#app.use(router)
  }

  start() {
    const { API_PORT } = this.#systemEnv;
    this.#app.listen(API_PORT, () => {
      try {
        console.log("server is started on http://localhost:" + API_PORT);
      } catch (err) {
        console.log("failed conn " + err.name);
      }
    });
  }
}
