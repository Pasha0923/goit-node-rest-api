import mongoose from "mongoose";
import handleMongooseError from "../helpers/handleMongooseError.js";

export const subscriptionList = ["starter", "pro", "business"];

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
    avatarURL: {
      // посилання на аватарку користувача яку він завантажить (видаємо avatarURL під час реєстрації)
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
userSchema.post("save", handleMongooseError);
export default mongoose.model("User", userSchema);
