const { Router } = require("express");
const reviewController = require("../controller/reviewController");
//const { therapistAuth } = require("./../middlewares/therapistAuthMiddleware");
const { userAuth } = require("./../middlewares/auth");
const router = Router({ mergeParams: true });
//POST /tour/23242dd3/reviews
//post/reviews
router.post("/", userAuth, reviewController.createReview);
router.get("/", reviewController.getAllReviews);
//router.post("/", therapistAuth, reviewControllew.createReview);

module.exports = router;
