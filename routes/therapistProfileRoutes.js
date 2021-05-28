const { Router } = require("express");
const router = Router();
//const therapistAuthController = require("../controller/therapistAuthController");
const therapistProfileController = require("../controller/therapistProfileController");
const {
  requireAuth,
  checkUser,
} = require("../middlewares/therapistAuthMiddleware");

router.put(
  "/updateExperince",
  requireAuth,
  therapistProfileController.updateExperince
);
router.delete(
  "/deleteExperience/:exp_id",
  requireAuth,

  therapistProfileController.deleteExperience
);
router.put(
  "/updateEducation",
  requireAuth,
  therapistProfileController.updateEducation
);
router.delete(
  "/deleteEducation/:edu_id",
  requireAuth,

  therapistProfileController.deleteEducation
);
router.post(
  "/addSocialMedia",
  requireAuth,

  therapistProfileController.socialMediaData
);

router.get("/myprofile", requireAuth, therapistProfileController.getmyprofile);
router.post("/uploadImg", requireAuth, therapistProfileController.uploadImg);
module.exports = router;
