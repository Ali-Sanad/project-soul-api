const jwt = require("jsonwebtoken");
const Therapist = require("../models/TherapistModel");

module.exports.therapistAuth = (req, res, next) => {
  // const token = req.header("Authorization");

  // //check web token exist and valid
  // if (token) {
  //   jwt.verify(token, "mySecretJWT", (err, decoded) => {
  //     if (err) {
  //       console.log(err.message);
  //     } else {
  //       req.therapistId = decoded.therapistId;
  //       next();
  //     }
  //   });
  // } else {
  //   console.log("no jwt");
  // }

  const token = req.header("Authorization");

  //check if there is no token
  if (!token) {
    return res.status(401).send({ msg: "No token, authorization denied" });
  }

  //verify token and unlock the payload(decoded)
  try {
    const decoded = jwt.verify(token, "mySecretJWT");

    //assign the payload(decoded)=> to req.user
    req.therapistId = decoded.therapistId;

    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

//check user
module.exports.checkUser = (req, res, next) => {
  const token = req.header("Authorization");

  if (token) {
    jwt.verify(token, "mySecretJWT", async (err, decoded) => {
      if (err) {
        console.log(err.message);
      } else {
        req.therapistId = decoded.therapistId;
        next();
      }
    });
  } else {
    // res.locals.therapist = null;
  }
};
