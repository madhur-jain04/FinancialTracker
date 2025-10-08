import multer from 'multer';
import path from 'path';

// Configure disk storage for Multer
const storage = multer.diskStorage({
  // Specify the destination directory where files will be saved
  destination: (req, file, cb) => {
    // In a real application, ensure this directory exists
    cb(null, 'uploads/'); 
  },
  // Define the file naming convention
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Renames the file to prevent collisions
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Initialize Multer with the storage configuration
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit files to 5MB
    fileFilter: (req, file, cb) => {
        // Ensure only PDF files are accepted
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(null, false);
            // Optionally reject the file with an error
            const error = new Error('Only PDF files are allowed!');
            error.code = 'FILE_TYPE_ERROR';
            cb(error, false); 
        }
    }
});

export default upload;
