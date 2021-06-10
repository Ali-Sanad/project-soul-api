const Review = require("./../models/reviewModel");

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json({
      status: "sucess",
      results: reviews.length,
      reviews,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
};
exports.createReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(200).json({
      status: "sucess",
      review,
    });
  } catch (err) {
    console.log("err", err);
    res.status(400).json({ err: err.message });
  }
};
