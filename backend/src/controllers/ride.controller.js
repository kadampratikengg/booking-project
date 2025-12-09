const Ride = require('../models/Ride');
const Driver = require('../models/Driver');
const User = require('../models/User');
const { calculateFare } = require('../utils/fare');
const { io } = require('../socket'); // socket instance

// Request a ride (customer)
exports.requestRide = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { pickup, drop } = req.body;
    // distance calculation would normally use Google Maps -> here require distanceKm provided
    const distanceKm = req.body.distanceKm;
    const vehicleType = req.body.vehicleType || 'bike';

    const fareData = await calculateFare(vehicleType, distanceKm);

    const ride = await Ride.create({
      customer: customerId,
      pickup,
      drop,
      distanceKm,
      baseFare: fareData.baseFare,
      platformFeeCustomer: fareData.platformFeeCustomer,
      platformFeeDriver: fareData.platformFeeDriver,
      totalFareCustomer: fareData.totalFareCustomer,
      status: 'requested'
    });

    // Emit event to nearby drivers via socket
    // We'll use simple broadcast; in production you'd query location and emit to specific rooms
    io.emit('ride-request', { rideId: ride._id, pickup, drop, vehicleType, requestedAt: ride.requestedAt });

    res.json({ ride, fareData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// When driver accepts the ride (first-come wins)
exports.driverAccept = async (req, res) => {
  const driverId = req.user.id;
  const { rideId } = req.body;
  try {
    const ride = await Ride.findById(rideId).populate('driver');
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    if (ride.status !== 'requested') return res.status(400).json({ message: 'Ride already assigned' });

    // Check driver eligibility
    const driver = await Driver.findById(driverId);
    if (!driver.active) return res.status(403).json({ message: 'Driver not active' });
    if (driver.walletBalance < 100) return res.status(403).json({ message: 'Insufficient wallet balance (<₹100)' });
    if (driver.hasOpenComplaint) return res.status(403).json({ message: 'Open complaint exists' });

    // Atomically assign driver: use findOneAndUpdate with status match
    const assigned = await Ride.findOneAndUpdate(
      { _id: rideId, status: 'requested' },
      { status: 'assigned', driver: driverId, acceptedAt: new Date() },
      { new: true }
    );
    if (!assigned) {
      return res.status(400).json({ message: 'Ride already accepted by another driver' });
    }

    // Notify customer and other drivers via socket
    io.to(`customer-${ride.customer}`).emit('ride-assigned', { rideId: assigned._id, driverId });
    io.emit('ride-accepted', { rideId: assigned._id, driverId });

    res.json({ assigned });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Start & complete ride endpoints (driver)
exports.startRide = async (req,res)=>{
  try{
    const driverId = req.user.id;
    const { rideId } = req.body;
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404);
    if (String(ride.driver) !== driverId) return res.status(403);
    ride.startedAt = new Date();
    ride.status = 'ongoing';
    await ride.save();
    io.to(`customer-${ride.customer}`).emit('ride-started', { rideId });
    res.json({ ride });
  } catch (err) { res.status(500).json({ message: 'error' }); }
};

exports.completeRide = async (req,res)=>{
  try{
    const driverId = req.user.id;
    const { rideId } = req.body;
    const ride = await Ride.findById(rideId).populate('customer');
    if (!ride) return res.status(404);
    if (String(ride.driver) !== driverId) return res.status(403);
    ride.completedAt = new Date();
    ride.status = 'completed';
    await ride.save();

    // Deduct platform fee (driver side) from wallet
    const DriverModel = require('../models/Driver');
    const driver = await DriverModel.findById(driverId);
    const platformDriverFee = ride.platformFeeDriver || 0;
    driver.walletBalance = +(driver.walletBalance - platformDriverFee).toFixed(2);
    await driver.save();

    // Record wallet transaction
    const WalletTransaction = require('../models/WalletTransaction');
    await WalletTransaction.create({
      driver: driver._id,
      type: 'debit',
      amount: platformDriverFee,
      description: 'Platform fee for ride ' + ride._id
    });

    io.to(`customer-${ride.customer._id}`).emit('ride-completed', { rideId });
    io.emit('ride-completed-all', { rideId });

    res.json({ ride });
  } catch (err) {
    console.error(err); res.status(500).json({ message: 'error' });
  }
};
