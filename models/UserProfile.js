const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
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
    sessions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',
        },
        doctor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'doctors',
        },
        from: {
          type: Date,
        },
        to: {
          type: Date,
        },
        fees: {
          type: Number,
        },
        duration: {
          type: Number,
        },
      },
    ],
  },
  {timestamps: true}
);

module.exports = mongoose.model('profile', ProfileSchema);
