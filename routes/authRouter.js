import express from "express";

import AuthController from "../controllers/authControllers.js";

import validateBody from "../helpers/validateBody.js";
import { loginSchema, registerSchema } from "../schemas/usersSchemas.js";
import authenticate from "../helpers/authenticate.js";
import { updateSubscriptionSchema } from "../schemas/contactsSchemas.js";

const authRouter = express.Router();
const jsonParser = express.json();
// sign up
authRouter.post(
  "/users/register",
  jsonParser,
  validateBody(registerSchema),
  AuthController.register
);
// sign in;
authRouter.post(
  "/users/login",
  jsonParser,
  validateBody(loginSchema),
  AuthController.login
);
// current
authRouter.get("/users/current", authenticate, AuthController.getCurrent);

// logout
authRouter.post("/users/logout", authenticate, AuthController.logout);

// patch
authRouter.patch(
  "/users",
  authenticate,
  jsonParser,
  validateBody(updateSubscriptionSchema), // перевіряємо тіло запиту за допомогою joi схеми
  AuthController.updateSubscription
);

export default authRouter;
