// booking-project/backend/src/validators/ride.validator.js

import Joi from "joi";

export const coordinateSchema = Joi.object({
  latitude: Joi.number().required().min(-90).max(90),
  longitude: Joi.number().required().min(-180).max(180),
});

export const rideRequestValidator = Joi.object({
  customerId: Joi.string().hex().length(24).required(),
  pickup: coordinateSchema.required(),
  drop: coordinateSchema.required(),
  distanceKm: Joi.number().min(0.1).required(),
  vehicleType: Joi.string().valid("bike", "auto", "car").required(),
});

export const rideAcceptValidator = Joi.object({
  rideId: Joi.string().hex().length(24).required(),
  driverId: Joi.string().hex().length(24).required(),
});

export const rideCompleteValidator = Joi.object({
  rideId: Joi.string().hex().length(24).required(),
  driverInvoiceImage: Joi.string().uri().required(),
});
