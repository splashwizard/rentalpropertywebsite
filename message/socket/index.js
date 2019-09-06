'use strict';

var config 	= require('../../config/production');
var redis 	= require('redis').createClient;
var adapter = require('socket.io-redis');
var Filter = require('bad-words');

const translate = require('@k3rn31p4nic/google-translate-api');

var Room = require('../models/room');
var Message = require('../models/messages');

var filter = new Filter();
/**
 * Encapsulates all code for emitting and listening to socket events
 *
 */
var ioEvents = function(io) {

	
	// Rooms namespace
	io.of('/rooms').on('connection', function(socket) {
		
		// Create a new room
		socket.on('createRoom', function(title) {
			Room.findOne({'title': new RegExp('^' + title + '$', 'i')}, function(err, room){
				if(err) throw err;
				if(room){
					socket.emit('updateRoomsList', { error: 'Room title already exists.' });
				} else {
					Room.create({ 
						title: title
					}, function(err, newRoom){
						if(err) throw err;
						socket.emit('updateRoomsList', newRoom);
						socket.broadcast.emit('updateRoomsList', newRoom);
					});
				}
			});
		});
	});

	// Chatroom namespace
	io.of('/chatroom').on('connection', function(socket) {

		// Join a chatroom
		socket.on('join', function(roomId, username) {
			if(roomId == 'admin') {
				socket.join(roomId);
				Message.find(function(err, messages) {
					if(err) throw err;
					socket.emit('updateMessageList', messages);
				})
			}
			else {
				Room.findById(roomId, function(err, room){
					if(err) throw err;
					if(!room){
						// Assuming that you already checked in router that chatroom exists
						// Then, if a room doesn't exist here, return an error to inform the client-side.
						socket.emit('updateUsersList', { error: 'Room doesnt exist.' });
					} else {
						// Check if user exists in the session
						// if(socket.request.session.passport == null){
						// 	return;
						// }
	
	
							// Join the room channel
							socket.join(roomId);
	
							Message.getMessagesByRoomId(roomId).then(function(result) {
								socket.emit("updateMessageList", result);
							});
	
							Room.getUsers(roomId, socket, username, function(err, users){
								if(err) throw err;
								
								// Return list of all user connected to the room to the current user
								socket.emit('updateUsersList', users, true);
	
								// Return the current user to other connecting sockets in the room 
								// ONLY if the user wasn't connected already to the current room
								// if(cuntUserInRoom === 1){
								// 	socket.broadcast.to(newRoom.id).emit('updateUsersList', users[users.length - 1]);
								// }
							});
					}
				});
	
			}
		});

		// When a socket exits
		socket.on('disconnect', function() {

			// Check if user exists in the session
			if(socket.request.session.passport == null){
				return;
			}

			// Find the room to which the socket is connected to, 
			// and remove the current user + socket from this room
			Room.removeUser(socket, function(err, room, userId, cuntUserInRoom){
				if(err) throw err;

				// Leave the room channel
				socket.leave(room.id);

				// Return the user id ONLY if the user was connected to the current room using one socket
				// The user id will be then used to remove the user from users list on chatroom page
				if(cuntUserInRoom === 1){
					socket.broadcast.to(room.id).emit('removeUser', userId);
				}
			});
		});

		// When a new message arrives
		socket.on('newMessage', function(userName,roomId, message) {
			// filter for badword
			message.content = filter.clean(message.content);

			//translation to English
			translate(message.content, { to: 'en' }).then(res => {
				message.content = res.text;
			  }).catch(err => {
				console.error(err);
			  });

			  Message.create(userName, roomId, message);
			// No need to emit 'addMessage' to the current socket
			// As the new message will be added manually in 'main.js' file
			// socket.emit('addMessage', message);
			socket.broadcast.to(roomId).emit('addMessage', message);
			socket.broadcast.to('admin').emit('addMessage', message);
			// socket.broadcast.to(adminId).emit('addMessage', message);
		});

	});
}

/**
 * Initialize Socket.io
 * Uses Redis as Adapter for Socket.io
 *
 */
var init = function(app){

	var server 	= require('http').Server(app);
	var io 		= require('socket.io')(server);

	// Force Socket.io to ONLY use "websockets"; No Long Polling.
	io.set('transports', ['websocket']);

	// Using Redis
	let port = config.redis.port;
	let host = config.redis.host;
	let password = config.redis.password;
	let pubClient = redis(port, host, { auth_pass: password });
	let subClient = redis(port, host, { auth_pass: password, return_buffers: true, });
	io.adapter(adapter({ pubClient, subClient }));

	// Allow sockets to access session data
	io.use((socket, next) => {
		require('../session')(socket.request, {}, next);
	});

	// Define all Events
	ioEvents(io);

	// The server object will be then used to list to a port number
	return server;
}

module.exports = init;