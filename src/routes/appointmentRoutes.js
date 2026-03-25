import express from 'express';
import validateObjectId from '../middleware/validateObjectId.js';
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

router.route('/').get(getAppointments).post(createAppointment);

router.route('/availability/:date').get(getAvailableSlots);

router.route('/confirmation/:confirmationNumber').get(getAppointmentByConfirmation);

router.route('/:id/status').all(validateObjectId('id')).put(updateAppointmentStatus);

router
  .route('/:id')
  .all(validateObjectId('id'))
  .get(getAppointmentById)
  .put(updateAppointment)
  .delete(cancelAppointment);

export default router;
