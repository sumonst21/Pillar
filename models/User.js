const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const RoomSchema = require('./room')
//const Room = require('./room');
const { Room } = require(__dirname + '/Room.js')


const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  // rooms: [Room]
   rooms: [{
        type: Schema.ObjectId,
        ref: "Room"
      }]
}, {
  timestamps: true
})

module.exports = User = mongoose.model('User', UserSchema);