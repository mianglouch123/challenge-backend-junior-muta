import { PostgresDatabase } from "../../../database/postgres.database.js";
import { QueryTypes } from "sequelize";
import { request, response } from "express";

export class DeleteCollectionController {
  /** @type {PostgresDatabase} */
  #dbInstance;

  constructor() {
    this.#dbInstance = PostgresDatabase.getInstance();
  }

  run = async (req = request, res = response) => {
    const collectionId = req.params.collectionId; // Obtener el ID de la colección
    const transaction = await this.#dbInstance.db.transaction();

    try {
      // Verificar si la colección existe
      const collectionExists = await this.#dbInstance.db.query(
        "SELECT * FROM public.collections WHERE id = :collectionId",
        {
          replacements: {
            collectionId,
          },
          type: QueryTypes.SELECT,
          transaction,
        }
      );

      if (!collectionExists.length) {
        await transaction.rollback();
        return res.status(400).json({
          ok: false,
          error: "La colección no existe",
        });
      }

      // Eliminar la colección
      await this.#dbInstance.db.query(
        "DELETE FROM public.collections WHERE id = :collectionId",
        {
          replacements: {
            collectionId,
          },
          transaction,
          type: QueryTypes.DELETE,
        }
      );

      await transaction.commit();

      return res.status(200).json({
        ok: true,
        message: "Colección eliminada",
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(500).json({
        ok: false,
        error: "Error al eliminar la colección",
      });
    }
  };
}
