import { Router } from "express";
import { SignUpController } from "../controllers/public/auth/SignUp.controller.js";
import { LoginController } from "../controllers/public/auth/login.controller.js";

const authRouter = Router();

const loginController = new LoginController();
const signUpController = new SignUpController();

authRouter.post("/login", loginController.run);
authRouter.post("/sign-up", signUpController.run);

export { authRouter };
