'use strict';

var Mongoose  = require('mongoose');

/**
 * Each connection object represents a user connected through a unique socket.
 * Each connection object composed of {userId + socketId}. Both of them together are unique.
 *
 */
var RoomSchema = new Mongoose.Schema({
    roomName: { type: String, required: true },
    connections: { type: [{ userId: String, socketId: String, state: {type: String, enum:['online', 'away', 'offline']} }]},
    propertyId: String
});

RoomSchema.statics.byUserId = function(userId) {
    return this.find({"connections.userId": userId});
}

var roomModel = Mongoose.model('room', RoomSchema);

module.exports = roomModel;