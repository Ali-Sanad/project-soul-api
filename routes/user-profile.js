const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const {userAuth} = require('../middlewares/auth');

const Profile = require('../models/UserProfile');
const User = require('../models/User');

//@ route         GET api/user-profile/me
//@descrption      get user's profile
//@access          private
router.get('/me', userAuth, async (req, res) => {
  try {
    const profile = await Profile.findOne({user: req.user.id})
      .populate('user', ['name', 'email', 'image'])
      .populate('appointments');

    if (!profile) {
      return res.status(400).send({msg: 'There is no profile for this user'});
    }
    res.send(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//@ route         POST api/user-profile/
//@descrption      create or update user's profile
//@access          private
router.post('/', userAuth, async (req, res) => {
  const {name, email, phone, gender, dob, ...rest} = req.body;

  const loggedUser = await User.findOne({_id: req.user.id});
  // console.log(loggedUser);

  const currentProfile = await Profile.findOne({user: req.user.id});
  // build a profile
  const profileFields = {
    user: req.user.id,
    phone: !phone ? currentProfile.phone : phone,
    gender: !gender ? currentProfile.gender : gender,
    dob: !dob ? currentProfile.dob : dob,
    ...rest,
  };

  //update user data
  const userFields = {
    name: !name ? loggedUser.name : name,
    email: !email ? loggedUser.email : email,
    ...rest,
  };

  try {
    //upsert creates new doc if no match is found
    profile = await Profile.findOneAndUpdate(
      {user: req.user.id},
      {$set: profileFields},
      {new: true, upsert: true, setDefaultsOnInsert: true}
    );

    user = await User.findByIdAndUpdate(
      {_id: req.user.id},
      {$set: userFields},
      {new: true, upsert: true, setDefaultsOnInsert: true}
    );

    res.json({profile: profile, user: user});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//@ route         DELETE api/user-profile
//@descrption      delete profile , user & posts
//@access          private
router.delete('/', userAuth, async (req, res) => {
  try {
    //remove user posts @todo
    // await Post.deleteMany({user: req.user.id});
    //remove profile
    await Profile.findOneAndDelete({user: req.user.id});
    //remove user
    await User.findOneAndDelete({_id: req.user.id});

    res.json({msg: 'User deleted'});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
