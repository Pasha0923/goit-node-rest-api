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

// описуємо маршрути
const contactsRouter = express.Router();

const jsonParser = express.json();
// запит на всі контакти
contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValidid, getOneContact);

contactsRouter.delete("/:id", isValidid, deleteContact);

contactsRouter.post(
  "/",
  jsonParser,
  validateBody(createContactSchema), // перевіряємо тіло запиту за допомогою joi схеми
  createContact
);

contactsRouter.put(
  "/:id",
  isValidid,
  jsonParser,
  validateBody(updateContactSchema),
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  isValidid,
  jsonParser,
  validateBody(updateFavoriteSchema),
  updateStatusContact
);
export default contactsRouter;
