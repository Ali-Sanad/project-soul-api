const { Router } = require("express");
const router = Router();
const therapistAuthController = require("../controller/therapistAuthController");
const therapistProfileController = require("../controller/therapistProfileController");
const {
  requireAuth,
  checkUser,
} = require("./../middlewares/therapistAuthMiddleware");
router.get("/signup", therapistAuthController.signup_get);
router.post("/signup", therapistAuthController.signup_post);
router.get("/login", therapistAuthController.login_get);
router.post("/login", therapistAuthController.login_post);
router.get("/logout", therapistAuthController.logout_get);

router.get("/", therapistAuthController.getAllTherapists);
router.get("/:id", therapistAuthController.getOneTherapist);
router.patch("/updatatherapist/:id", therapistAuthController.updataTherapist);
router.delete("/deletetherapist/:id", therapistAuthController.deleteTherapist);

module.exports = router;
