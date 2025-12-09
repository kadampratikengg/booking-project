const Driver = require('../models/Driver');
const VehicleDocument = require('../models/VehicleDocument');
const { uploadToS3 } = require('../utils/s3');

exports.uploadDocument = async (req, res) => {
  // multer memory file at req.file, plus body fields type, number, startDate, expiryDate
  try {
    const driverId = req.user.id;
    const { type, number, startDate, expiryDate } = req.body;
    if (!req.file) return res.status(400).json({ message: 'File required' });
    // upload file (here we store as base64 in example)
    const fileBuffer = req.file.buffer;
    // in production upload to s3 and get url
    const fileUrl = await uploadToS3(req.file); // utility returns url
    const doc = await VehicleDocument.create({
      driver: driverId, type, fileUrl, number, startDate, expiryDate
    });
    const driver = await Driver.findById(driverId);
    driver.documents.push(doc._id);
    driver.docStatus = 'pending';
    driver.active = false;
    await driver.save();

    res.json({ doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDriverProfile = async (req,res) => {
  const driver = await Driver.findById(req.user.id).populate('documents');
  res.json({ driver });
};
