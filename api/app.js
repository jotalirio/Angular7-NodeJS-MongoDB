'use strict'

//Loading modules
var express = require('express');
var bodyParser = require('body-parser');

//Defining de Express app
var app = express();

//Loading Routes
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');

//Configuring body-parser over express
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Configuring HTTP Headers to avoid control access problems when we will make petitions to them
app.use((req, res, next) => {
    //Allowing the access to our Rest API from any domain
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API, Origin, X-Requested-With, Content-Type, Accept, Access-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    //To exit from the middleware and continue with the normal execution flow
    next();
});

//Basic routes using the middleware '/api': E.g http://localhost:3977/api/test-controler
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);

//Exporting app
module.exports = app;