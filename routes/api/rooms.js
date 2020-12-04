
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Room = require('../../models/Room');
const validateRoomInput = require('../../validation/room');

router.get("/test", (req, res) => res.json({ msg: "This is the rooms route" }));

const filterRooms = (rooms, userId) =>{
  let filteredRooms = [];
  rooms.forEach(room => {
    room.users.forEach(user => {
      //debugger;
      if (user.toString() === userId){
        filteredRooms.push(room);
      } 
    });
  });
  return filteredRooms;
}


//retrieve all rooms
router.get('/:userId/rooms', (req, res) => {
  //console.log("this is the rooms route");
// debugger;
  Room.find({})
  //.populate('users')  //find all rooms where userId is a member
      .then(rooms => {
        let roomList = filterRooms(rooms, req.params.userId);
        res.json(roomList);
        console.log(roomList);
    })
    .catch(err => res.status(404).json({ noroomsfound: 'No messages found' }));
});




//retrieve single room
router.get('/:roomId', (req, res) => {
  console.log("this is the room route");
  Room.findById(req.params.roomId)
    .populate('admin')
    .then(room => {
      res.json(room);
      //console.log(messages);
    })
    .catch(err => res.status(404).json({ noroomfound: 'No room found' }));
});


//create room
router.post('/',
  //passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateRoomInput(req.body);
    

    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newRoom = new Room({
      title: req.body.title,
      admin: req.body.admin,
      messages: [],
      users: req.body.users,
    });

    newRoom.save().then(room => res.json(room));
  }
);


//delete room
router.post('/:roomId/delete', 
  (req,res) => {
    Room.findByIdAndRemove(req.params.roomId)
      .then(room => {
        res.json(room);
        //returns the deleted room;
      })
      .catch(err => res.status(404).json({ noroomfound: 'No room found' }));
  }
)

//edit room
router.post('/:roomId',
  //passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateRoomInput(req.body);
    

    if (!isValid) {
      return res.status(400).json(errors);
    }
    let updateRoom = Room.findById(req.params.roomId).exec().then(room => {
      room.title = req.body.title;
      room.admin = req.body.admin;
      room.save().then(room => res.json(room));
      //returns the updated room
    }
    );

    //allows the changing of title and admin only, messages and users retained
  }
);

module.exports = router;