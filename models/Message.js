const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  message: {
    type: String,
    require: true
  },
  username: {
    type: String,
    require: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: 'User'
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: 'Room'
  },
  replies: [{
    username: String, 
    userId: String,
    reply: String, 
    room: String
  }],
}, {
  timestamps: true
})

module.exports = Message = mongoose.model('Message', MessageSchema);
