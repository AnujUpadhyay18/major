const multer = require('multer');
const path = require('path');

// Set Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes'); // Ensure this folder exists in your project root!
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  }
});

// Optional: File Filter (if you want to restrict file types)
// const fileFilter = (req, file, cb) => {
//     const fileTypes = /pdf|doc|docx/;
//     const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimeType = fileTypes.test(file.mimetype);
//     if (extName && mimeType) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only .pdf, .doc, .docx files are allowed!'));
//     }
// };

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  // fileFilter: fileFilter // Uncomment if using the filter
});

module.exports = upload;
