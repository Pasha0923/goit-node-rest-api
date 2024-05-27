import Contact from "../models/contact.js";
import HttpError from "../helpers/HttpError.js";
export const getAllContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    // ПАГІНАЦІЯ
    const { page = 1, limit = 10 } = req.query;
    const { favorite } = req.query;
    const skip = (page - 1) * limit;
    const result = await Contact.find({ owner, favorite: favorite === "true" })
      .skip(skip)
      .limit(limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const getContactByIdOwner = await Contact.findOne({
      _id: id, // тут зберігається id яке генерує mongodB
      owner: req.user.id, // в owner зберігається власне значення контакта
    });
    if (getContactByIdOwner) {
      res.status(200).json(getContactByIdOwner);
    } else {
      throw HttpError(404, "Not found");
    }
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleteContactIdOwner = await Contact.findOneAndDelete({
      _id: id,
      owner: req.user.id,
    });
    console.log("deleteContactIdOwner: ", deleteContactIdOwner);
    if (deleteContactIdOwner) {
      res.status(200).json(deleteContactIdOwner);
    } else {
      throw HttpError(404, "Contact not found");
    }
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  console.log(req.user);
  try {
    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      favorite: req.body.favorite,
      owner: req.user.id,
    };
    const { _id: owner } = req.user; // візьмемо з req.user id людини яка робить запит
    const newContact = await Contact.create({ ...contact, owner }); // за кожним користувачем буде своя книга(до кожної людини додається поле owner)
    console.log("newContact: ", newContact);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};
// put (оновлювати і передавати можна як всі поля(name,email, phone,favorite) так і одне якесь поле
//метод PUT http://localhost:4000/api/contacts/6650aa2a4ecbf2e7f022a8b3
export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!req.body || Object.keys(req.body).length === 0) {
      throw HttpError(400, "Body must have at least one field");
    }
    const result = await Contact.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      req.body, // передавати можна як всі поля(name,email, phone,favorite) так і одне
      { new: true }
    );
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
// patch (для оновлення в контактах виключно поля favorite (true або false))
// метод PATCH http://localhost:4000/api/contacts/6650aa2a4ecbf2e7f022a8b3/favorite
export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params; // ми тут явно указываем что хотим передать и поменять именно поле favorite
    const { favorite } = req.body;
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      { favorite },
      {
        new: true,
      }
    );
    console.log(" updatedContact: ", updatedContact);
    if (!updatedContact) {
      throw HttpError(404, "Contact not found"); // якщо контакт в базі є але він не належить користувачу який робить запит то помилка 404
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
