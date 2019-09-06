const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  date:String,
  fromUserId:String,
  toUserId: String,
  contents: String,
  roomId: String,
  fileUploaded: Boolean,
  uploadFile: String
});
MessageSchema.statics.findByRoomId = function(roomId) {
  return this.find({roomId: roomId});
}

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;