import Joi from "joi";

export const createContactSchema = Joi.object({
  // post
  name: Joi.string().min(2).required(),
  email: Joi.string().required(),
  phone: Joi.string().min(8).required(),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  // put
  name: Joi.string().min(4),
  email: Joi.string().email(),
  phone: Joi.string().min(8),
});
export const updateFavoriteSchema = Joi.object({
  // patch
  name: Joi.string().min(3),
  email: Joi.string().email(),
  phone: Joi.string().min(8),
  favorite: Joi.boolean().required(),
});
