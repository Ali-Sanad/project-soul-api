const Review = require("./../models/reviewModel");

exports.getAllReviews = async (req, res) => {
  try {
    let filter = {};
    if (req.params.therapistId) filter = { therapist: req.params.therapistId };
    const reviews = await Review.find(filter);
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
    console.log("req.user", req.user);
    //allow nested routes

    if (!req.body.therapist) req.body.therapist = req.params.therapistId;
    if (!req.body.user) req.body.user = req.user.id;
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
