'use strict'

/****** User Model ******/

//Loading modules
var mongoose = require('mongoose');

//Loading Mongoose Schema for persist data in MongoDB
var Schema = mongoose.Schema;

//Creating Schema for User model
var UserSchema = Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    role: String,
    image: String
});

//Exporting the User model. We indicates the identity name and the Schema associated
module.exports = mongoose.model('User', UserSchema);