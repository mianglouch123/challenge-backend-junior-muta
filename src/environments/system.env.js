import "dotenv/config"
import {env} from "process";

export class SystemEnv {
  /** @type {SystemEnv} */
  static #instance;

  /** @type {number} */
  API_PORT;

  constructor(){
    this.API_PORT=Number(env.API_PORT);
  }

  

  static getInstance() {
    if (!this.#instance) {
        this.#instance = Object.freeze(new SystemEnv());
    }
    return this.#instance;
  }
}
