const jwt = require("jsonwebtoken");
const Therapist = require("../models/TherapistModel");
const requireAuth = (req, res, next) => {
  //const token = req.cookies.jwt;
  const token = req.header("Authorization");
  console.log("tokennnn", token);
  //check web token exist and valid
  if (token) {
    jwt.verify(token, "mySecretJWT", (err, decoded) => {
      if (err) {
        console.log(err.message);
        //  res.redirect("/api/therapist/login");
        //res.redirect("/login");
      } else {
        // console.log("decodeddddd", decodedToken);
        req.therapist = decoded.therapist;
        //req.therapistId = decodedToken.id;
        next();
      }
    });
  } else {
    console.log("no jwt");
    //res.redirect("/login");
    //  res.redirect("/api/therapist/login");
  }
  // next();
};

//check user
const checkUser = (req, res, next) => {
  const token = req.header("Authorization");
  console.log("token in header", token);

  if (token) {
    jwt.verify(token, "mySecretJWT", async (err, decoded) => {
      if (err) {
        console.log(err.message);
        next();
      } else {
        req.therapist = decoded.therapist;

        next();
      }
    });
  } else {
    next();
  }
};
module.exports = { requireAuth, checkUser };
