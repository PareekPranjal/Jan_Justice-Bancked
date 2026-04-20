import express from 'express';
import validateObjectId from '../middleware/validateObjectId.js';
import { protect, adminOnly } from '../middleware/auth.js';
import {
  getAppointments,
  getAppointmentById,
  getAppointmentByConfirmation,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  cancelAppointment,
  getAvailableSlots,
} from '../controllers/appointmentController.js';

const router = express.Router();

// Admin: list all appointments. User: create their own.
router.route('/')
  .get(protect, adminOnly, getAppointments)
  .post(protect, createAppointment);

// Public: check availability and look up by confirmation number
router.route('/availability/:date').get(getAvailableSlots);
router.route('/confirmation/:confirmationNumber').get(getAppointmentByConfirmation);

// Admin-only: change appointment status
router.route('/:id/status').all(validateObjectId('id')).put(protect, adminOnly, updateAppointmentStatus);

// User (or admin): view, reschedule, or cancel a specific appointment
router
  .route('/:id')
  .all(validateObjectId('id'))
  .get(protect, getAppointmentById)
  .put(protect, updateAppointment)
  .delete(protect, cancelAppointment);

export default router;
