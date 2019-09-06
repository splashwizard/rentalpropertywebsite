'use strict';

var roomModel   = require('../../models/room');
var User 		= require('../models/user');

var create = function (data, callback){
	roomModel.find(function(err, r) {
		if(err) {
			throw(err);
		}
		if(r == null) {
			console.log('no room');
			var newRoom = new roomModel(data);
			newRoom.save(callback);	
		}
		else {
			for(var i = 0; i < r.length; i++) {
				var e = r[i];
				if(String(e.connections[0].userId) === String(data.connections[0].userId) || (e.connections.length > 1 && String(e.connections[1].userId) === String(data.connections[0].userId))) {
					return callback();
				}
				else {
					if(e.roomName == data.roomName) {
						roomModel.findByIdAndUpdate(e._id, data, callback);
						return callback();	
					}
				}

			}
			console.log('no matched rooms ');
			var newRoom = new roomModel(data);
			newRoom.save(callback);	
		}
	})
};

var find = function (data, callback){
	roomModel.find(data, callback);
}

var findOne = function (data, callback){
	roomModel.findOne(data, callback);
}

var findById = function (id, callback){
	roomModel.findById(id, callback);
}

var findByIdAndUpdate = function(id, data, callback){
	roomModel.findByIdAndUpdate(id, data, { new: true }, callback);
}

var findByUserId = function(id, callback) {
	return roomModel.byUserId(id);
}
/**
* Add a user along with the corresponding socket to the passed room
*
*/
var addUser = function(room, socket, callback){
	
	// Get current user's id
	// var userId = socket.request.session.passport.user;
	var userId = 1;
	
	// Push a new connection object(i.e. {userId + socketId})
	var conn = { userId: userId, socketId: socket.id};
	room.connections.push(conn);
	room.save(callback);
}

/**
* Get all users in a room
*
*/
var getUsers = function(room, socket, username, callback){
	var users = [], vis = {}, cunt = 0;
	// var userId = socket.request.session.passport.user;
	
	roomModel.findById(room, function(err, room) {
		room.connections.forEach(function(con) {
			if( username !== con.userId) {
				users.push(con.userId);
			};
		})
		return callback(null, users);
	});
	
}

/**
* Remove a user along with the corresponding socket from a room
*
*/
var removeUser = function(socket, callback){
	
	// Get current user's id
	var userId = socket.request.session.passport.user;
	
	find(function(err, rooms){
		if(err) { return callback(err); }
		
		// Loop on each room, Then:
		rooms.every(function(room){
			var pass = true, cunt = 0, target = 0;
			
			// For every room, 
			// 1. Count the number of connections of the current user(using one or more sockets).
			room.connections.forEach(function(conn, i){
				if(conn.userId === userId){
					cunt++;
				}
				if(conn.socketId === socket.id){
					pass = false, target = i;
				}
			});
			
			// 2. Check if the current room has the disconnected socket, 
			// If so, then, remove the current connection object, and terminate the loop.
			if(!pass) {
				room.connections.id(room.connections[target]._id).remove();
				room.save(function(err){
					callback(err, room, userId, cunt);
				});
			}
			
			return pass;
		});
	});
}

module.exports = { 
	create, 
	find, 
	findOne, 
	findById, 
	findByUserId,
	addUser, 
	getUsers, 
	removeUser 
};