import mongoose from 'mongoose';

const validateObjectId = (paramName = 'id') => (req, res, next) => {
  const id = req.params[paramName];
  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: `Invalid ${paramName}: '${id}' is not a valid ID`,
    });
  }
  next();
};

export default validateObjectId;
