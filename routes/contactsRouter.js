import express from "express";

import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import isValidid from "../helpers/isValidid.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";
import authenticate from "../helpers/authenticate.js";

const contactsRouter = express.Router();

const jsonParser = express.json();
// запит на всі контакти
contactsRouter.get("/", authenticate, getAllContacts);

contactsRouter.get("/:id", authenticate, isValidid, getOneContact);

contactsRouter.delete("/:id", authenticate, isValidid, deleteContact);

contactsRouter.post(
  "/",
  authenticate,
  jsonParser,
  validateBody(createContactSchema),
  createContact
);

contactsRouter.put(
  "/:id",
  authenticate,
  isValidid,
  jsonParser,
  validateBody(updateContactSchema),
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  authenticate,
  isValidid,
  jsonParser,
  validateBody(updateFavoriteSchema),
  updateStatusContact
);

export default contactsRouter;
