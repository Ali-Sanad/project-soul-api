///experience
//@route PUT api/profile/experience
//@descrption PUT therapist experiencs
//@ access private
//const jwt = require("jsonwebtoken");
const Therapist = require('../models/TherapistModel');
//const config = require("config");
// const {cloudinary} = require('../utiles/cloudinary');

module.exports.updateExperince = async (req, res, next) => {
  const {title, location, from, to} = req.body;

  const newExperience = {title, location, from, to};
  console.log('new', newExperience);
  try {
    const therapist = await Therapist.findById(req.therapist._id); //req.therapsitId
    console.log('th', therapist);
    therapist.experience.unshift(newExperience);
    await therapist.save();
    res.status(200).send('sucess');

    //res.json({ therapist });
  } catch (err) {
    console.error('err', err);
    res.status(500).send('server error');
  }
};

module.exports.deleteExperience = async (req, res) => {
  const exp_id = req.params.exp_id;
  console.log(exp_id);
  console.log(req.therapistId);
  try {
    const therapist = await Therapist.findOne({_id: req.therapist._id});
    console.log('ther', therapist);

    therapist.experience = therapist.experience.filter(
      (exp) => exp._id.toString() !== exp_id
    );

    await therapist.save();
    console.log('thh', therapist);
    console.log('save');
    return res.status(200).json({therapist});

    //res.send(therapist);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({err: 'Server error'});
  }
};

module.exports.updateEducation = async (req, res) => {
  try {
    const therapist = await Therapist.findOne({_id: req.therapist._id});

    therapist.education.unshift(req.body);

    await therapist.save();

    res.json({therapist});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports.deleteEducation = async (req, res) => {
  const edu_id = req.params.edu_id;
  console.log(edu_id);

  try {
    const therapist = await Therapist.findOne({_id: req.therapist._id});

    // const therapist = await Therapist.findOne({ therapist: req.therapist._id }); //////////////
    console.log('ther', therapist);

    therapist.education = therapist.education.filter(
      (edu) => edu._id.toString() !== edu_id
    );

    await therapist.save();
    console.log('save');
    return res.status(200).json({therapist});
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
};

module.exports.socialMediaData = async (req, res) => {
  try {
    // Using upsert option (creates new doc if no match is found):
    let therapist = await Therapist.findByIdAndUpdate(req.therapist._id, {
      socialLinks: req.body,
    });
    console.log('social', therapist);
    // console.log(req.therapistId);

    res.status(200).json({
      status: 'sucscess',
    });
  } catch (err) {
    console.error('errrmee', err.message);
    res.status(500).json({err: 'Server Error'});
  }
};

module.exports.getmyprofile = async (req, res) => {
  console.log('me');
  try {
    console.log('therapistt', req.therapist);
    const myprofile = await Therapist.findById(req.therapist._id); //req.therapsitId
    console.log('mw', myprofile);
    // res.send("hhhhhhh");

    res.status(200).json({
      status: 'sucscess',
      therapist: myprofile,
    });
  } catch (err) {
    console.log(123);
    console.error('err.mess', err.message);
    res.status(500).json({err});
  }
};

module.exports.uploadImg = async (req, res) => {
  const fileStr = req.body.data;
  console.log(fileStr);
  const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
    upload_preset: 'soul',
  });
  console.log(uploadedResponse);
  console.log(req.body.data);

  let url = '';
  if (!req.body.data) {
    url = '';
  } else {
    url = uploadedResponse.secure_url;
  }

  try {
    const therapist = await Therapist.findOneAndUpdate(
      {_id: req.therapist._id},
      {therapist_image_url: url},
      {new: true}
    );

    res.status(200).json(therapist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
