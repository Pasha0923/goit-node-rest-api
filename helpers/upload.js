import multer from "multer";
import path from "node:path";

const tmpDir = path.resolve("tmp");

const multerConfig = multer.diskStorage({
  destination: tmpDir,
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: multerConfig,
});

export default upload;
