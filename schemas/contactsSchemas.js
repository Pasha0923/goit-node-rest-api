import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().required(),
  phone: Joi.string().min(6).required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(4),
  email: Joi.string().email(),
  phone: Joi.string().min(8),
});
