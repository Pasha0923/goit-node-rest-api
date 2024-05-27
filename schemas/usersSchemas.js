import Joi from "joi";
import { subscriptionList } from "../models/user.js";

export const registerSchema = Joi.object({
  password: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
  subscription: Joi.string().valid(...subscriptionList),
});

export const loginSchema = Joi.object({
  password: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
});
