
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Room = require('../../models/Room');

router.get("/test", (req, res) => res.json({ msg: "This is the rooms route" }));

router.get('/', (req, res) => {
  console.log("this is the rooms route");
  Room.find()
    .populate('admin')
    .then(rooms => {
      res.json(rooms);
      //console.log(messages);
    })
    .catch(err => res.status(404).json({ noroomsfound: 'No messages found' }));
});

router.post("/create", (req, res) => {
  console.log("this is the rooms create route");

  //build out validations
  //include socket information for each room?
  const newRoom = new Room({
    title: "test",
  });

  newRoom.save().catch(err=> console.log(err + "from rooms save"));

});
module.exports = router;