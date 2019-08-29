'use strict'

/****** Artist Controller ******/

//Loading fs and path modules allowing to work with the file system
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

//Loading Models
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

//Controller methods
function getArtist(req, res) {
    var artistId = req.params.id;
    Artist.findById(artistId, (err, artist) => {
        if(err) {
            res.status(500).send({
                message: "ERROR getting the artist info."
            });
        }
        else {
            if(!artist) {
                res.status(404).send({
                    message: "The artist does not exist."
                });
            }
            else {
                res.status(200).send({artist});
            }
        }
    });
}

function getArtists(req, res) {
    var page = 1;
    var itemsPerPage = 4;
    if(req.params.page) {
        page = req.params.page;
    }
    //Getting all artists from database
    Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total) => {
        if(err) {
            res.status(500).send({
                message: 'ERROR getting the artists.'
            });
        }
        else {
            if(!artists) {
                res.status(404).send({
                    message: 'There are not artists to get.'
                });
            }
            else {
                return res.status(200).send({
                    total_items: total,
                    artists: artists
                });
            }
        }
    });
}

function saveArtist(req, res) {
    var artist = new Artist();
    var params = req.body;

    //Adding info to the new artist instance
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    //Saving the artist
    artist.save((err, artistStored) => {
        if(err) {
            res.status(500).send({
                message: 'ERROR trying to save the artist.'
            });
        }
        else {
            if(!artistStored) {
                res.status(404).send({
                    message: 'Something was wrong, the artist has not been saved.'
                });
            }
            else {
                res.status(200).send({
                    artist: artistStored
                });
            }
        }
    });
}

function updateArtist(req, res) {
    //Getting the artistId as a URL param
    var artistId = req.params.id;
    //Getting the body the artist data to update
    var dataToUpdate = req.body;

    Artist.findByIdAndUpdate(artistId, dataToUpdate, (err, artistUpdated) => {
        if(err) {
            res.status(500).send({
                message: "ERROR updating the artist info."
            });
        }
        else {
            if(!artistUpdated) {
                res.status(404).send({
                    message: "The artist cannot be updated."
                });
            }
            else {
                //There will be returned the artist with the old info, not the new one
                res.status(200).send({artistUpdated});
            }
        }
    });
}

function deleteArtist(req, res) {
    var artistId = req.params.id;
    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if(err) {
            res.status(500).send({
                message: "ERROR deleting the artist."
            });
        }
        else {
            if(!artistRemoved) {
                res.status(404).send({
                    message: "The artist cannot be deleted."
                });
            }
            else {
                //Now, we have to delete albums associated to the deleted Artist
                Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
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
                            //Now, we have to delete the songs associated to the deleted Album
                            Song.find({album: albumRemoved._id}).remove((err, songDeleted) => {
                                if(err) {
                                    res.status(500).send({
                                        message: "ERROR deleting the song."
                                    });
                                }
                                else {
                                    if(!songDeleted) {
                                        res.status(404).send({
                                            message: "The song cannot be deleted."
                                        });
                                    }
                                    else {
                                        res.status(200).send({
                                            artist: artistRemoved
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res) {
    var artistId = req.params.id;
    //Default file name
    var file_name = 'Image not uploaded...';

    //Because 'connect-multiparty' module loaded in Artist Routes file, we can use right now the global variable 'files'
    if(req.files) {
        //Uploading image. Getting the path file. The 'image' field represents the image's name
        //e.g: uploads\artist\hz-6vQeKh-U44mkS5RuDOJeS.jpg
        var file_path = req.files.file.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        //Validating the extension file
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            //Updating image in artist profile
            Artist.findByIdAndUpdate(artistId, {
                image: file_name
            }, (err, artistUpdated) => {
                if(err) {
                    res.status(500).send({
                        message: "ERROR updating the artist info."
                    });
                }
                else {
                    if(!artistUpdated) {
                        res.status(404).send({
                            message: "The artist cannot be updated."
                        });
                    }
                    else {
                        //There will be returned the artist with the old info, not the new one
                        res.status(200).send({artistUpdated});
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
    var path_file = './uploads/artists/' + imageFile;

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
    getArtist,
    getArtists,
    saveArtist,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};