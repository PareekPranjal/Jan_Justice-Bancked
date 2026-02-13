import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a job title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    company: {
      type: String,
      required: [true, 'Please add a company name'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Please add a department'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    detailedDescription: {
      type: String,
      maxlength: [5000, 'Detailed description cannot be more than 5000 characters'],
    },
    responsibilities: [String],
    qualifications: [String],
    benefits: [String],
    location: {
      type: String,
      trim: true,
    },
    workMode: {
      type: String,
      enum: ['On-site', 'Remote', 'Hybrid'],
      default: 'On-site',
    },
    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'INR',
      },
    },
    experienceRequired: {
      min: Number,
      max: Number,
    },
    skills: [String],
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      default: 'Full-time',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicationDeadline: {
      type: Date,
    },
    contactEmail: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    contactPhone: {
      type: String,
    },
    companyWebsite: {
      type: String,
    },
    numberOfOpenings: {
      type: Number,
      default: 1,
    },
    education: {
      type: String,
    },
    jobDescriptionPdf: {
      url: String,
      filename: String,
      size: Number,
    },
    companyImage: {
      url: String,
      filename: String,
      size: Number,
    },
    tabs: [
      {
        id: { type: String, required: true },
        label: { type: String, required: true },
        order: { type: Number, default: 0 },
        isDefault: { type: Boolean, default: false },
        sections: [
          {
            id: { type: String, required: true },
            heading: String,
            subheading: String,
            order: { type: Number, default: 0 },
            contentType: {
              type: String,
              enum: ['fixed-field-map', 'custom-fields'],
              default: 'custom-fields',
            },
            fixedFieldKey: String,
            customFields: [
              {
                id: { type: String, required: true },
                label: String,
                fieldType: {
                  type: String,
                  enum: [
                    'text',
                    'number',
                    'textarea',
                    'richtext',
                    'dropdown-single',
                    'dropdown-multi',
                  ],
                  default: 'text',
                },
                value: mongoose.Schema.Types.Mixed,
                options: [String],
                order: { type: Number, default: 0 },
                required: { type: Boolean, default: false },
              },
            ],
          },
        ],
      },
    ],
    sidebarFields: [
      {
        id: { type: String, required: true },
        label: String,
        icon: String,
        fieldType: {
          type: String,
          enum: [
            'text',
            'number',
            'salary-range',
            'experience-range',
            'dropdown-single',
          ],
          default: 'text',
        },
        value: mongoose.Schema.Types.Mixed,
        fixedFieldKey: String,
        order: { type: Number, default: 0 },
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Text index for search
jobSchema.index({ title: 'text', company: 'text', department: 'text', location: 'text', description: 'text' });

const Job = mongoose.model('Job', jobSchema);

export default Job;
