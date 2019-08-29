'use strict'

/****** Album Controller ******/

//Loading fs and path modules allowing to work with the file system
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

//Loading Models
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

//Controller methods
function getAlbum(req, res) {
    var albumId = req.params.id;
    //Using the method populate we can get the info of the artist associated to the album
    Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
        if(err) {
            res.status(500).send({
                message: "ERROR getting the album info."
            });
        }
        else {
            if(!album) {
                res.status(404).send({
                    message: "The album does not exist."
                });
            }
            else {
                res.status(200).send({album});
            }
        }
    });
}

function getAlbums(req, res) {
    var artistId = req.params.artist;
    var find;
    if(!artistId) {
        //Getting all albums
        find = Album.find({}).sort('title');
    }
    else {
        //Getting all albums for an artist
        find = Album.find({artist: artistId}).sort('year');
    }
    find.populate({path: 'artist'}).exec((err, albums) => {
        if(err) {
            res.status(500).send({
                message: "ERROR getting the list of albums."
            });
        }
        else {
            if(!albums) {
                res.status(404).send({
                    message: "There are not albums."
                });
            }
            else {
                res.status(200).send({albums});
            }
        }
    });
}

function saveAlbum(req, res) {
    var album = new Album();
    var params = req.body;

    //Adding info to the new album instance
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    //Saving the album
    album.save((err, albumStored) => {
        if(err) {
            res.status(500).send({
                message: 'ERROR trying to save the album.'
            });
        }
        else {
            if(!albumStored) {
                res.status(404).send({
                    message: 'Something was wrong, the album has not been saved.'
                });
            }
            else {
                res.status(200).send({
                    album: albumStored
                });
            }
        }
    });
}

function updateAlbum(req, res) {
    //Getting the albumId as a URL param
    var albumId = req.params.id;
    //Getting the body the album data to update
    var dataToUpdate = req.body;

    Album.findByIdAndUpdate(albumId, dataToUpdate, (err, albumUpdated) => {
        if(err) {
            res.status(500).send({
                message: "ERROR updating the album info."
            });
        }
        else {
            if(!albumUpdated) {
                res.status(404).send({
                    message: "The album cannot be updated."
                });
            }
            else {
                //There will be returned the album with the old info, not the new one
                res.status(200).send({albumUpdated});
            }
        }
    });
}

function deleteAlbum(req, res) {
    var albumId = req.params.id;
    Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
        if(err) {
            res.status(500).send({
                message: "ERROR deleting the album."
            });
        }
        else {
            if(!albumRemoved) {
                res.status(404).send({
                    message: "The album cannot be deleted."
                });
            }
            else {
                //Now, we have to delete songs associated to the deleted Album
                Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
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
                                album: albumRemoved
                            });
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res) {
    var albumId = req.params.id;
    //Default file name
    var file_name = 'Image not uploaded...';

    //Because 'connect-multiparty' module loaded in Album Routes file, we can use right now the global variable 'files'
    if(req.files) {
        //Uploading image. Getting the path file. The 'image' field represents the image's name
        //e.g: uploads\albums\jJzoJ202S2bhRLwNCGpazYC3.jpg
        var file_path = req.files.file.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        //Validating the extension file
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            //Updating image in album profile
            Album.findByIdAndUpdate(albumId, {
                image: file_name
            }, (err, albumUpdated) => {
                if(err) {
                    res.status(500).send({
                        message: "ERROR updating the album info."
                    });
                }
                else {
                    if(!albumUpdated) {
                        res.status(404).send({
                            message: "The album cannot be updated."
                        });
                    }
                    else {
                        //There will be returned the album with the old info, not the new one
                        res.status(200).send({albumUpdated});
                    }
                }
            });
        }
        else {
            res.status(200).send({
                message: "The extension file is not valid."
            });
        }
    }
    else {
        res.status(200).send({
            message: 'You have not uploaded any image.'
        });
    }
}

function getImageFile(req, res) {
    //Image name to retrieve from server images directory
    var imageFile = req.params.imageFile;
    var path_file = './uploads/albums/' + imageFile;

    //Verifying if the image exists in the server images directory
    fs.exists(path_file, (exists) => {
        if(exists) {
            //Sending the image inside the response
            res.sendFile(path.resolve(path_file));
        }
        else {
            res.status(200).send({
                message: 'The image does not exists.'
            });
        }
    });
}

//Exporting the methods for using them in another place of the project
module.exports = {
    getAlbum,
    getAlbums,
    saveAlbum,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
};