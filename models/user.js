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

    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      required: true,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
userSchema.post("save", handleMongooseError);
export default mongoose.model("User", userSchema);
