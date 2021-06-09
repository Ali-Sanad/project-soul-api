const nodemailer = require("nodemailer");

const email = () => {
  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: "yasminfathyiti@outlook.com",
      pass: "Yasmin123",
    },
  });
  const options = {
    from: "yasminfathyiti@outlook.com",
    to: "yasminfathy630@gmail.com",
    subject: "Hii subject",
    text: "hii text",
    // text:htmlToText.fromString(html);
  };
  transporter.sendMail(options, function (error, info) {
    if (error) {
      console.log("mial error", error.toString());
      return;
    } else {
      console.log("info", info.response);
    }
  });
};
module.exports = email;
