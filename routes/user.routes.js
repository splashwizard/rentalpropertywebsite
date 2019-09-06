const passport = require("passport");

var userController = require("../controllers/user.controller");

const adminRouter = require("../controllers/admin.controller");

// image host
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const multer = require("multer");

// Cloudinary config
cloudinary.config({
  cloud_name: "cloud name",
  api_key: "api key",
  api_secret: "api secret"
});

// Create cloudinary storage engine
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "clouds",
  allowedFormats: ["jpg", "png"]
});
const parser = multer({ storage: storage });

module.exports = function (app) {
  app.get("/seedSuperAdmin", userController.seedSuperAdmin);
  app.post("/adminLogin", userController.adminLogin);
  app.get("/adminLogout", userController.adminLogout);
  app.get("/getUserList", userController.getUserList);
  app.post("/login", userController.loginUser);
  app.get("/logout", userController.logoutUser);

  app.get('/auth/facebook', userController.authFacebook);
  app.get('/auth/facebook/callback', userController.authFacebookCallback);
  app.get('/auth/google', userController.authGoogle);
  app.get('/auth/google/callback', userController.authGoogleCallback);
  app.get('/auth/linkedin', userController.authLinkedIn);
  app.get('/auth/linkedin/callback', userController.authLinkedInCallback);

  app.get("/getContractorList", userController.getContractorList);
  app.post("/createUser", userController.createUser);
  app.get("/getUser/:id", userController.getUser);
  app.put(
    "/updateUser/:id",
    /*parser.single("image"),*/ userController.updateUser
  );
  app.delete("/deleteUser/:id", userController.deleteUser);
};
