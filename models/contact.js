import mongoose from "mongoose";
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
      default: false, // якщо не передаємо поле favorite , то воно створються автоматично зі значенням false
    },
  },
  {
    versionKey: false, // відключаємо версію документа
    timestamps: true, // формат (дата створення/дата оновлення документа)
  }
);

export default mongoose.model("Contact", contactSchema);
