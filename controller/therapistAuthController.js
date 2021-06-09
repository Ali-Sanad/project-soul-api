const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Therapist = require("../models/TherapistModel");
const APIFeatures = require("../utils/APIFeatures");
const sendEmail = require("../utils/email");

const handleErrors = (err) => {
  let errors = {
    // fname: "",
    // lname: "",
    // email: "",
    // password: "",
    // confirmPassword: "",
  };
  //duplicateerror code
  if (err.code === 11000) {
    errors.err = "email already exist..";
    return errors;
  }

  if (err.message.includes("you are not allowed to log in now")) {
    errors.err = "you are not allowed to log in nowd";
  }
  //incorrect email or password
  if (err.message.includes("incorrect email or password")) {
    errors.err = "incorrect email or password";
  }

  //validation errors
  if (err.message.includes("Therapist validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};
const createToken = (id) => {
  //id
  const payload = {
    therapistId: id,
  };
  // const maxAge = Date.now() + 3 * 24 * 60 * 60;
  return jwt.sign(payload, "mySecretJWT", {
    expiresIn: "5d",
  });
};

module.exports.signup_post = async (req, res) => {
  const { fname, lname, email, password, confirmPassword } = req.body;
  try {
    const therapist = await Therapist.create({
      fname,
      lname,
      email,
      password,
      confirmPassword,
    });
    const token = createToken(therapist._id);
    console.log("token", token);
    sendEmail();
    res.status(201).json({ token });
  } catch (err) {
    console.log("catch");
    const errors = handleErrors(err);
    // console.log(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const therapist = await Therapist.login(email, password);
    const token = createToken(therapist._id);

    res.status(200).json({ token });
  } catch (err) {
    //const errors = handleErrors(err);
    console.log("catch");
    const errors = handleErrors(err);
    // // console.log(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {};
module.exports.forgotPassword = async (req, res) => {
  try {
    console.log("forget");
    //get user baset on posted email
    const therapist = await Therapist.findOne({ email: req.body.email });
    if (!therapist) {
      res.status(404).json({ err: "there is no user with email address " });
    }
    //generateToken
    const resetToken = therapist.createPasswordResetToken();
    await therapist.save({ validateBeforeSave: false });
    // res.status(200).json({ resetToken });

    //send email

    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/therapist/resetpassword/${resetToken}`;
    console.log(resetURL);
    const message = `Forget ypur password ? dubmti a request with your new password and confirm to :
      ${resetURL}.\n if you didnt forget please ignore email`;
    await sendEmail({
      email: req.body.email,
      subject: "your passwud reset token in 10 min",
      message,
    });

    res.status(200).json({
      status: "sucss",
      message: "token sent to email",
    });
  } catch (err) {
    console.log("errr", err);
    // therapist.passwordResetToken = undefined;
    //therapist.passwordResetExpires = undefined;
    res.status(400).json({ err });
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    //get user based on token

    const hasedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const therapist = await Therapist.findOne({
      passwordResetToken: hasedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    //if token has not expires and ther ie a user  set new password
    if (!therapist) {
      res.status(400).json({ err: "token is invaled or has expired" });
    }
    therapist.password = req.body.password;
    therapist.confirmPassword = req.body.confirmPassword;
    therapist.passwordResetToken = undefined;
    therapist.passwordResetExpires = undefined;
    await therapist.save();
    //update changef password At
    //log ther usrt in send jwt

    const token = createToken(therapist._id);
    res.status(200).json({ therapist });
  } catch (err) {
    res.status(400).json({ err });
  }
};
module.exports.getAllTherapists = async (req, res) => {
  try {
    const features = new APIFeatures(Therapist.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const therapists = await features.query;
    //send response

    res.status(200).json({
      status: "sucscess",
      results: therapists.length,
      therapists: therapists,
    });
  } catch (err) {
    const errors = handleErrors(err);
    console.log(err);
    res.status(400).json({ errors });
  }
};

module.exports.getOneTherapist = async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.params.id);
    if (therapist) {
      res.status(200).json({
        status: "sucscess",

        therapist: therapist,
      });
    }
    throw Error("that Therapist not exist");
  } catch (err) {
    const errors = handleErrors(err);
    console.log(err);
    res.status(400).json({ errors });
  }
};

module.exports.updataTherapist = async (req, res) => {
  try {
    const therapist = await Therapist.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (therapist) {
      res.status(200).json({
        status: "sucscess",

        therapist: therapist,
      });
    }
    throw Error("that Therapist not exist");
  } catch (err) {
    const errors = handleErrors(err);
    console.log(err);
    res.status(400).json({ errors });
  }
};
module.exports.deleteTherapist = async (req, res) => {
  try {
    const therapist = await Therapist.findByIdAndDelete(req.params.id);
    if (therapist) {
      res.status(200).json({
        status: "sucscess",

        therapist: therapist,
      });
    }
    throw Error("that Therapist not exist");
  } catch (err) {
    const errors = handleErrors(err);
    console.log(err);
    res.status(400).json({ errors });
  }
};
