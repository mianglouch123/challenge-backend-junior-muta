import { PostgresDatabase } from "../../../database/postgres.database.js";
import { QueryTypes } from "sequelize";
import { request, response } from "express";


export class CreateMaterialController {

  /** @type {PostgresDatabase} */
  #dbInstance

  constructor() {
   this.#dbInstance = PostgresDatabase.getInstance();

  }

  run = async (req = request , res = response) => {
    const { name, weight, value } = req.body;
    const transaction = await this.#dbInstance.db.transaction();

    try {

      // Verificar si el material ya existe
      const existingMaterial = await this.#dbInstance.db.query(
        "SELECT * FROM public.materials WHERE name = :name",
        {
          replacements: {
            name,
          },
          type: QueryTypes.SELECT,
          transaction,
        }
      );

      if (existingMaterial.length > 0) {
        await transaction.rollback();
        return res.status(400).json({
          ok: false,
          error: "El material ya existe en la base de datos",
        });
      }

      // Insertar el material si no existe
      const newMaterial = await this.#dbInstance.db.query(
        "INSERT INTO public.materials (name, weight, value) VALUES (:name, :weight, :value) RETURNING *",
        {
          replacements: {
            name,
            weight,
            value,
          },
          type: QueryTypes.INSERT,
          transaction,
        }
      );

      await transaction.commit();

      return res.status(201).json({
        ok: true,
        material: newMaterial[0],
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(500).json({
        ok: false,
        error: "Error al crear el material",
      });
    }

}
}