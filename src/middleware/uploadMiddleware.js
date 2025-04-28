import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create subdirectories based on content type
    let uploadPath = uploadsDir;
    
    if (req.originalUrl.includes('/brands')) {
      uploadPath = path.join(uploadsDir, 'brands');
    } else if (req.originalUrl.includes('/products')) {
      uploadPath = path.join(uploadsDir, 'products');
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-originalname
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  },
});

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create multer upload instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Middleware for single file upload
export const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    const uploadHandler = upload.single(fieldName);
    
    uploadHandler(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. Max size is 5MB.' });
          }
          return res.status(400).json({ message: `Multer error: ${err.message}` });
        }
        // Other errors
        return res.status(400).json({ message: err.message });
      }
      
      // Add file URL to request if file exists
      if (req.file) {
        // Convert backslashes to forward slashes for URL consistency
        const filePath = req.file.path.replace(/\\/g, '/');
        req.file.path = `/uploads/${filePath.split('/uploads/')[1]}`;
      }
      
      next();
    });
  };
};

// Middleware for multiple file upload
export const uploadMultiple = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    const uploadHandler = upload.array(fieldName, maxCount);
    
    uploadHandler(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. Max size is 5MB.' });
          } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ message: `Too many files. Maximum is ${maxCount}.` });
          }
          return res.status(400).json({ message: `Multer error: ${err.message}` });
        }
        // Other errors
        return res.status(400).json({ message: err.message });
      }
      
      // Add file URLs to request if files exist
      if (req.files && req.files.length > 0) {
        req.files = req.files.map(file => {
          // Convert backslashes to forward slashes for URL consistency
          const filePath = file.path.replace(/\\/g, '/');
          file.path = `/uploads/${filePath.split('/uploads/')[1]}`;
          return file;
        });
      }
      
      next();
    });
  };
};
