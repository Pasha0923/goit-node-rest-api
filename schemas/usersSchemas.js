import Joi from "joi";
import { subscriptionList } from "../models/user.js";

// joi перевіряє тіло запиту при реєстрації
export const registerSchema = Joi.object({
  // post(register)
  password: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
  subscription: Joi.string().validate(...subscriptionList),
});
// перевіряє тіло запиту при логіні
export const loginSchema = Joi.object({
  // post(login)
  password: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
});
