import "dotenv/config"
import {env} from "process";

export class DatabaseEnv {
  /** @type {DatabaseEnv} */
  static #instance;

  /** @type {string} */
  DB_HOST;

  /** @type {number} */
  DB_PORT;

  /** @type {string} */
  DB_NAME;

  /** @type {string} */
  DB_USER;

  /** @type {string} */
  DB_PASSWORD;

  constructor(){
    this.DB_HOST=env.DB_HOST;
    this.DB_PORT=Number(env.DB_PORT);
    this.DB_NAME=env.DB_NAME;
    this.DB_USER=env.DB_USER;
    this.DB_PASSWORD=env.DB_PASSWORD;
  }

  static getInstance() {
    if (!this.#instance) {
        this.#instance = Object.freeze(new DatabaseEnv());
    }
    return this.#instance;
  }
}