const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const upload = require('../middleware/multer.middleware');
const complaintCtrl = require('../controllers/complaint.controller');

router.post('/', authMiddleware, upload.single('file'), complaintCtrl.createComplaint);
router.post('/:id/resolve', authMiddleware, complaintCtrl.resolveComplaint);

module.exports = router;
