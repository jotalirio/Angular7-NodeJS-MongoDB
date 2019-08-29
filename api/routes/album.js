'use strict'

/****** Album Routes ******/

//Loading modules
var express = require('express');
var multipart = require('connect-multiparty');

//Loading the Express Router
var api = express.Router();

//Loading the authentification middleware
var md_auth = require('../middlewares/authenticated');

//Creating the multipart upload middleware. The albums images will be uploaded to the 'uploads/albums' directory
var md_upload = multipart({
    uploadDir: './uploads/albums' 
});

//Loading the Album Controller
var AlbumController = require('../controllers/album');

//Defining the Album Routes
api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.get('/albums/:artist_id?', md_auth.ensureAuth, AlbumController.getAlbums);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.put('/update-album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/delete-album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage);
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);

//Exporting the routes for using them in another place of the project
module.exports = api;