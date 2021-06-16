const { Router } = require("express");
const router = Router();
const therapistAuthController = require("../controller/therapistAuthController");
const therapistProfileController = require("../controller/therapistProfileController");
const { therapistAuth } = require("./../middlewares/therapistAuthMiddleware");
// const reviewController = require("../controller/reviewController");
const { userAuth } = require("../middlewares/auth");
const reviewRouter = require("../routes/reviews");

//POST /tour/23242dd3/reviews
//Get/tour/23242dd3/reviews
//GET /tour/23242dd3/reviews/232d4

//router.post("/:therapistId/reviews", userAuth, reviewController.createReview);

//router.get("/:therapistId/reviews");
router.use("/:therapistId/reviews", reviewRouter);
router.get("/me", therapistAuth, therapistAuthController.loadTherapist);
router.post("/signup", therapistAuthController.signup_post);
router.post("/login", therapistAuthController.login_post);

router.get("/logout", therapistAuthController.logout_get);

router.post("/forgotpassword", therapistAuthController.forgotPassword);
router.patch("/resetpassword/:token", therapistAuthController.resetPassword);
router.patch(
  "/updatemypassword",
  therapistAuth,
  therapistAuthController.updatePassword
);
router.get(
  "/top-5-rated",
  therapistAuthController.aliasTopRatedTherapist,
  therapistAuthController.getAllTherapists
);

router.get("/", therapistAuthController.getAllTherapists);
router.get("/:id", therapistAuthController.getOneTherapist);
router.patch("/updatatherapist/:id", therapistAuthController.updataTherapist);
router.delete("/deletetherapist/:id", therapistAuthController.deleteTherapist);

module.exports = router;
