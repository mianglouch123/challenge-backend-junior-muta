import {Sequelize} from "sequelize";
import { DatabaseEnv } from "../environments/database.env.js";

export class PostgresDatabase {
    /** @type {PostgresDatabase} */
    static #instance;

    /** @type {Sequelize} */
    #dbInstance;
    
    constructor(){
        const dbenv = DatabaseEnv.getInstance();
        this.#dbInstance = new Sequelize({
            dialect: "postgres",
            host: dbenv.DB_HOST,
            port: dbenv.DB_PORT,
            username: dbenv.DB_USER,
            password: dbenv.DB_PASSWORD,
            database: dbenv.DB_NAME
        })
    };

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new PostgresDatabase();
        }
        return this.#instance;
    }

    get db() {
        return this.#dbInstance;
    }

    async connection(){
        try {
            await this.#dbInstance.authenticate();
            console.log("LA CONEXION FUE EXITOSA")
        } catch (error) {
            console.log("NO SE PUDO CONECTAR A LA BASE DE DATOS");
            console.log(error)
        }
    }
}