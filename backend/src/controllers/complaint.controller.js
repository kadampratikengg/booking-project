const Complaint = require('../models/Complaint');
const Driver = require('../models/Driver');
const { uploadToS3 } = require('../utils/s3');

exports.createComplaint = async (req,res) => {
  try {
    const { rideId, type, description } = req.body;
    const customerId = req.user.id;
    const ride = await require('../models/Ride').findById(rideId);
    if (!ride) return res.status(404).json({ message: 'ride not found' });

    let attachmentUrl;
    if (req.file){
      attachmentUrl = await uploadToS3(req.file);
    }

    const complaint = await Complaint.create({
      ride: ride._id,
      customer: customerId,
      driver: ride.driver,
      type, description, attachmentUrl
    });

    // mark driver hasOpenComplaint
    if (ride.driver) {
      await Driver.findByIdAndUpdate(ride.driver, { hasOpenComplaint: true });
    }

    res.json({ complaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'error' });
  }
};

exports.resolveComplaint = async (req,res) => {
  const { id } = req.params;
  const { action } = req.body; // resolve, reject
  const complaint = await Complaint.findById(id);
  if (!complaint) return res.status(404);
  complaint.status = action === 'resolve' ? 'resolved' : 'rejected';
  complaint.resolvedAt = new Date();
  await complaint.save();
  // If resolved, clear driver's complaint flag
  if (complaint.driver && complaint.status === 'resolved') {
    await Driver.findByIdAndUpdate(complaint.driver, { hasOpenComplaint: false });
  }
  res.json({ complaint });
};
