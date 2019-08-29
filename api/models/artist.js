'use strict'

/****** Artist Model ******/

//Loading modules
var mongoose = require('mongoose');

//Loading Mongoose Schema for persist data in MongoDB
var Schema = mongoose.Schema;

//Creating Schema for Artist model
var ArtistSchema = Schema({
    name: String,
    description: String,
    image: String
});

//Exporting the Artist model. We indicates the identity name and the Schema associated
module.exports = mongoose.model('Artist', ArtistSchema);