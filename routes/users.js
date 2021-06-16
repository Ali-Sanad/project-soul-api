const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
require('dotenv').config();
const {check, validationResult} = require('express-validator');
const {transport} = require('../utils/emails/nodemailer.config');
const {confirmEmail} = require('../utils/emails/confirm');
const {resetPassword} = require('../utils/emails/reset-password');
const {contactUs} = require('../utils/emails/contact-us');

const User = require('../models/User');
const {userAuth} = require('../middlewares/auth');

//@ route          POST   api/users
//@descrption      Register user
//@access          Public

router.post(
  '/',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password should be 6 characters or more').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    let {name, email, password} = req.body;
    try {
      //see if user exist
      let user = await User.findOne({email});
      if (user) {
        return res.status(400).json({errors: [{msg: 'User  already exists'}]});
      }

      //encrypt password
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);

      //create new user
      //save the user data to database
      user = await User.create({
        name: name,
        email: email,
        password: password,
      });

      //create token
      const token = jwt.sign(
        {_id: user._id, isAdmin: user.isAdmin},
        config.get('jwtSecret')
      );
      const confirmLink = `${process.env.API_URI}/api/users/confirm-user-email/${token}`;
      //send email to compelete regiseration
      await transport.sendMail({
        from: `Soul-Team 👻 <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Please confirm your account',
        html: confirmEmail(name, email, confirmLink),
      });

      res.status(200).send({
        token,
        message: 'User was registered successfully! Please check your email',
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

//confimation user's email route
router.get('/confirm-user-email/:token', async (req, res) => {
  try {
    const {token} = req.params;
    const {_id} = await jwt.verify(token, config.get('jwtSecret'));
    const user = await User.findById(_id).select('-password');
    if (!user) {
      return res.status(404).send({message: 'User Not found.'});
    }

    //update user email status
    user.status = 'Active';
    await user.save();
    //redirect to home page after email verified
    // res.redirect(`${process.env.API_URI}/emailVerified`);

    res.status(200).send({
      message: 'User is confirmed successfully',
      user,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});
module.exports = router;
