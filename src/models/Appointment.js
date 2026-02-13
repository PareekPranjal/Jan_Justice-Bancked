import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    serviceType: {
      type: String,
      required: [true, 'Please select a service type'],
      enum: ['legal', 'career'],
    },
    serviceTitle: {
      type: String,
      required: true,
    },
    servicePrice: {
      type: Number,
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Please select an appointment date'],
    },
    appointmentTime: {
      type: String,
      required: [true, 'Please select an appointment time'],
    },
    clientName: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
    },
    clientEmail: {
      type: String,
      required: [true, 'Please provide your email address'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    clientPhone: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot be more than 500 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    confirmationNumber: {
      type: String,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate confirmation number before saving
appointmentSchema.pre('save', function (next) {
  if (!this.confirmationNumber) {
    const prefix = this.serviceType === 'legal' ? 'LGL' : 'CAR';
    const random = Math.floor(100000 + Math.random() * 900000);
    this.confirmationNumber = `${prefix}-${random}`;
  }
  next();
});

// Index for efficient querying
appointmentSchema.index({ clientEmail: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1, appointmentDate: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
