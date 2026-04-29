import multer from "multer";
import fs from "fs";
import path from "path";

// Check if directory exists
const uploadDir = path.join(process.cwd(), "src/uploads/");

if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true})
}

// Configure Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);

        cb(null, `profile-${uniqueSuffix}${ext}`);
    },
})

// FIle filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;