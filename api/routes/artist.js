'use strict'

/****** Artist Routes ******/

//Loading modules
var express = require('express');
var multipart = require('connect-multiparty');

//Loading the Express Router
var api = express.Router();

//Loading the authentification middleware
var md_auth = require('../middlewares/authenticated');

//Creating the multipart upload middleware. The artists images will be uploaded to the 'uploads/artists' directory
var md_upload = multipart({
    uploadDir: './uploads/artists' 
});

//Loading the Artist Controller
var ArtistController = require('../controllers/artist');

//Defining the Artist Routes
api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);
api.put('/update-artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/delete-artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);

//Exporting the routes for using them in another place of the project
module.exports = api;