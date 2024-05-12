import contactsService from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
export const getAllContacts = async (req, res) => {
  const result = await contactsService.listContacts();
  res.status(201).json(result);
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("id : ", id);
    const contactById = await contactsService.getContactById(id);
    if (contactById) {
      // якщо результат є
      res.status(200).json(contactById);
    } else {
      return res.status(404).json({ message: "Not found" }); // якщо контакт за id не знайдено
    }
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("id : ", id);
    const deleteContactId = await contactsService.removeContact(id);
    if (deleteContactId) {
      res.status(200).json(deleteContactId);
    } else {
      return res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };
    const { error } = createContactSchema.validate(contact, {
      abortEarly: false,
    }); // метод validate відповідає чи поля об'єкта відповідають схемі і повертає об'єкт рез-ту з полем error
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const newContact = await contactsService.addContact({ name, email, phone });
    // console.log("newContact: ", newContact);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ message: "Body must have at least one field" });
    }

    const { error } = updateContactSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).send({ message: error.message }); // помилка валідації (передані поля не відповідають схемі валідації)
    }

    const { id } = req.params;

    const result = await contactsService.updateContact(id, req.body);
    // console.log("result: ", result);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Not found" }); // помилка якщо контакта по id не існує
    }
  } catch (error) {
    next(error);
  }
};
