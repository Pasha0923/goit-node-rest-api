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
      default: false, // якщо не передаємо поле favorite , то воно створються автоматично зі занченям false
    },
  },
  {
    versionKey: false, // відключаємо версію документа
    timestamps: true, // формат (дата створення/дата оновлення документа)
  }
);
// на основі схемки книжки можна створити модель. Викликаємо у mongoose метод model(). Ім'я моделі в однині
export default mongoose.model("Contact", contactSchema); // contacts (назва колекції повинна бути в множині в нижному регістрі)
