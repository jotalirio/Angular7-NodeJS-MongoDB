'use strict'

/****** Song Controller ******/

//Loading fs and path modules allowing to work with the file system
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

//Loading Models
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

//Controller methods
function getSong(req, res) {
    var songId = req.params.id;
    //Using the method populate we can get the info of the album associated to the song
    Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
        if(err) {
            res.status(500).send({
                message: "ERROR getting the song info."
            });
        }
        else {
            if(!song) {
                res.status(404).send({
                    message: "The song does not exist."
                });
            }
            else {
                res.status(200).send({song});
            }
        }
    });
}

function getSongs(req, res) {
    var albumId = req.params.album;
    var find;
    if(!albumId) {
        //Getting all songs
        find = Song.find({}).sort('name');
    }
    else {
        //Getting all song for an album
        find = Song.find({album: albumId}).sort('number');
    }
    find.populate({
        path: 'album',
        populate: { // Using this JSON object to get the info associated to the an album's artist populating the 'artist' fiel on the Album model
            path: 'artist',
            model: 'Artist'
        }
    }).exec((err, songs) => {
        if(err) {
            res.status(500).send({
                message: "ERROR getting the list of songs."
            });
        }
        else {
            if(!songs) {
                res.status(404).send({
                    message: "There are not songs."
                });
            }
            else {
                res.status(200).send({songs});
            }
        }
    });
}

function saveSong(req, res) {
    var song = new Song();
    var params = req.body;
    console.log(params);
    //Adding info to the new song instance
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    //Saving the song
    song.save((err, songStored) => {
        if(err) {
            res.status(500).send({
                message: 'ERROR trying to save the song.'
            });
        }
        else {
            if(!songStored) {
                res.status(404).send({
                    message: 'Something was wrong, the song has not been saved.'
                });
            }
            else {
                res.status(200).send({
                    song: songStored
                });
            }
        }
    });
}

function updateSong(req, res) {
    //Getting the songId as a URL param
    var songId = req.params.id;
    //Getting the body the song data to update
    var dataToUpdate = req.body;

    Song.findByIdAndUpdate(songId, dataToUpdate, (err, songUpdated) => {
        if(err) {
            res.status(500).send({
                message: "ERROR updating the song info."
            });
        }
        else {
            if(!songUpdated) {
                res.status(404).send({
                    message: "The song cannot be updated."
                });
            }
            else {
                //There will be returned the song with the old info, not the new one
                res.status(200).send({songUpdated});
            }
        }
    });
}

function deleteSong(req, res) {
    var songId = req.params.id;
    Song.findByIdAndRemove(songId, (err, songRemoved) => {
        if(err) {
            res.status(500).send({
                message: "ERROR deleting the song."
            });
        }
        else {
            if(!songRemoved) {
                res.status(404).send({
                    message: "The song cannot be deleted."
                });
            }
            else {
                res.status(200).send({
                    song: songRemoved
                });
            }
        }
    });
}

function uploadFile(req, res) {
    var songId = req.params.id;
    //Default file name
    var file_name = 'Song file not uploaded...';

    //Because 'connect-multiparty' module loaded in Song Routes file, we can use right now the global variable 'files'
    if(req.files) {
        //Uploading file. Getting the path file. The 'file' field represents the file's name
        //e.g: uploads\songs\jJzoJ202S2bhRLwNCGpazYC3.jpg
        var file_path = req.files.file.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        //Validating the extension file
        if(file_ext == 'mp3' || file_ext == 'ogg') {
            //Updating file in song profile
            Song.findByIdAndUpdate(songId, {
                file: file_name
            }, (err, songUpdated) => {
                if(err) {
                    res.status(500).send({
                        message: "ERROR updating the song info."
                    });
                }
                else {
                    if(!songUpdated) {
                        res.status(404).send({
                            message: "The song cannot be updated."
                        });
                    }
                    else {
                        //There will be returned the song with the old info, not the new one
                        res.status(200).send({songUpdated});
                    }
                }
            });
        }
        else {
            res.status(200).send({
                message: "The audio file's extension is not valid."
            });
        }
    }
    else {
        res.status(200).send({
            message: 'You have not uploaded any audio file.'
        });
    }
}

function getSongFile(req, res) {
    //File song name to retrieve from server songs directory
    var songFile = req.params.songFile;
    var path_file = './uploads/songs/' + songFile;

    //Verifying if the song file exists in the server songs directory
    fs.exists(path_file, (exists) => {
        if(exists) {
            //Sending the song inside the response
            res.sendFile(path.resolve(path_file));
        }
        else {
            res.status(200).send({
                message: 'The audio file does not exists.'
            });
        }
    });
}

//Exporting the methods for using them in another place of the project
module.exports = {
    getSong,
    getSongs,
    saveSong,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile

};