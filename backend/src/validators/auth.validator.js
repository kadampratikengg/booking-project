// booking-project/backend/src/validators/auth.validator.js

import Joi from "joi";

export const registerValidator = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  mobile: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  email: Joi.string().email().required(),
});

export const verifyOtpValidator = Joi.object({
  mobile: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  otp: Joi.string().length(6).required(),
});

export const loginValidator = Joi.object({
  mobile: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  otp: Joi.string().length(6).required(),
});

export const refreshTokenValidator = Joi.object({
  refreshToken: Joi.string().required(),
});
