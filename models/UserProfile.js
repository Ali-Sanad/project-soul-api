const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    dob: Date,

    wallet: {
      type: Number,
      default: 0,
    },
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'appointment',
      },
    ],
  },
  {timestamps: true}
);

module.exports = mongoose.model('user-profile', UserProfileSchema);
