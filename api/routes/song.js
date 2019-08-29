'use strict'

/****** Song Routes ******/

//Loading modules
var express = require('express');
var multipart = require('connect-multiparty');

//Loading the Express Router
var api = express.Router();

//Loading the authentification middleware
var md_auth = require('../middlewares/authenticated');

//Creating the multipart upload middleware. The albums songs will be uploaded to the 'uploads/songs' directory
var md_upload = multipart({
    uploadDir: './uploads/songs' 
});

//Loading the Song Controller
var SongController = require('../controllers/song');

//Defining the Song Routes
api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.get('/songs/:album_id?', md_auth.ensureAuth, SongController.getSongs);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.put('/update-song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/delete-song/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFile);
api.get('/get-file-song/:songFile', SongController.getSongFile);

//Exporting the routes for using them in another place of the project
module.exports = api;