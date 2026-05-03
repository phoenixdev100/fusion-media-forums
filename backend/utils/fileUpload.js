const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Function to compress images
const compressImage = async (filePath, targetSize = 10 * 1024) => { // 10KB target size
  try {
    // Get original image info
    const metadata = await sharp(filePath).metadata();
    const originalSize = fs.statSync(filePath).size;
    
    // If already smaller than target, no need to compress
    if (originalSize <= targetSize) {
      console.log(`Image ${path.basename(filePath)} already smaller than target size`);
      return;
    }
    
    // Start with quality 80 and adjust as needed
    let quality = 80;
    let compressedImage;
    let compressedSize = originalSize;
    
    // Iteratively reduce quality until we reach target size or minimum quality
    while (compressedSize > targetSize && quality > 10) {
      // Compress the image
      compressedImage = await sharp(filePath)
        .resize(Math.round(metadata.width * 0.9), Math.round(metadata.height * 0.9)) // Slightly reduce dimensions
        .jpeg({ quality })
        .toBuffer();
      
      compressedSize = compressedImage.length;
      quality -= 10; // Reduce quality for next iteration if needed
    }
    
    // Save the compressed image back to the original path
    if (compressedImage) {
      await fs.promises.writeFile(filePath, compressedImage);
      console.log(`Compressed ${path.basename(filePath)} from ${originalSize} to ${compressedSize} bytes`);
    }
  } catch (error) {
    console.error(`Error compressing image ${path.basename(filePath)}:`, error);
  }
};

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Create a unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'image-' + uniqueSuffix + ext);
  }
});

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 5 // Maximum 5 files per upload
  },
  fileFilter: fileFilter
});

// Middleware to compress images after upload
const compressAndProcessUpload = (req, res, next) => {
  // If no files were uploaded, continue
  if (!req.files || req.files.length === 0) {
    return next();
  }
  
  // Process each uploaded file
  const compressionPromises = req.files.map(file => {
    return compressImage(file.path);
  });
  
  // Wait for all compressions to complete
  Promise.all(compressionPromises)
    .then(() => {
      next();
    })
    .catch(err => {
      console.error('Error during image compression:', err);
      next(); // Continue even if compression fails
    });
};

// Helper function to delete image files
const deleteImageFiles = async (imageAttachments) => {
  if (!imageAttachments || imageAttachments.length === 0) return;
  
  for (const image of imageAttachments) {
    try {
      // Handle different image object formats
      let filename;
      if (typeof image === 'string') {
        // If image is a path string
        filename = path.basename(image);
      } else if (image.filename) {
        // If image has filename property
        filename = image.filename;
      } else if (image.path) {
        // If image has path property
        filename = path.basename(image.path);
      } else {
        console.error('Unknown image format:', image);
        continue;
      }
      
      const filePath = path.join(uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted image file: ${filename}`);
      } else {
        console.log(`Image file not found: ${filename}`);
      }
    } catch (err) {
      console.error(`Error deleting image file:`, err);
    }
  }
};

module.exports = { upload, compressAndProcessUpload, deleteImageFiles };
