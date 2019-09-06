'use strict';

var express	 	= require('express');
var router 		= express.Router();
var passport 	= require('passport');

var User = require('../message/models/user');
var Room = require('../message/models/room');

// Home page
router.get('/', function(req, res, next) {
	console.log("get message");
	// If user is already logged in, then redirect to rooms page
	console.log(req.user);
	// var userid = req.user.userid;
	res.redirect('/message/chat/'+ '1/0/1');
	// res.redirect('/message/chat/'+ 'userid/roomid/propertyId');

	// if(req.isAuthenticated()){
	// 	res.redirect('/rooms');
	// }
	// else{
	// 	res.render('login', {
	// 		success: req.flash('success')[0],
	// 		errors: req.flash('error'), 
	// 		showRegisterForm: req.flash('showRegisterForm')[0]
	// 	});
	// }
});

// Login
router.post('/login', passport.authenticate('local', { 
	successRedirect: 'rooms', 
	failureRedirect: '/message',
	failureFlash: true
}));

// Register via username and password
router.post('/register', function(req, res, next) {
	
	var credentials = {'username': req.body.username, 'password': req.body.password };
	
	if(credentials.username === '' || credentials.password === ''){
		req.flash('error', 'Missing credentials');
		req.flash('showRegisterForm', true);
		res.redirect('/message');
	}else{
		
		// Check if the username already exists for non-social account
		User.findOne({'username': new RegExp('^' + req.body.username + '$', 'i'), 'socialId': null}, function(err, user){
			if(err) throw err;
			if(user){
				req.flash('error', 'Username already exists.');
				req.flash('showRegisterForm', true);
				res.redirect('/message');
			}else{
				User.create(credentials, function(err, newUser){
					if(err) throw err;
					req.flash('success', 'Your account has been created. Please log in.');
					res.redirect('/message');
				});
			}
		});
	}
});

// Social Authentication routes
// 1. Login via Facebook
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/rooms',
	failureRedirect: '/message',
	failureFlash: true
}));

// 2. Login via Twitter
router.get('/auth/twitter', passport.authenticate('twitter'));
router.get('/auth/twitter/callback', passport.authenticate('twitter', {
	successRedirect: '/rooms',
	failureRedirect: '/message',
	failureFlash: true
}));

// Rooms
router.get('/rooms', function(req, res, next) {
	Room.find(function(err, rooms){
		if(err) throw err;
		res.render('rooms', { rooms });
	});
});

//admin monitoring message
router.get('/admin', function(req, res, next) {
	
});
// Chat Room 
router.get('/chat/:id/:roomId/:propertyId', function(req, res, next) {
	// var roomId = req.params.id;
	var userid = req.params.id;
	var roomId = req.params.roomId;
	var peerid = ''
	var currentRoom = undefined;
	var propertyId = req.params.propertyId;
	
	//if new message to owner
	if(propertyId != 0) {
		// roomId = userid + "-" + Date.now();
		var newRoom = {
			roomName: roomId, 
			connections: [{userId:userid, socketId:1, state:'online'}, {userId:2, socketId:1, state:'online'}],
			propertyId: propertyId
		}

		Room.create(newRoom, function() {
			
			console.log("bbbb");
			Room.findByUserId(userid).then(function(result) {
				if(!result) {
					return next();
				}
				var rooms = {
					user: userid,
					rooms: result
				}
				
				console.log('cccc', roomId);
				if(roomId === undefined || roomId === '' || roomId == 0) {
					currentRoom = result[0];
				}
				else {
					result.forEach(function(r) {
						if(r.roomName == roomId) {
							currentRoom = r;
						}
					})
				}
				
				if(result[0].connections[0].userId == userid) {
					peerid = result[0].connections[1].userId
				}
				
				else if(result[0].connections[1].userId == userid){
					peerid = result[0].connections[0].userId
				}
				
				console.log(userid, rooms);
				
				res.render('pages/message/chatroom', {user: {username: userid, userid: userid, peername: peerid, peerid: peerid}, rooms, currentRoom});
			});
		})
		
		
	}
	else {
		var rooms = {};
		
		Room.findByUserId(userid).then(function(result) {
			if(!result) {
				return next();
			}

			rooms = {
				user: userid,
				rooms: result
			}
			
			if(roomId === undefined || roomId === '' || roomId == 0) {
				currentRoom = result[0];
			}

			else {
				result.forEach(function(r) {
					if(r._id == roomId) {
						currentRoom = r;
					}
				})
			}
			console.log(result);
			if(result[0].connections[0].userId == userid) {
				peerid = result[0].connections[1].userId
			}
			
			else if(result[0].connections[1].userId == userid){
				peerid = result[0].connections[0].userId
			}
			
			console.log(userid, rooms);
			
			res.render('pages/message/chatroom', {user: {username: userid, userid: userid, peername: peerid, peerid: peerid}, rooms, currentRoom});
		});
	}
	
});

// Logout
// router.get('/logout', function(req, res, next) {
// 	// remove the req.user property and clear the login session
// 	req.logout();

// 	// destroy session data
// 	req.session = null;

// 	// redirect to homepage
// 	res.redirect('/');
// });

module.exports = router;