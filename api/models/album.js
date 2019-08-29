'use strict'

/****** Album Model ******/

//Loading modules
var mongoose = require('mongoose');

//Loading Mongoose Schema for persist data in MongoDB
var Schema = mongoose.Schema;

//Creating Schema for Album model
var AlbumSchema = Schema({
    title: String,
    description: String,
    year: Number,
    image: String,
    artist: { type: Schema.Types.ObjectId, ref: 'Artist' }
});

//Exporting the Album model. We indicates the identity name and the Schema associated
module.exports = mongoose.model('Album', AlbumSchema);