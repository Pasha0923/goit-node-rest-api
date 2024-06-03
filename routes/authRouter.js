import express from "express";

import AuthController from "../controllers/authControllers.js";

import validateBody from "../helpers/validateBody.js";
import {
  emailSchema,
  loginSchema,
  registerSchema,
} from "../schemas/usersSchemas.js";
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
// http://localhost:4000/api/users/verify/1MuVU8Jg4fOwQel0MvvNs
authRouter.get("/verify/:verificationToken", AuthController.verifyEmail);

// http://localhost:4000/api/users/verify
authRouter.post(
  "/verify",
  jsonParser,
  validateBody(emailSchema),
  AuthController.resendVerifyEmail
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

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  AuthController.updateAvatar
);

export default authRouter;
