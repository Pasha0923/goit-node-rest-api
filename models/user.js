import mongoose from "mongoose";
import handleMongooseError from "../helpers/handleMongooseError.js";
export const subscriptionList = ["starter", "pro", "business"];

// створюємо модель користувача user яку будемо зберігати в базі даних!
const userSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      // підписка
      type: String,
      enum: subscriptionList,
      default: "starter",
    },
    // коли користувач зробить logout то token стане не валідним
    token: {
      type: String,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
userSchema.post("save", handleMongooseError);
export default mongoose.model("User", userSchema);
