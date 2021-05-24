const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');

const User = require('../models/User');
const Profile = require('../models/UserProfile');
const {userAuth, adminAuth} = require('../middlewares/auth');

//@ route          POST   api/admins
//@descrption      Register admin
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

    const {name, email, password} = req.body;
    try {
      //see if admin exist
      let user = await User.findOne({email});
      if (user) {
        return res.status(400).json({errors: [{msg: 'Admin  already exists'}]});
      }

      user = new User({
        name,
        email,
        password,
        isAdmin: true,
      });

      //encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

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
          res.status(200).json({token});
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

//@ route         GET api/admins
//@descrption      get all users
//@access          private
router.get('/', adminAuth, async (req, res) => {
  try {
    const users = await User.find({isAdmin: false});
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//@ route         GET api/admins/user-profiles
//@descrption      get all user  profiles
//@access          private
router.get('/user-profiles', adminAuth, async (req, res) => {
  try {
    const profiles = await Profile.find({}).populate('user', [
      'name',
      'email',
      'image',
      'isAdmin',
    ]);

    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//@ route         GET api/admins/user/:user_id
//@descrption      get profile by user_id
//@access          private
router.get('/user/:user_id', adminAuth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'email', 'image', 'isAdmin']);

    if (!profile) return res.status(400).json({msg: 'Profile not found'});
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({msg: 'Profile not found'});
    }
    res.status(500).send('Server error');
  }
});

//@ route         DELETE api/admins/user-profile
//@descrption      delete user profile , user & posts
//@access          private
router.delete('/user-profile/:user_id', adminAuth, async (req, res) => {
  try {
    //remove user posts @todo
    // await Post.deleteMany({user: req.params.user_id});
    //remove profile
    await Profile.findOneAndDelete({user: req.params.user_id});
    //remove user
    await User.findOneAndDelete({_id: req.params.user_id});

    res.json({msg: 'User deleted'});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//@admin dashboard @TO DO

module.exports = router;
