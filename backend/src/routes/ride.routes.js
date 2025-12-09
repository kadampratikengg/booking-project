const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const rideCtrl = require('../controllers/ride.controller');

router.post('/request', authMiddleware, rideCtrl.requestRide);
router.post('/accept', authMiddleware, rideCtrl.driverAccept);
router.post('/start', authMiddleware, rideCtrl.startRide);
router.post('/complete', authMiddleware, rideCtrl.completeRide);

module.exports = router;
