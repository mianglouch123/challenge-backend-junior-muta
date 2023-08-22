import { PostgresDatabase } from "../../../database/postgres.database.js";
import { QueryTypes } from "sequelize";
import { request, response } from "express";

export class GetAllMaterialsController {
  /** @type {PostgresDatabase} */
  #dbInstance;

  constructor() {
    this.#dbInstance = PostgresDatabase.getInstance();
  }

  run = async (req = request, res = response) => {
     try {
      const materials = await this.#dbInstance.db.query(
        "SELECT * FROM public.materials",
        {
          type: QueryTypes.SELECT,
        }
      );

      return res.status(200).json({
        ok: true,
        materials,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        error: "Error al obtener los materiales",
      });
    }
  }
}
