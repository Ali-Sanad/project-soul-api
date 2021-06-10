const {Router} = require('express');
const router = Router();
const therapistAuthController = require('../controller/therapistAuthController');
const therapistProfileController = require('../controller/therapistProfileController');
const {therapistAuth} = require('./../middlewares/therapistAuthMiddleware');

router.post('/signup', therapistAuthController.signup_post);
router.post('/login', therapistAuthController.login_post);

router.get('/', therapistAuthController.getAllTherapists);
router.get('/:id', therapistAuthController.getOneTherapist);
router.patch('/updatatherapist/:id', therapistAuthController.updataTherapist);
router.delete('/deletetherapist/:id', therapistAuthController.deleteTherapist);

module.exports = router;