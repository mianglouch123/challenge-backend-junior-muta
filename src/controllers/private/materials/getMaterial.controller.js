import { PostgresDatabase } from "../../../database/postgres.database.js";
import { QueryTypes } from "sequelize";
import { request, response } from "express";

export class GetMaterialByIdController {
  /** @type {PostgresDatabase} */
  #dbInstance;

  constructor() {
    this.#dbInstance = PostgresDatabase.getInstance();
  }

  run = async (req = request, res = response) => {
    const materialId = req.params.id; // Obtener el ID del material de los parámetros de la URL

    try {
      const material = await this.#dbInstance.db.query(
        "SELECT * FROM public.materials WHERE id = :materialId LIMIT 1",
        {
          replacements: {
            materialId,
          },
          type: QueryTypes.SELECT,
        }
      );

      if (material.length === 0) {
        return res.status(404).json({
          ok: false,
          message: "Material no encontrado",
        });
      }

      return res.status(200).json({
        ok: true,
        material: material[0],
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        error: "Error al obtener el material",
      });
    }
  };
}
