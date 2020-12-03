
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Room = require('../../models/Room');
const validateRoomInput = require('../../validation/room');

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

router.post('/',
  //passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateRoomInput(req.body);
    debugger;

    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newRoom = new Room({
      title: req.body.title,
      admin: req.body.admin,
      messages: [],
      users: [],
    });

    newRoom.save().then(room => res.json(room));
  }
);
module.exports = router;