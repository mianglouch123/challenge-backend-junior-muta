import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PostgresDatabase } from "../../../database/postgres.database.js";
import { QueryTypes } from "sequelize";
import { request, response } from "express";

export class SignUpController {
  /** @type {PostgresDatabase} */
  #dbInstance;

  constructor() {
    this.#dbInstance = PostgresDatabase.getInstance();
  }

  run = async (req = request, res = response) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Encriptar contraseña
    const transaction = await this.#dbInstance.db.transaction();

    try {
      if (!username || username === "") {
        return res.status(400).json({
          ok: false,
          message: "El nombre de usuario no es valido",
        });
      }

      if (!password || password === "") {
        return res.status(400).json({
          ok: false,
          message: "La contrasena no es valida.",
        });
      }

      const userFinded = await this.#dbInstance.db.query(
        "SELECT COUNT(*) FROM public.users WHERE username = :username LIMIT 1",
        {
          replacements: {
            username,
          },
          type: QueryTypes.SELECT,
          transaction,
        }
      );

      const userExist = Number(userFinded[0]["count"]) > 0;

      if (userExist) {
        await transaction.rollback();

        return res.status(400).json({
          ok: false,
          message: "El nombre de usuario ya esta en uso",
        });
      }

      // Insertar usuario en la base de datos
      const newUser = await this.#dbInstance.db.query(
        "INSERT INTO public.users (username, password) VALUES (:username, :hashedPassword) RETURNING *",
        {
          replacements: {
            username,
            hashedPassword,
          },
          transaction,
          type: QueryTypes.INSERT,
        }
      );
      
      // Generar el token
      const token = jwt.sign({ userId: newUser[0].id }, process.env.JWT_KEY);

      await transaction.commit();

      return res.status(201).json({
        ok: true,
        message: "Usuario creado",
        token: token, // Enviar el token generado
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(400).json({ error: "Error al crear el usuario" });
    }
  };
}
