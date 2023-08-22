import { PostgresDatabase } from "../../../database/postgres.database.js";
import { QueryTypes } from "sequelize";
import { request, response } from "express";

export class DeleteMaterialController {
  /** @type {PostgresDatabase} */
  #dbInstance;

  constructor() {
    this.#dbInstance = PostgresDatabase.getInstance();
  }

  run = async (req = request, res = response) => {
    const id = req.params.id; // Obtener el ID del material
    const transaction = await this.#dbInstance.db.transaction();

    try {
      // Verificar si el material existe
      const materialExists = await this.#dbInstance.db.query(
        "SELECT * FROM public.materials WHERE id = :id",
        {
          replacements: {
            id,
          },
          type: QueryTypes.SELECT,
          transaction,
        }
      );

      if (!materialExists.length) {
        await transaction.rollback();
        return res.status(400).json({
          ok: false,
          error: "El material no existe",
        });
      }

      // Eliminar el material
      await this.#dbInstance.db.query(
        "DELETE FROM public.materials WHERE id = :id",
        {
          replacements: {
            id,
          },
          transaction,
          type: QueryTypes.DELETE,
        }
      );

      await transaction.commit();

      return res.status(200).json({
        ok: true,
        message: "Material eliminado",
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(500).json({
        ok: false,
        error: "Error al eliminar el material , verificar que el material que se esté borrando no haga parte una coleccion , eliminar id de la colección si quieres eliminar este campo",
      });
    }
  };
}
