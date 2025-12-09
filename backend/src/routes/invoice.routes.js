const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const invoiceCtrl = require('../controllers/invoice.controller');

router.post('/:rideId/generate', authMiddleware, invoiceCtrl.generateInvoice);
module.exports = router;
