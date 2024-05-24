import jwt from "jsonwebtoken";
import User from "../models/user.js";
import HttpError from "./HttpError.js";
const { SECRET_KEY } = process.env; // забираємо секретний ключ зі змінних оточення

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HttpError(401, "Not Unauthorized"));
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    console.log(" id: ", id);

    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      next(HttpError(401, "Not Unauthorized"));
    }
    req.user = user; // записує людину в об'єкт req.user (записує інформація про людину яка зробила запит)
    next();
  } catch (error) {
    next(HttpError(401, "Not Unauthorized"));
  }
};

export default authenticate;
