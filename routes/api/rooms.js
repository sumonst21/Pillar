
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Room = require('../../models/Room');
const { populate } = require('../../models/User');
const User = require('../../models/User');
const validateRoomInput = require('../../validation/room');

router.get("/test", (req, res) => res.json({ msg: "This is the rooms route" }));

const filterRooms = (rooms, userId) =>{
  let filteredRooms = [];
  rooms.forEach(room => {
    room.users.forEach(user => {
       
      if (user.id === userId){
        filteredRooms.push(room);
      } 
    });
  });
  return filteredRooms;
}

const filterAvailableRooms = (rooms, userId) =>{
  let filteredRooms = [];
  rooms.forEach(room => {
    let include = true;
    ;
    room.users.forEach(user => {
      
      if (user._id.toString() === userId){
        include = false;
      } 
    });
    include ? filteredRooms.push(room) : null;

  });
  return filteredRooms;
};



//get available rooms to join
  //excludes rooms a user already bleongs to
router.get('/:userId/roomsAvailable', (req,res)=> {
   
  Room.find({})
    .populate({
      path: 'messages',
      model: 'Message',
      populate: {
        path: 'sender',
        model: 'User'
      },
      populate: {
        path: 'replies'
      }
    }).populate({
      path: 'users',
      model: 'User'
    })
    // .populate({
    //    path: 'closedFor' 
    //   })
      .exec((err, rooms)=>{
      if (err) {
        res.status(404).json({ noroomsfound: 'No rooms found' });
      } else {
        let roomList = filterAvailableRooms(rooms, req.params.userId);
        // 
        res.json(roomList);
      }
    })
})



//retrieve all rooms by user
router.get('/:userId/rooms', (req, res) => {
  Room.find({})
      .populate({
        path: 'messages',
        model: 'Message',
        populate: {
          path: 'sender',
          model: 'User'
        }
      }).populate({
        path: 'users',
        model: 'User'
      }) //populate the array of messages
      // .populate({
      //    path: 'closedFor',
      //   })
        .exec((err, rooms)=>{
         
        if(err){
          res.status(404).json({ noroomsfound: 'No rooms found' });
        } else {
          let roomList = filterRooms(rooms, req.params.userId);
           
          res.json(roomList);
        }

      }) 
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
    ;
    const { errors, isValid } = validateRoomInput(req.body);
    ;
    
    if (!isValid) {
      return res.status(400).json(errors);
    }
    let newRoom = new Room({
      title: req.body.title,
      admin: req.body.admin,
      messages: [],
      users: req.body.users,
      closedFor: ["none"]
    });
    ;
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
    
    //  
    if (!isValid) {
      return res.status(400).json(errors);
    }
    ;
    let updateRoom = Room.findById(req.params.roomId).exec().then(room => {
      room.title = req.body.title;
      room.admin = req.body.admin;
      room.users = req.body.users;
      //  
      room.save().then(room => {
        Room.findById(req.params.roomId)
          .populate({
            path: 'messages',
            model: 'Message',
            populate: {
              path: 'sender',
              model: 'User'
            }
          }).populate({
            path: 'users',
            model: 'User'
          })
          // .populate({ 
          //   path: 'closedFor' 
          // })
          .exec().then(room => {
            res.json(room);

          })
      });
      //returns the updated room
    }
    );

    
  }
);

router.patch('/closedfor', (req, res) => {
    REQ = req; 
    Room.findByIdAndUpdate(req.body.roomId)
    .exec().then(room => {
      
      if (room.closedFor.includes(req.body.email) ){
       ;
        room.closedFor = room.closedFor.filter(match => (match != req.body.email))
    }
    else{
       
        room.closedFor.push(req.body.email)
    }

   
    room.save().then(saved => {
      Room.find({})
        .populate({
          path: 'messages',
          model: 'Message',
          populate: {
            path: 'sender',
            model: 'User'
          }
        }).populate({
          path: 'users',
          model: 'User'
        }) 
        .exec((err, rooms) => {

          if (err) {
             ;
            res.status(404).json({ noroomsfound: 'No rooms found' });
          } else {
            ;
            let roomList = filterRooms(rooms, req.body.id);
             ;
            res.json(roomList);
          }

        })
    }) 
    })
  });

module.exports = router;