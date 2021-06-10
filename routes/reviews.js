const { Router } = require("express");
const router = Router();
const reviewController = require("../controller/reviewController");
//const { therapistAuth } = require("./../middlewares/therapistAuthMiddleware");
const { userAuth } = require("./../middlewares/auth");

router.get("/", reviewController.getAllReviews);
router.post("/", reviewController.createReview);
//router.post("/", therapistAuth, reviewControllew.createReview);

module.exports = router;
