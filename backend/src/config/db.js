const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Force IPv4 by converting localhost → 127.0.0.1
    let uri = process.env.MONGO_URI;
    if (uri.includes("localhost")) {
      uri = uri.replace("localhost", "127.0.0.1");
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      family: 4 // <-- forces IPv4 instead of IPv6 (::1)
    });

    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error', err);
    process.exit(1);
  }
};

module.exports = { connectDB };
