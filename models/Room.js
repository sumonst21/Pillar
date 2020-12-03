const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  messages:[{
    type: Schema.Types.ObjectId,
    ref: "Message"
  }],
  users:[{
    type: Schema.Types.ObjectId,
    ref: "User"
  }]
}, {
  timestamps: true
})

module.exports = Room = mongoose.model('Room', RoomSchema);
