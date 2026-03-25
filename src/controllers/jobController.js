import Job from '../models/Job.js';
import cloudinary from '../config/cloudinary.js';

// Upload buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    stream.end(fileBuffer);
  });
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  try {
    const { department, company, employmentType, page, limit, search } = req.query;

    const filter = { isActive: true };

    if (department) filter.department = department;
    if (company) filter.company = company;
    if (employmentType) filter.employmentType = employmentType;

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } },
        { department: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(limit) || 10));
    const skip = (pageNum - 1) * pageSize;

    const [jobs, total] = await Promise.all([
      Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize),
      Job.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / pageSize),
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (you can add authentication later)
export const createJob = async (req, res) => {
  try {
    const jobData = { ...req.body };

    // Parse JSON strings from FormData
    const jsonFields = ['qualifications', 'responsibilities', 'benefits', 'skills', 'salary', 'experienceRequired', 'tabs', 'sidebarFields', 'customInputs'];
    for (const field of jsonFields) {
      if (typeof jobData[field] === 'string') {
        try { jobData[field] = JSON.parse(jobData[field]); } catch (e) { /* keep as string */ }
      }
    }

    // Handle file uploads to Cloudinary
    if (req.files) {
      if (req.files.pdf) {
        const pdfFile = req.files.pdf[0];
        const result = await uploadToCloudinary(pdfFile.buffer, {
          folder: 'jan-justice/pdfs',
          resource_type: 'raw',
          public_id: `${Date.now()}-${pdfFile.originalname.replace(/\.[^/.]+$/, '')}`,
        });
        jobData.jobDescriptionPdf = {
          url: result.secure_url,
          filename: pdfFile.originalname,
          size: pdfFile.size,
        };
      }
      if (req.files.image) {
        const imageFile = req.files.image[0];
        const result = await uploadToCloudinary(imageFile.buffer, {
          folder: 'jan-justice/images',
          resource_type: 'image',
        });
        jobData.companyImage = {
          url: result.secure_url,
          filename: imageFile.originalname,
          size: imageFile.size,
        };
      }
    }

    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid job data',
      error: error.message,
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private
export const updateJob = async (req, res) => {
  try {
    const jobData = { ...req.body };

    // Parse JSON strings from FormData
    const jsonFields = ['qualifications', 'responsibilities', 'benefits', 'skills', 'salary', 'experienceRequired', 'tabs', 'sidebarFields', 'customInputs'];
    for (const field of jsonFields) {
      if (typeof jobData[field] === 'string') {
        try { jobData[field] = JSON.parse(jobData[field]); } catch (e) { /* keep as string */ }
      }
    }

    // Handle file uploads to Cloudinary
    if (req.files) {
      if (req.files.pdf) {
        const pdfFile = req.files.pdf[0];
        const result = await uploadToCloudinary(pdfFile.buffer, {
          folder: 'jan-justice/pdfs',
          resource_type: 'raw',
          public_id: `${Date.now()}-${pdfFile.originalname.replace(/\.[^/.]+$/, '')}`,
        });
        jobData.jobDescriptionPdf = {
          url: result.secure_url,
          filename: pdfFile.originalname,
          size: pdfFile.size,
        };
      }
      if (req.files.image) {
        const imageFile = req.files.image[0];
        const result = await uploadToCloudinary(imageFile.buffer, {
          folder: 'jan-justice/images',
          resource_type: 'image',
        });
        jobData.companyImage = {
          url: result.secure_url,
          filename: imageFile.originalname,
          size: imageFile.size,
        };
      }
    }

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      jobData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid job data',
      error: error.message,
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};
