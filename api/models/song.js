'use strict'

/****** Song Model ******/

//Loading modules
var mongoose = require('mongoose');

//Loading Mongoose Schema for persist data in MongoDB
var Schema = mongoose.Schema;

//Creating Schema for Song model
var SongSchema = Schema({
    number: String,
    name: String,
    duration: String,
    file: String,
    album: { type: Schema.Types.ObjectId, ref: 'Album' }
});

//Exporting the Song model. We indicates the identity name and the Schema associated
module.exports = mongoose.model('Song', SongSchema);