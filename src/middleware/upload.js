// src/middleware/upload.js
import multer from 'multer';
import path from 'path';

// پیکربندی Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // پوشه‌ای که تصاویر در آن ذخیره می‌شوند
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));  // نام فایل با زمان فعلی
  },
});

const upload = multer({ storage: storage });

export default upload;

