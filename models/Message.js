const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  message: {
    type: String,
    required: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: 'Room'
  }
}, {
  timestamps: true
})

module.exports = Message = mongoose.model('Message', MessageSchema);
