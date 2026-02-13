import Appointment from '../models/Appointment.js';

// @desc    Get all appointments (with optional filters)
// @route   GET /api/appointments
// @access  Public
export const getAppointments = async (req, res) => {
  try {
    const { status, serviceType, email, startDate, endDate } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (serviceType) filter.serviceType = serviceType;
    if (email) filter.clientEmail = email.toLowerCase();

    // Date range filter
    if (startDate || endDate) {
      filter.appointmentDate = {};
      if (startDate) filter.appointmentDate.$gte = new Date(startDate);
      if (endDate) filter.appointmentDate.$lte = new Date(endDate);
    }

    const appointments = await Appointment.find(filter)
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching appointments',
    });
  }
};

// @desc    Get single appointment by ID
// @route   GET /api/appointments/:id
// @access  Public
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error('Error fetching appointment:', error);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching appointment',
    });
  }
};

// @desc    Get appointment by confirmation number
// @route   GET /api/appointments/confirmation/:confirmationNumber
// @access  Public
export const getAppointmentByConfirmation = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      confirmationNumber: req.params.confirmationNumber.toUpperCase(),
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found with this confirmation number',
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching appointment',
    });
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public
export const createAppointment = async (req, res) => {
  try {
    const {
      serviceType,
      serviceTitle,
      servicePrice,
      appointmentDate,
      appointmentTime,
      clientName,
      clientEmail,
      clientPhone,
      notes,
    } = req.body;

    // Check if the time slot is already booked
    const existingAppointment = await Appointment.findOne({
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked. Please select another time.',
      });
    }

    const appointment = await Appointment.create({
      serviceType,
      serviceTitle,
      servicePrice,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      clientName,
      clientEmail,
      clientPhone,
      notes,
    });

    res.status(201).json({
      success: true,
      data: appointment,
      message: `Appointment booked successfully! Your confirmation number is ${appointment.confirmationNumber}`,
    });
  } catch (error) {
    console.error('Error creating appointment:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating appointment',
    });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Public
export const updateAppointment = async (req, res) => {
  try {
    const {
      appointmentDate,
      appointmentTime,
      clientName,
      clientEmail,
      clientPhone,
      notes,
      status,
    } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // If updating date/time, check if new slot is available
    if (
      (appointmentDate && appointmentDate !== appointment.appointmentDate.toISOString()) ||
      (appointmentTime && appointmentTime !== appointment.appointmentTime)
    ) {
      const existingAppointment = await Appointment.findOne({
        _id: { $ne: req.params.id },
        appointmentDate: new Date(appointmentDate || appointment.appointmentDate),
        appointmentTime: appointmentTime || appointment.appointmentTime,
        status: { $in: ['pending', 'confirmed'] },
      });

      if (existingAppointment) {
        return res.status(400).json({
          success: false,
          message: 'This time slot is already booked. Please select another time.',
        });
      }
    }

    // Update fields
    if (appointmentDate) appointment.appointmentDate = new Date(appointmentDate);
    if (appointmentTime) appointment.appointmentTime = appointmentTime;
    if (clientName) appointment.clientName = clientName;
    if (clientEmail) appointment.clientEmail = clientEmail;
    if (clientPhone !== undefined) appointment.clientPhone = clientPhone;
    if (notes !== undefined) appointment.notes = notes;
    if (status) appointment.status = status;

    await appointment.save();

    res.status(200).json({
      success: true,
      data: appointment,
      message: 'Appointment updated successfully',
    });
  } catch (error) {
    console.error('Error updating appointment:', error);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating appointment',
    });
  }
};

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Public
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    appointment.status = 'cancelled';
    appointment.isActive = false;
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while cancelling appointment',
    });
  }
};

// @desc    Get available time slots for a specific date
// @route   GET /api/appointments/availability/:date
// @access  Public
export const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.params;
    const requestedDate = new Date(date);

    // All possible time slots
    const allSlots = [
      '09:00 AM',
      '10:30 AM',
      '12:00 PM',
      '01:30 PM',
      '03:00 PM',
      '04:30 PM',
    ];

    // Find booked slots for this date
    const bookedAppointments = await Appointment.find({
      appointmentDate: requestedDate,
      status: { $in: ['pending', 'confirmed'] },
    }).select('appointmentTime');

    const bookedSlots = bookedAppointments.map((apt) => apt.appointmentTime);

    // Filter out booked slots
    const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));

    res.status(200).json({
      success: true,
      data: {
        date: requestedDate,
        availableSlots,
        bookedSlots,
      },
    });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching available slots',
    });
  }
};

// @desc    Update appointment status only
// @route   PUT /api/appointments/:id/status
// @access  Public (should be protected with auth in production)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (pending, confirmed, completed, cancelled)',
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    appointment.status = status;
    if (status === 'cancelled') {
      appointment.isActive = false;
    }
    await appointment.save();

    res.status(200).json({
      success: true,
      data: appointment,
      message: 'Appointment status updated successfully',
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating appointment status',
    });
  }
};
