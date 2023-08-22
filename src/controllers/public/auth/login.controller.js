import { PostgresDatabase } from "../../../database/postgres.database.js";
import { QueryTypes } from "sequelize";
import { request, response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { env } from "process";

export class LoginController {
  /** @type {PostgresDatabase} */
  #dbInstance;

  constructor() {
    this.#dbInstance = PostgresDatabase.getInstance();
  }

  run = async (req = request, res = response) => {
    const { username, password } = req.body;
    const transaction = await this.#dbInstance.db.transaction();

    try {
      const userFinded = await this.#dbInstance.db.query(
        "SELECT * FROM public.users WHERE username = :username LIMIT 1",
        {
          replacements: {
            username,
          },
          type: QueryTypes.SELECT,
          transaction,
        }
      );

      
      const user = userFinded[0];
      
      if (!user) {
        return res.status(400).json({
          ok: false,
          message: "El usuario o contrasena es incorrecto",
        });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({
          ok: false,
          message: "El usuario o contrasena es incorrecto",
        });
      }

      const token = jwt.sign({ userId: user.id }, env.JWT_KEY);

      return res.status(200).json({
        ok: true,
        token,
      });
    } catch (error) {
      return res
        .status(400)
        .json({ error: "Error al intentar iniciar sesion" });
    }
  };
}
