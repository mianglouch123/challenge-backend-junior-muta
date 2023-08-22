import { PostgresDatabase } from "../../../database/postgres.database.js";
import { QueryTypes } from "sequelize";
import { request, response } from "express";

export class UpdateMaterialController {
  /** @type {PostgresDatabase} */
  #dbInstance;

  constructor() {
    this.#dbInstance = PostgresDatabase.getInstance();
  }

  run = async (req = request, res = response) => {
    const materialId = req.params.id;
    const { name, weight, value } = req.body;

    const transaction = await this.#dbInstance.db.transaction();

    try {
      // Check if the material with the given ID exists
      const existingMaterial = await this.#dbInstance.db.query(
        "SELECT * FROM public.materials WHERE id = :materialId",
        {
          replacements: {
            materialId,
          },
          type: QueryTypes.SELECT,
          transaction,
        }
      );

      if (existingMaterial.length === 0) {
        await transaction.rollback();
        return res.status(404).json({
          ok: false,
          error: "Material not found",
        });
      }

      await this.#dbInstance.db.query(
        "UPDATE public.materials SET name = :name, weight = :weight, value = :value WHERE id = :materialId",
        {
          replacements: {
            name,
            weight,
            value,
            materialId,
          },
          transaction,
          type: QueryTypes.UPDATE,
        }
      );

      await transaction.commit();

      return res.status(200).json({
        ok: true,
        message: "Material updated successfully",
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(500).json({
        ok: false,
        error: "Error updating material",
      });
    }
  };
}
