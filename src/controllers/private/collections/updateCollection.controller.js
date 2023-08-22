import { PostgresDatabase } from "../../../database/postgres.database.js";
import { QueryTypes } from "sequelize";
import { request, response } from "express";

export class UpdateCollectionController {
  /** @type {PostgresDatabase} */
  #dbInstance;

  constructor() {
    this.#dbInstance = PostgresDatabase.getInstance();
  }

  run = async (req = request, res = response) => {
    const collectionId = req.params.collectionId; // Obtener el id_material de los parámetros de la ruta
    const { quantity } = req.body; // Obtener la nueva cantidad del cuerpo de la solicitud

    const transaction = await this.#dbInstance.db.transaction();

    try {
      // Verificar si la colección existe
      const collectionExist = await this.#dbInstance.db.query(
        "SELECT COUNT(*) FROM public.collections WHERE id = :collectionId",
        {
          replacements: {
            collectionId,
          },
          type: QueryTypes.SELECT,
          transaction,
        }
      );

      const collectionExistCount = Number(collectionExist[0]["count"]);
      
      if (collectionExistCount === 0) {
        await transaction.rollback();
        return res.status(404).json({
          ok: false,
          error: "Colección no encontrada",
        });
      }

      // Realizar la actualización de la cantidad
      await this.#dbInstance.db.query(
        "UPDATE public.collections SET quantity = :quantity WHERE id = :collectionId",
        {
          replacements: {
            quantity,
            collectionId,
          },
          transaction,
          type: QueryTypes.UPDATE,
        }
      );

      await transaction.commit();

      return res.status(200).json({
        ok: true,
        message: "Colección actualizada",
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(500).json({
        ok: false,
        error: "Error al actualizar la colección",
      });
    }
  };
}
