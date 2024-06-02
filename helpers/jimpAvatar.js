import Jimp from "jimp";
const jimpAvatar = async (filePath) => {
  // шлях до вихідного зображення
  try {
    const image = await Jimp.read(filePath);
    image.resize(250, 250);
    await image.writeAsync(filePath);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export default jimpAvatar;
