import express from "express";

import AuthController from "../controllers/authControllers.js";

import validateBody from "../helpers/validateBody.js";
import { registerSchema, loginSchema } from "../schemas/usersSchemas.js";
const authRouter = express.Router();
const jsonParser = express.json();
// signup
authRouter.post(
  "/register",
  jsonParser,
  validateBody(registerSchema),
  AuthController.register
);
// signin
authRouter.post(
  "/login",
  jsonParser,
  validateBody(loginSchema),
  AuthController.login
);

export default authRouter;
