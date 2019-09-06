var User = require("../models/User");
// passport pkgs
const bcrypt = require("bcryptjs");
const passport = require("passport");

module.exports = {
  seedSuperAdmin(req, res) {
    User.findOne({ userType: "SuperAdmin" }).then(user => {
      if (user) {
        res.json({
          user,
          message: "super-admin already registered, login to continue"
        });
      } else {
        const newUser = {
          email: process.env.SA_EMAIL,
          password: process.env.SA_PASSWORD,
          userType: "SuperAdmin"
        };
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            let user = new User(newUser);
            user.save(function (err, user) {
              if (!err) {
                res.jsonp({
                  user,
                  code: 200,
                  status: "Super-admin Created"
                });
              } else {
                res.jsonp({
                  code: 200,
                  status: "Error occured while creating super-admin",
                  error: err
                });
              }
            });
          });
        });
      }
    });
  },

  adminLogout(req, res) {
    req.session.adminUser = null;
    res.json("admin logged out");
  },
  adminLogin(req, res) {
    const { username, password } = {
      username: process.env.USER,
      password: process.env.PWD
    };
    if (req.body.username == username && req.body.password == password) {
      req.session.adminUser = "admin";
      res.json("logged in as admin");
    } else {
      res.json("admin login failed");
    }
  },
  ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.json("auth required");
    res.redirect("/login");
  },

  loginUser(req, res, next) {
    
    passport.authenticate("local", {
      successRedirect: "/a/properties",
      failureRedirect: "/login"
    })(req, res, next);
  },

  authFacebook(req, res, next) {
    passport.authenticate('facebook')(req, res, next);
  },
  authFacebookCallback(req, res, next) {
    passport.authenticate('facebook', {
      successRedirect: '/getPropertyList',
      failureRedirect: '/login'
    })(req, res, next);
  },

  authGoogle(req, res, next) {
    passport.authenticate('google')(req, res, next);
  },
  authGoogleCallback(req, res, next) {
    passport.authenticate('google', {
      successRedirect: '/getPropertyList',
      failureRedirect: '/login'
    })(req, res, next);
  },

  authLinkedIn(req, res, next) {
    passport.authenticate('linkedin')(req, res, next);
  },
  authLinkedInCallback(req, res, next) {
    passport.authenticate('linkedin', {
      successRedirect: '/getPropertyList',
      failureRedirect: '/login'
    })(req, res, next);
  },

  logoutUser(req, res) {
    req.logout();
    console.log("user logged out");
    res.redirect("/login");
  },
  getUserList(req, res) {
    User.find({})
      .then(users => {
        res.jsonp({
          code: 200,
          status: "User List Retrived",
          users
        });
      })
      .catch(err => {
        res.jsonp({
          code: 200,
          status: "User List Retrived",
          userList: userList
        });
      });
    /*
    User.find({})
      .lean()
      .exec(function(err, userList) {
        if (!err) {
          res.jsonp({
            code: 200,
            status: "User List Retrived",
            userList: userList
          });
        } else {
          
        }
      });*/
  },
  getContractorList(req, res) {
    User.find({ userType: "Contractor" })
      .lean()
      .exec(function (err, contractorList) {
        if (!err) {
          res.jsonp({
            code: 200,
            status: "Contractor List Retrived",
            contractorList: contractorList
          });
        } else {
          res.jsonp({
            code: 200,
            status: "Error occured while retrieving Contractor list",
            error: err
          });
        }
      });
  },
  createUser(req, res) {
    console.log(req.body);
    const newUser = {
      email: req.body.email,
      password: req.body.password,
      userType: req.body.userType,
      status: req.body.status,
      region: req.body.region || null,
      profile: {
        name: req.body.name,
        gender: req.body.gender || null,
        location: req.body.location || null
        /*
        picture: {
          imageURL: req.file.url,
          imageID: req.file.public_id
        }*/
      }
    };

    if (req.body.userType == "SuperAdmin") {
      res.json("super-admin already registered login to continue");
    } else {
      if (req.body.userType == "Admin" && req.user) {
        if (req.user.userType == "SuperAdmin") {
          User.findOne({ email: req.body.email })
            .then(user => {
              if (user) {
                res.jsonp({
                  code: 200,
                  status: "User with that email already exists",
                  error: err
                });
              } else {
                bcrypt.genSalt(10, (err, salt) => {
                  bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    let user = new User(newUser);
                    user.save(function (err, user) {
                      if (!err) {
                        res.jsonp({
                          user,
                          code: 200,
                          status: "User Created"
                        });
                      } else {
                        res.jsonp({
                          code: 200,
                          status: "Error occured while creating user",
                          error: err
                        });
                      }
                    });
                  });
                });
              }
            })
            .catch(err => res.json(err));
        } else {
          res.json("not authorized to register an admin");
        }
      } else if (req.body.userType != "Admin") {
        User.findOne({ email: req.body.email }).then(user => {
          if (user) {
            res.jsonp({
              code: 200,
              status: "User with that email already exists"
            });
          } else {
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                let user = new User(newUser);
                user.save(function (err, user) {
                  if (!err) {
                    res.jsonp({
                      user,
                      code: 200,
                      status: "User Created"
                    });
                  } else {
                    res.jsonp({
                      code: 200,
                      status: "Error occured while creating user",
                      error: err
                    });
                  }
                });
              });
            });
          }
        });
      } else {
        res.json("login as super-admin to register an admin");
      }
    }
  },
  updateUser(req, res) {
    console.log('--------------------------------------------------------------------------')
    if (req.user.userType == "Admin" || req.user.userType == "SuperAdmin") {
      User.findOneAndUpdate({ _id: req.params.id }, req.body, function (
        err,
        user
      ) {
        if (!err) {
          res.jsonp({
            code: 200,
            status: "User Updated"
          });
        } else {
          res.jsonp({
            code: 200,
            status: "Error occured while updating user",
            error: err
          });
        }
      });
    } else if (
      (req.body.userType === "Admin" || req.body.userType === "SuperAdmin")
    ) {
      res.json("not authenticated to update user");
    } else if (req.session.passport.user == req.params.id) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) throw err;
          req.body.password = hash;
          User.findOneAndUpdate({ _id: req.params.id }, req.body, function (
              err,
              user
          ) {
            if (!err) {
              res.jsonp({
                code: 200,
                status: "User Updated"
              });
            } else {
              res.jsonp({
                code: 200,
                status: "Error occured while updating user",
                error: err
              });
            }
          });
        });
      });
    } else {
      res.json("not authenticated to update user");
    }
  },
  deleteUser(req, res) {
    User.remove({ _id: req.params.id }, err => {
      if (err) return res.json(err);
      res.json("user removed");
    });
    /*
    User.findByIdAndDelete(
       req.params.id ,
      function(err) {
        if (!err) {
          res.jsonp({
            code: 200,
            status: "User Removed"
          });
        } else {
          res.jsonp({
            code: 200,
            status: "Error occured while removing user",
            error: err
          });
        }
      }
    );*/
  },
  getUser(req, res) {
    if (req.session.adminUser == "admin") {
      User.findOne({ _id: req.params.id })
        .lean()
        .exec(function (err, user) {
          if (!err) {
            res.jsonp({
              code: 200,
              status: "User Retrived",
              user: user
            });
          } else {
            res.jsonp({
              code: 200,
              status: "Error occured while retrieving user",
              error: err
            });
          }
        });
    } else {
      if (req.user) {
        if (req.user._id == req.params.id) {
          User.findOne({ _id: req.params.id })
            .lean()
            .exec(function (err, user) {
              if (!err) {
                res.jsonp({
                  code: 200,
                  status: "User Retrived",
                  user: user
                });
              } else {
                res.jsonp({
                  code: 200,
                  status: "Error occured while retrieving user",
                  error: err
                });
              }
            });
        } else {
          res.json("not authorized to view user data");
        }
      } else {
        res.json("user not logged in");
      }
    }
  }
};
