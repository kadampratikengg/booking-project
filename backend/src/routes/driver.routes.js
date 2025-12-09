const router = require('express').Router();
const upload = require('../middleware/multer.middleware');
const { authMiddleware } = require('../middleware/auth.middleware');
const driverCtrl = require('../controllers/driver.controller');

router.get('/me', authMiddleware, driverCtrl.getDriverProfile);
router.post('/document', authMiddleware, upload.single('file'), driverCtrl.uploadDocument);

module.exports = router;
