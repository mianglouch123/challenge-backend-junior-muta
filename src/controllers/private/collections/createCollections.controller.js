import { PostgresDatabase } from "../../../database/postgres.database.js";
import { QueryTypes } from "sequelize";
import { request, response } from "express";

export class CreateCollectionController {
  /** @type {PostgresDatabase} */
  #dbInstance;

  constructor() {
    this.#dbInstance = PostgresDatabase.getInstance();
  }

  run = async (req = request, res = response) => {
    const { id_material, quantity } = req.body;
    const collection_date = new Date(); // Obtener la fecha y hora actual
    const transaction = await this.#dbInstance.db.transaction();

    try {
      // Verificar si el material existe en la tabla materials es decir si no existe un material con el id:8 , por ejenplo , no puedes crear un colection con un id no existente en la tabla de colecciones
      const materialExists = await this.#dbInstance.db.query(
        "SELECT id FROM public.materials WHERE id = :id_material",
        {
          replacements: {
            id_material,
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

      // Insertar la nueva colección
      await this.#dbInstance.db.query(
        "INSERT INTO public.collections (id_material, quantity, collection_date) " +
          "VALUES (:id_material, :quantity, :collection_date)",
        {
          replacements: {
            id_material,
            quantity,
            collection_date,
          },
          transaction,
          type: QueryTypes.INSERT,
        }
      );

      await transaction.commit();

      return res.status(201).json({
        ok: true,
        message: "Colección creada",
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(500).json({
        ok: false,
        error: "Error al crear la colección",
      });
    }
  };
}
