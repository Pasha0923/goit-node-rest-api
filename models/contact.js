import mongoose from "mongoose";
import { Schema } from "mongoose";
import handleMongooseError from "../helpers/handleMongooseError.js";
const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false, 
    },
    owner: {
      type: Schema.Types.ObjectId, //  Id людини яка додала книгу , генерує mongoDB
      ref: "user", // назва колекції з якої буде це Id
    },
  },
  {
    versionKey: false, 
    timestamps: true, 
  }
);
contactSchema.post("save", handleMongooseError);
export default mongoose.model("Contact", contactSchema);
