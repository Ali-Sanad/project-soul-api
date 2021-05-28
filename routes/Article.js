const express = require("express");
const router = express.Router();
// const { body, validationResult } = require("express-validator");
const Article = require("../models/Article");

const { userAuth, adminAuth } = require("../middlewares/auth");

const User = require("../models/User");

//@ route          GET   api/article
//@descrption      get all articles
//@access          Public
router.get("/", async (req, res) => {
  try {
    // sort to get latest articles
    const articles = await Article.find().sort({ date: "desc" });
    res.json(articles);
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ msg: "Server error" });
  }
});

//@ route          GET  api/article
//@descrption      get one article
//@access          Public
router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    res.json(article);
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ msg: "Server error" });
  }
});

//@ route          POST   api/article
//@descrption      post new article
//@access          private(just for therapist)

// will change userAuth to therapistAuth after it is ready
router.post("/", userAuth, async (req, res) => {
  const { content, title } = req.body;

  try {
    console.log("articles");
    const id = req.user.id;
    const user = await User.findById(id).select("-password");

    const article = await Article.create({
      therapist: id,
      name: user.name,
      therapistImg: user.image,
      content,
      title,
    });
    res.json(article);
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ msg: "Server error" });
  }
});

//@ route          DELETE  api/article
//@descrption      delete article
//@access          Public (it will not appear to therapist unless he is the owner in server side (may be protect it later))
router.delete("/:id", async (req, res) => {
  try {
    // delete Article
    await Article.findOneAndRemove({ _id: req.params.id });

    res.json({ msg: "article deleted" });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ msg: "Server error" });
  }
});

//@ route          DELETE  api/article
//@descrption      delete article
//@access          private(admins)

router.delete("/admin/:id", adminAuth, async (req, res) => {
  try {
    // delete Article
    await Article.findOneAndRemove({ _id: req.params.id });

    res.json({ msg: "article deleted" });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ msg: "Server error" });
  }
});
module.exports = router;
