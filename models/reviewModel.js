const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review cant be empty"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    therapist: {
      type: mongoose.Schema.ObjectId,
      ref: "Therapist",
      required: [true, "review must belongs to a therapist "],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "review must belongs to  a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: {
      virtuals: true,
    },
  }
);
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
