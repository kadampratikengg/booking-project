// Minimal examples. Replace with actual AWS S3 code for production.

async function uploadToS3(file) {
    // file: multer memory file
    // in production upload to S3 and return URL. For dev, write file to /uploads
    const fs = require('fs'), path = require('path');
    const filename = `${Date.now()}-${file.originalname}`;
    const folder = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(path.join(folder, filename), file.buffer);
    return `/uploads/${filename}`;
  }
  
  async function uploadFileBuffer(filename, buffer) {
    const fs = require('fs'), path = require('path');
    const folder = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(path.join(folder, filename), buffer);
    return `/uploads/${filename}`;
  }
  
  module.exports = { uploadToS3, uploadFileBuffer };
  