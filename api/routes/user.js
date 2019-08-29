'use strict'

/****** User Routes ******/

//Loading modules
var express = require('express');
var multipart = require('connect-multiparty');

//Loading the Express Router
var api = express.Router();

//Loading the authentification middleware
var md_auth = require('../middlewares/authenticated');

//Creating the multipart upload middleware. The users images will be uploaded to the 'uploads/users' directory
var md_upload = multipart({
    uploadDir: './uploads/users' 
});

//Loading the User Controller
var UserController = require('../controllers/user');

//Defining the User Routes
api.get('/test-controller', md_auth.ensureAuth, UserController.test);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);


//Exporting the routes for using them in another place of the project
module.exports = api;


