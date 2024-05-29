import express from "express";

import AuthController from "../controllers/authControllers.js";

import validateBody from "../helpers/validateBody.js";
import { loginSchema, registerSchema } from "../schemas/usersSchemas.js";
import authenticate from "../helpers/authenticate.js";
import { updateSubscriptionSchema } from "../schemas/contactsSchemas.js";
import upload from "../helpers/upload.js"; 

const authRouter = express.Router();
const jsonParser = express.json();

// sign up
authRouter.post(
  "/register",
  jsonParser,
  validateBody(registerSchema),
  AuthController.register
);
// sign in;
authRouter.post(
  "/login",
  jsonParser,
  validateBody(loginSchema),
  AuthController.login
);
// current
authRouter.get("/current", authenticate, AuthController.getCurrent);

// logout
authRouter.post("/logout", authenticate, AuthController.logout);

// patch
authRouter.patch(
  "/",
  authenticate,
  jsonParser,
  validateBody(updateSubscriptionSchema),
  AuthController.updateSubscription
);
// запит на зміну автарки могла зробити тільки та людина яка залогінилась
// створюємо маршрут за яким людина може змінити аватарку метод patch
authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  AuthController.updateAvatar
);


export default authRouter;
