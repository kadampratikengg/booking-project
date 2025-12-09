const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const walletCtrl = require('../controllers/wallet.controller');

router.get('/', authMiddleware, walletCtrl.getWallet);
router.post('/add', authMiddleware, walletCtrl.simulateAddMoney);

module.exports = router;
