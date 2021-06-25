const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
  {
    therapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'therapist',
    },
    date: {
      type: String,
    },
    from: {
      type: String,
    },
    to: {
      type: String,
    },
    fees: {
      type: Number,
    },
    booking: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null,
      },

      isBooked: {
        type: Boolean,
        default: false,
      },
    },
  },
  {timestamps: true}
);

module.exports = mongoose.model('appointment', AppointmentSchema);
