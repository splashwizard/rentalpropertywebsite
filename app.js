'use strict';

var express = require("express");
require('dotenv').config();
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const passport = require("passport");
var constants = require("./config/constant.js");
const session = require("express-session");
var flash 		= require('connect-flash');
const fileUpload = require('express-fileupload')

const adminRouter = require('./controllers/admin.controller')
// var users = require('./routes/user.routes.js');

var glob = require("glob");
var path = require("path");
var _ = require("lodash");

var router = express.Router();
var app = express();
var mode = process.env.NODE_ENV ? process.env.NODE_ENV : "staging";
var helmet = require("helmet");

var start = require("./config/start.js");
var db = require("./config/db.js");

console.log("============Welcome to CMS===============");
console.log("Mode:", config.mode);
console.log("Port:", config["process.env.PORT"]);

// Passport config
require("./config/passport")(passport);

// Session middleware
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
  })
  );
  
  app.use(fileUpload());
  //Passport middleware
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  const messageRouter = require('./message/message.route');
  
  app.use(flash());
  
  app.post('/upload', function(req, res) {
    console.log('upload files');
    if(Object.keys(req.files).length == 0) {
      console.log('No files were uploaded.');
      return;
    }
    let sampleFile = req.files.sampleFile;
    
    // Use the mv() method to place the file somewhere on your server
    console.log(req.body.username, Date.now(), sampleFile.name);
    var fileName = req.body.username + Date.now() + sampleFile.name
    sampleFile.mv('uploadData/' + fileName, function(err) {
      if (err)
        return res.status(500).send(err);
      
      res.send(fileName);
    });
  })

  app.get('/uploadData/:fileName', function(req, res) {

    res.sendFile(__dirname + '/uploadData/' + req.params.fileName);
  })
  
  // Global variable
  app.use((req, res, next) => {
    res.locals.user = req.user || null;
    console.log(req.user);
    next();
  });
  
  /**
  * Get files by glob patterns
  */
  var getGlobbedPaths = function (globPatterns, excludes) {
    // URL paths regex
    var urlRegex = new RegExp("^(?:[a-z]+:)?//", "i");
    
    // The output array
    var output = [];
    
    // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
    if (_.isArray(globPatterns)) {
      globPatterns.forEach(function (globPattern) {
        output = _.union(output, getGlobbedPaths(globPattern, excludes));
      });
    } else if (_.isString(globPatterns)) {
      if (urlRegex.test(globPatterns)) {
        output.push(globPatterns);
      } else {
        var files = glob.sync(globPatterns);
        if (excludes) {
          files = files.map(function (file) {
            if (_.isArray(excludes)) {
              for (var i in excludes) {
                file = file.replace(excludes[i], "");
              }
            } else {
              file = file.replace(excludes, "");
            }
            return file;
          });
        }
        output = _.union(output, files);
      }
    }
    
    return output;
  };
  
  var routes = getGlobbedPaths("routes/*.js");
  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  routes.forEach(function (route) {
    require(path.resolve(route))(app);
  });
  
  app.get('/socket.io-file-client.js', (req, res, next) => {
    return res.sendFile(__dirname + '/node_modules/socket.io-file-client/socket.io-file-client.js');
  });
  
  app.use('/adminapi', adminRouter)
  
  app.use('/public', express.static(process.cwd() + '/public'));
  app.set("view engine", "ejs");
  
  app.use('/message', messageRouter)
  
  // index page 
  app.get('/', function (req, res) {
    res.render('pages/index');
  });
  // admin page 
  app.get('/admin', function (req, res) {
    res.render('pages/admin');
  });
  app.get('/admin/createProperty', function (req, res) {
    res.render('pages/admin_createProperty');
  });
  
  // login page 
  app.get('/login', function (req, res) {
    res.render('pages/login');
  });
  app.get('/editUser', function (req, res) {
    res.render('pages/editUser');
  });
  // properties page

  // app.get('/properties/:country/:region/:city', function (req, res) {
  //   res.render('pages/properties', {
  //     propertyList: [{City:'Castine', Region: "Hancock", Country:"USA"}]
  //   });
  // });

  app.get('/property_item/:room_id', function (req, res) {
    res.render('pages/property_item', {room_id: req.room_id});
  });
  
  app.use(logger("dev"));
  //app.use(bodyParser.urlencoded());
  app.use(cookieParser());
  
  // var user = require('./routes/user.routes.js')(express,app,router)
  
  // app.use('/users', user);
  
  /// catch 404 and forwarding to error handler
  app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    return res.status(404).json({ code: 404, message: "not found", data: {} });
  });
  
  // module.exports = app;
  exports.app = functions.https.onRequest(app);
  
