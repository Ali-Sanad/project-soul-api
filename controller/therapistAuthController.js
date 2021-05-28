const jwt = require("jsonwebtoken");
//const cookiePareser = require("cookie-parser");
//const express = require("express");

const Therapist = require("../models/TherapistModel");
const APIFeatures = require("../utiles/APIFeatures");
//const app = express();
//app.use(cookiePareser());

const handleErrors = (err) => {
  // console.log("err", err.errors);
  //console.log(err.message, err.code);
  let errors = {
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  //duplicateerror code
  if (err.code === 11000) {
    errors.email = "email already exist..";
    return errors;
  }

  if (err.message.includes("you are not allowed to log in now")) {
    // errors.email = "you are not allowed to log in now";
    errors.password = "you are not allowed to log in nowd";
  }
  //incorrect email or password
  if (err.message.includes("incorrect email or password")) {
    // errors.email = "incorrect email or password";
    errors.password = "incorrect email or password";
  }

  //validation errors
  if (err.message.includes("Therapist validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};
const createToken = (therapist) => {
  //id
  const payload = {
    therapist,
  };
  // const maxAge = Date.now() + 3 * 24 * 60 * 60;
  return jwt.sign(payload, "mySecretJWT", {
    //{id}=>payload
    expiresIn: "5d",
  });
};
module.exports.signup_get = (req, res) => {
  res.render("signup");
};
module.exports.login_get = (req, res) => {
  res.render("login");
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
    const token = createToken(therapist); //therapist._id
    console.log("token", token);
    // const cookieOptions = {
    //   expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    //   httpOnly: true,
    // };
    // console.log("token", token);
    // res.cookie("jwt", token, cookieOptions);

    // res.cookie("jwt", token, { httpOnly: false, maxAge: maxAge * 1000 });
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
    const token = createToken(therapist);
    // const cookieOptions = {
    //   expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    //   httpOnly: true,
    // };
    // console.log("token", token);
    // res.cookie("jwt", token, cookieOptions);
    res.status(200).json({ token });
  } catch (err) {
    const errors = handleErrors(err);
    console.log(err);
    res.status(400).json({ errors });
  }
};
module.exports.logout_get = (req, res) => {
  // res.cookie("jwt", "", { maxAge: 1 });
  // res.redirect("/");
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
