import Contact from "../models/contact.js";
import HttpError from "../helpers/HttpError.js";
export const getAllContacts = async (req, res) => {
  try {
    const result = await Contact.find();
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contactById = await Contact.findById(id);
    if (contactById) {
      res.status(200).json(contactById); // якщо результат є
    } else {
      throw HttpError(404, "Not found"); // якщо контакт за id не знайдено
    }
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleteContactId = await Contact.findByIdAndDelete(id);
    console.log("deleteContactId: ", deleteContactId);
    if (deleteContactId) {
      res.status(200).json(deleteContactId);
    } else {
      throw HttpError(404, "Contact not found"); // якщо контакт за id не знайдено
    }
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };
    // const { error } = createContactSchema.validate(contact, {
    //   abortEarly: false,
    // });
    //   // метод validate відповідає чи поля об'єкта відповідають схемі і повертає об'єкт рез-ту з полем error
    // if (error) {
    //     return res.status(400).json({ message: error.message }); }
    // помилка валідації (передані поля не відповідають схемі валідації)

    const newContact = await Contact.create(contact);
    console.log("newContact: ", newContact);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!req.body || Object.keys(req.body).length === 0) {
      throw HttpError(400, "Body must have at least one field");
    }
    const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
    console.log("result: ", result);
    if (result) {
      res.status(200).json(result);
    } else {
      throw HttpError(404, "Not Found");
    }
  } catch (error) {
    next(error);
  }
};
export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!req.body || Object.keys(req.body).length === 0)
      throw HttpError(
        400,
        "Body must have an object with key 'favorite' and its value boolean"
      );

    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    console.log(" updatedContact: ", updatedContact);
    if (!updatedContact) {
      throw HttpError(404, "Contact not found");
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
