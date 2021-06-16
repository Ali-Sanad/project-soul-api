const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');
const {sendConfirmationEmail} = require('../utils/emails/nodemailer.config');

const User = require('../models/User');
const {userAuth, adminAuth} = require('../middlewares/auth');

//@ route          api/auth
//@descrption      user
//@access          private
//get authenticated user || admin data upon login
router.get('/', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

//@ route          POST   api/auth
//@descrption      authenticate and login user or admin & get his\her token
//@access          Public
router.post(
  '/',
  [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    console.log('login');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;
    try {
      //see if user exist
      let user = await User.findOne({email});
      if (!user) {
        return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
      }

      //check if email is verified or not :)
      if (user.status !== 'Active') {
        return res.status(401).send({
          message: 'Pending Account. Please Verify Your Email!',
        });
      }

      //return JWT
      const payload = {
        user: {
          id: user.id,
          isAdmin: user.isAdmin,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {expiresIn: 36000},
        (err, token) => {
          if (err) throw err;
          if (user.isAdmin) {
            res.status(200).json({msg: 'Admin logged in successfully', token});
          }
          res.status(200).json({msg: 'User logged in successfully', token});
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

//get user by id -- authenication needed here ###
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({message: 'User Not found.'});
    }
    res.status(200).json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
