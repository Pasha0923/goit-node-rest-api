import fs from "node:fs/promises"; // для роботи з асинхронними функціями async/await імпортуємо версію з промісами
import path from "path"; // пакет path для створення шляху, join об'єднує шматочки шляху в один великий шлях
import { nanoid } from "nanoid";
const contactsPath = path.resolve("db", "contacts.json"); // шлях до папки в якій занходиться файл contacts.json
console.log("contactsPath: ", contactsPath);
// Функції для роботи з контактами

async function listContacts() {
  const getAllContacts = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(getAllContacts); // парсимо щоб отримати масив об'єктів. Повертає масив всіх контактів.
}

async function getContactById(contactId) {
  const allContacts = await listContacts(); // отримали масив контактів
  const result = allContacts.find((contact) => contact.id === contactId);
  return result || null;
  // ...твій код. Повертає об'єкт контакту з таким id. Повертає null, якщо контакт з таким id не знайдений.
}
async function addContact(name, email, phone) {
  const allContacts = await listContacts(); // отримали масив контактів і зберегли в змінну
  const newContact = {
    // свтороюємо новий контакт
    id: nanoid(),
    ...name,
    ...email,
    ...phone,
  };
  allContacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2)); // перезаписуємо json вже з новою книгою (метод writeFile)
  return newContact; // Повертаємо об'єкт доданого контакту (+ id).
}
export async function removeContact(contactId) {
  const allContacts = await listContacts();
  // шукаємо індекс книжки якщо він = -1 (такого контакту немає ) повертаємо null
  const index = allContacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null; // Повертає null, якщо контакт з таким id не знайдений.
  }
  const deleteContact = allContacts[index]; // зберегли в змінну книгу яку намагаємось видалити по індексу
  allContacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
  return deleteContact; // Повертає об'єкт видаленого контакту.
}

async function updateContact(id, contact) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index === -1) {
    return null;
  }
  contacts[index] = { id, ...contact };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
}

export default {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
