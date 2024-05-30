import bcrypt from "bcrypt";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import gravatar from "gravatar";
import path from "node:path";
import * as fs from "node:fs/promises";
import jimpAvatar from "../helpers/jimpAvatar.js";
const { SECRET_KEY } = process.env;

async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user !== null) {
      throw HttpError(409, "User already registered");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const avatarURL = gravatar.url(email);
    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
    });

    res.status(201).json({
      email: newUser.email,
      subscription: newUser.subscription,
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password, subscription = "starter" } = req.body;

    const user = await User.findOne({ email });
    console.log("user: ", user);
    if (!user) {
      throw HttpError(401, "Email or password invalid");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "Email or password invalid");
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
      token,
      user: {
        email,
        subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}
async function getCurrent(req, res) {
  const { email, subscription = "starter" } = req.user;

  res.json({
    email,
    subscription,
  });
}

async function logout(req, res, next) {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    next(HttpError(204, "No content"));
  } catch (error) {
    next(error);
  }
}

async function updateSubscription(req, res, next) {
  if (
    Object.keys(req.body).length !== 1 ||
    !Object.keys(req.body).includes("subscription")
  ) {
    return res.status(400).json({
      message: "Body must have one field: subscription",
    });
  }
  try {
    const data = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });
    if (!data) {
      return res.status(404).json({
        message: "Not found",
      });
    }
    return res.json(data);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

async function updateAvatar(req, res, next) {
  try {
    console.log(req.file);
    const { _id: id } = req.user;
    const { path: tmpUpload, originalname } = req.file;
    await jimpAvatar(tmpUpload);
    const fileName = `${id}-${originalname}`; 
    const resultUpload = path.resolve("public/avatars", fileName);
    await fs.rename(tmpUpload, resultUpload);
    const avatarURL = path.join("avatars", fileName);
    console.log(avatarURL);
    const user = await User.findByIdAndUpdate(id, { avatarURL }, { new: true });
    if (!user) {
      throw HttpError(401, "Not authorized");
    }
    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
}

export default {
  register,
  login,
  getCurrent,
  logout,
  updateSubscription,
  updateAvatar,
};
