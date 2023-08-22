import jwt from "jsonwebtoken";
import { env } from "process";
import { request, response } from "express";

export class AuthenticateMiddleware {
  run = async (req = request, res = response, next) => {
    const token = req.header("Authorization");

    try {
      if (!token) {
        return res.status(403).json({
          ok: false,
          message: "No esta autorizado",
          token,
        });
      }

      const decodedToken = jwt.verify(token, env.JWT_KEY);
      req.user = decodedToken;
      return next();
    } catch (error) {
      return res.status(403).json({
        ok: false,
        message: "No esta autorizado",
        token,
      });
    }
  };
}
