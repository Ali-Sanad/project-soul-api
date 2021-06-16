const mongoose = require("mongoose");
const Therapist = require("./TherapistModel");
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
reviewSchema.pre(/^find/, function (next) {
  // this.populate({ path: "therapist", select: "fname lname" }).populate({
  //   path: "user",
  //   select: "name",
  // }); //name photo

  this.populate({
    path: "user",
    select: "name",
  }); //name photo
  next();
});
reviewSchema.statics.calcAverageRatings = async function (therapistId) {
  console.log("THer", therapistId);
  const stats = await this.aggregate([
    {
      $match: { therapist: therapistId },
    },
    {
      $group: {
        _id: "$therapist",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  await Therapist.findByIdAndUpdate(therapistId, {
    ratingsAverage: stats[0].nRating,
    ratingsQunatity: stats[0].avgRating,
  }),
    console.log(stats);
};
reviewSchema.post("save", function () {
  console.log("post");
  //this point to current review
  this.constructor.calcAverageRatings(this.therapist);
  // next();
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
