const Driver = require('../models/Driver');
const WalletTransaction = require('../models/WalletTransaction');

exports.getWallet = async (req,res) => {
  const driverId = req.user.id;
  const driver = await Driver.findById(driverId);
  const txs = await WalletTransaction.find({ driver: driverId }).sort({ createdAt: -1 });
  res.json({ balance: driver.walletBalance, txs });
};

exports.simulateAddMoney = async (req,res) => {
  const { amount } = req.body;
  const driverId = req.user.id;
  if (!amount || amount < 100) return res.status(400).json({ message: 'Min add ₹100' });

  const driver = await Driver.findById(driverId);
  driver.walletBalance = +(driver.walletBalance + Number(amount)).toFixed(2);
  await driver.save();

  await WalletTransaction.create({
    driver: driver._id,
    type: 'credit',
    amount: Number(amount),
    description: 'Simulated add money'
  });

  res.json({ balance: driver.walletBalance });
};
