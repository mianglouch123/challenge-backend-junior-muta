import { PostgresDatabase } from "../../../database/postgres.database.js";
import { QueryTypes } from "sequelize";
import { request, response } from "express";

export class GetCollectionsController {
  /** @type {PostgresDatabase} */
  #dbInstance;

  constructor() {
    this.#dbInstance = PostgresDatabase.getInstance();
  }

  run = async (req = request, res = response) => {
    try {
      const collections = await this.#dbInstance.db.query(
        "SELECT c.id, m.name AS material_name, c.quantity, c.collection_date , c.id_material " +
        "FROM public.collections c " +
        "JOIN public.materials m ON c.id_material = m.id",
        {
          type: QueryTypes.SELECT,
        }
      );

      return res.status(200).json({
        ok: true,
        collections,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        error: "Error al obtener las colecciones",
      });
    }
  };
}
