var MessageModel = require('../../models/messages');

var create = function(userName, roomId, message) {
  var dd = String(new Date().getDate()).padStart(2, '0');
  var mm = String(new Date().getMonth() + 1).padStart(2, '0');
  var yyyy = new Date().getFullYear();
  var today =message.date;
  console.log(today, userName, roomId, message);
  var m = new MessageModel({date: today, fromUserId: userName, toUserId: message.peername, roomId: roomId, 
    contents: message.content, fileUploaded: message.fileUploaded, uploadFile: 'uploadData/' + message.uploadFile});

  m.save();
  // MessageModel.insert({timeStamp: new Date(), fromUserId: userName, toUserId: userName, contents: message, roomId: roomId});
}

var find = function(data, callback) {
  MessageModel.find(data, callback);
}

var getMessagesByRoomId = function(roomId) {
  return MessageModel.findByRoomId(roomId);
}

module.exports = {create, getMessagesByRoomId, find};