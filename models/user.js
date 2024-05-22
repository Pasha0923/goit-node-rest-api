import mongoose from "mongoose";
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
      default: "starter", // якщо не передано поле subscription , то воно створються автоматично зі значенням starter
    },
    token: {
      type: String,
      default: null,
    },
  },
  {
    versionKey: false, // відключаємо версію документа
    timestamps: true, // формат (дата створення/дата оновлення документа)
  }
);

export default mongoose.model("User", userSchema);
