const Ride = require('../models/Ride');
const Invoice = require('../models/Invoice');
const Driver = require('../models/Driver');
const User = require('../models/User');
const { generateInvoicePDF } = require('../utils/pdf');
const { uploadFileBuffer } = require('../utils/s3'); // hypothetical

exports.generateInvoice = async (req,res) => {
  try {
    const { rideId } = req.params;
    const ride = await Ride.findById(rideId).populate('customer driver');
    if (!ride) return res.status(404).json({ message: 'ride not found' });
    const pdf = await generateInvoicePDF(ride, ride.driver, ride.customer);
    // upload to S3 and get URL
    const fileBuffer = require('fs').readFileSync(pdf.filepath);
    const s3Url = await uploadFileBuffer(pdf.filename, fileBuffer); // implement in s3 util

    const invoice = await Invoice.create({
      ride: ride._id,
      pdfUrl: s3Url,
      data: {
        baseFare: ride.baseFare, platformFeeCustomer: ride.platformFeeCustomer, total: ride.totalFareCustomer
      }
    });

    ride.invoice = invoice._id;
    await ride.save();

    res.json({ invoice });
  } catch (err) {
    console.error(err); res.status(500).json({ message: 'error' });
  }
};
