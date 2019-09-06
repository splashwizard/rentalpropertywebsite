const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
var User = require("../models/User");

module.exports = function (passport) {
  passport.use('local',
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: "No user found" });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
         if (err) throw err;
         if (isMatch) {
            return done(null, user);
           } else {
             return done(null, false, { message: "Password incorrect" });
           }
        // if (password === user.password) {
        //   return done(null, user);
        // } else {
        //   return done(null, false, { message: "Password incorrect" });
        // }

        });
      });
    })
  );

  passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    profileFields: config.facebook.profileFields,
  },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({
        'email': profile.emails[0].value
      }, function (err, user) {
        if (err) {
          return done(err);
        }
        //No user was found... so create a new user with values from Facebook (all the profile. stuff)
        if (!user) {

          user = new User({
            email: profile.emails[0].value,
            // userType: 
            // region:
            profile: {
              name: profile.displayName,
              gender: profile.gender || "",
              location: profile._json.location.name || "",   // 'capital, country'
              picture: {
                imageURL: profile.photos[0].value,
                imageID: profile.id,
              }
            },
            provider: profile.provider,
          });
          user.save(function (err) {
            if (err) console.log(err);
            return done(err, user);
          });
        } else {
          //found user. Return
          return done(err, user);
        }
      });
    }
  ));

  passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL,
    scope: config.google.scope,
    // passReqToCallback: true
  },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({
        'email': profile.emails[0].value
      }, function (err, user) {
        if (err) {
          return done(err);
        }
        //No user was found... so create a new user with values from Google (all the profile. stuff)
        if (!user) {
          user = new User({
            email: profile.emails[0].value,
            // userType: 
            // region:
            profile: {
              name: profile.displayName,
              gender: profile.gender || "",
              location: profile._json.locale || "",   // 'en'
              picture: {
                imageURL: profile.photos[0].value,
                imageID: profile.id,
              }
            },
            provider: profile.provider,
          });
          user.save(function (err) {
            if (err) console.log(err);
            return done(err, user);
          });
        } else {
          //found user. Return
          return done(err, user);
        }
      });
    }
  ));

  passport.use(new LinkedInStrategy({
    clientID: config.linkedin.clientID,
    clientSecret: config.linkedin.clientSecret,
    callbackURL: config.linkedin.callbackURL,
    scope: config.linkedin.scope,
    state: config.linkedin.state,
  },
    function (accessToken, refreshToken, profile, done) {
      // process.nextTick(
      User.findOne({
        'email': profile.emails[0].value
      }, function (err, user) {
        if (err) {
          return done(err);
        }
        //No user was found... so create a new user with values from LinkedIn (all the profile. stuff)
        if (!user) {
          user = new User({
            email: profile.emails[0].value,
            //userType
            //region
            profile: {
              name: profile.displayName,
              gender: profile.gender || "",   // no gender in linkedin
              // location: profile.address.localized || "",    // this is part of full info and not permitted to get full info

              //"address":{
              //     "localized":{
              //       "en_US":"2029 Stierlin Ct, Mountain View, CA 94043"
              //    },
              //    "preferredLocale":{
              //       "country":"US",
              //       "language":"en"
              //    }
              // }

              picture: {
                imageURL: profile.photos[0].value,
                imageID: profile.id,
              },
              //   "profilePicture":{
              //     "displayImage":"urn:li:digitalmediaAsset:C4D03AQGsitRwG8U8ZQ",
              //     "displayImage~":{
              //        "elements":[
              //           {
              //              "artifact":"urn:li:digitalmediaMediaArtifact:(urn:li:digitalmediaAsset:C4D03AQGsitRwG8U8ZQ,urn:li:digitalmediaMediaArtifactClass:profile-displayphoto-shrink_100_100)",
              //              "authorizationMethod":"PUBLIC",
              //              "data":{
              //                 "com.linkedin.digitalmedia.mediaartifact.StillImage":{
              //                    "storageSize":{
              //                       "width":100,
              //                       "height":100
              //                    },
              //                    "storageAspectRatio":{
              //                       "widthAspect":1,
              //                       "heightAspect":1,
              //                       "formatted":"1.00:1.00"
              //                    },
              //                    "mediaType":"image/jpeg",
              //                    "rawCodecSpec":{
              //                       "name":"jpeg",
              //                       "type":"image"
              //                    },
              //                    "displaySize":{
              //                       "uom":"PX",
              //                       "width":100,
              //                       "height":100
              //                    },
              //                    "displayAspectRatio":{
              //                       "widthAspect":1,
              //                       "heightAspect":1,
              //                       "formatted":"1.00:1.00"
              //                    }
              //                 }
              //              },
              //              "identifiers":[
              //                 {
              //                    "identifier":"https://media.licdn.com/dms/image/C4D03AQGsitRwG8U8ZQ/profile-displayphoto-shrink_100_100/0?e=1526940000&v=alpha&t=12345",
              //                    "file":"urn:li:digitalmediaFile:(urn:li:digitalmediaAsset:C4D03AQGsitRwG8U8ZQ,urn:li:digitalmediaMediaArtifactClass:profile-displayphoto-shrink_100_100,0)",
              //                    "index":0,
              //                    "mediaType":"image/jpeg",
              //                    "identifierExpiresInSeconds":1526940000
              //                 }
              //              ]
              //           }
              //        ],
              //        "paging":{
              //           "count":10,
              //           "start":0,
              //           "links":[

              //           ]
              //        }
              //     }
              //  },
              //  "id":"yrZCpj2ZYQ"
            },
            provider: profile.provider,   // linkedin
          });
          user.save(function (err) {
            if (err) console.log(err);
            return done(err, user);
          });
        } else {
          //found user. Return
          return done(err, user);
        }
      })
      // );
    }
  ));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
