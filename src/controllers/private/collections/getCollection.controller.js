import { PostgresDatabase } from "../../../database/postgres.database.js";
import { QueryTypes } from "sequelize";
import { request, response } from "express";

export class GetCollectionByIdController {
  /** @type {PostgresDatabase} */
  #dbInstance;

  constructor() {
    this.#dbInstance = PostgresDatabase.getInstance();
  }

  run = async (req = request, res = response) => {
    const { collectionId } = req.params; // Obtener el ID de la colección a obtener

    try {
      const collection = await this.#dbInstance.db.query(
        "SELECT * FROM public.collections WHERE id = :collectionId",
        {
          replacements: {
            collectionId,
          },
          type: QueryTypes.SELECT,
        }
      );

      if (collection.length > 0) {
        return res.status(200).json({
          ok: true,
          collection: collection[0],
        });
      } else {
        return res.status(404).json({
          ok: false,
          error: "Colección no encontrada",
        });
      }
    } catch (error) {
      return res.status(500).json({
        ok: false,
        error: "Error al obtener la colección",
      });
    }
  };
}
