// booking-project/backend/src/middleware/rateLimit.middleware.js

import rateLimit from "express-rate-limit";

// OTP rate limit: prevent abuse
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // max 5 OTP requests
  message: {
    status: false,
    message: "Too many OTP requests, try again after 10 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth login limit
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    status: false,
    message: "Too many login attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Ride Booking API limit
export const rideBookingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: {
    status: false,
    message: "Too many ride requests. Please wait and try again.",
  },
});
