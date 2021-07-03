const router = require("express").Router();
const Conversation = require("../models/Conversation");

// create new conversation

router.post("/", async (req, res) => {



  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    let isExist = await Conversation.find({
      members: [req.body.senderId, req.body.receiverId],
    });
  
    if (isExist){
      if (isExist) {
        return res.status(400).json({msg: 'Conversation already exists'});
      }
    }
  
    isExist = await Conversation.find({
      members: [req.body.receiverId, req.body.senderId],
    });
  
    if (isExist){
      if (isExist) {
        return res.status(400).json({msg: 'Conversation already exists'});
      }
    }
    
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] },
    }).sort({ date: "desc" });
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
