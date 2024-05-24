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
    const contactById = await Contact.findById(id);
    if (contactById) {
      res.status(200).json(contactById);
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

    const deleteContactId = await Contact.findByIdAndDelete(id);
    console.log("deleteContactId: ", deleteContactId);
    if (deleteContactId) {
      res.status(200).json(deleteContactId);
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
    };
    const { _id: owner } = req.user; // візьмемо з req.user id людини яка робить запит
    const newContact = await Contact.create({ ...contact, owner }); // за кожним користувачем буде своя книга(до кожної людини додається поле owner)
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
