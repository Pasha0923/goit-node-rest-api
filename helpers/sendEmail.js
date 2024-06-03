import nodemailer from "nodemailer";
import "dotenv/config";

const { META_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "pavelsai@meta.ua",
    pass: META_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: "pavelsai@meta.ua" };
  await transport.sendMail(email);
  return true;
};
export default sendEmail;
