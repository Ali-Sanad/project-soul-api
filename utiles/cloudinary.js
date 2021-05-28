require("dotenv").config();
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "soulproject",
  api_key: "246135134713211",
  api_secret: "3-p6qiEC208_K3r0yMJ9J8UO9GU",
  // cloud_name: process.env.CLOUDINARY_NAME,
  //  api_key: process.env.CLOUDINARY_API_KEY,
  //api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = { cloudinary };
