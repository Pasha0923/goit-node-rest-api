import bcrypt from "bcrypt";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import gravatar from "gravatar";
import path from "node:path";
import * as fs from "node:fs/promises";
import jimpAvatar from "../helpers/jimpAvatar.js";
import { nanoid } from "nanoid";
import sendEmail from "../helpers/sendEmail.js";

const { SECRET_KEY, BASE_URL } = process.env;

async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user !== null) {
      throw HttpError(409, "User already registered");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const avatarURL = gravatar.url(email);

    const verificationToken = nanoid();

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`,
    };
   
    await sendEmail(verifyEmail);

    res.status(201).json({
      email: newUser.email,
      subscription: newUser.subscription,
    });
  } catch (error) {
    next(error);
  }
}

async function verifyEmail(req, res, next) {
  try {
   
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken }); 
    if (!user) {
      throw HttpError(404, "User not found"); 
    }
    
    await User.findByIdAndUpdate(user._id, {
      verify: true, 
      verificationToken: null,
    });
    res.status(200).json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
}

async function resendVerifyEmail(req, res, next) {
  
  try {
    const { email } = req.body; 
    const user = await User.findOne({ email }); 
    if (!user) {
     
      throw HttpError(404, "Email not found");
    }
    if (user.verify) {
      
      throw HttpError(400, "Verification has already been passed");
    }
   
    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`,
    };
   
    await sendEmail(verifyEmail);

    res.status(200).json({
      message: "Verification email was sent",
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
   
    if (!user.verify) {
      throw HttpError(401, "Email not verified");
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
    if (!req.file) {
      return next(HttpError(400, "File not found"));
    }
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
// http://localhost:4000/avatars/6654dcec34a299eb142ffb02-5dd45aac-3d8c-4162-b166-c23f87c1d5d0.jpg
export default {
  register,
  login,
  getCurrent,
  logout,
  updateSubscription,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
};
