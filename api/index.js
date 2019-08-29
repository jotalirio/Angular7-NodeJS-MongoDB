'use strict'

//Loading mongoose module in order to work with MongoDB
var mongoose = require('mongoose');

//Loading app.js file: this file have configuration over Express, routes, etc. Fichero de carga central
var app = require('./app');

//Defining a port for the Web Server. Si lo tuvieramos definido en las variables de entorno lo cogeria de ahi -> process.env.PORT
var port = process.env.PORT || 3977;

//Connecting with mongoDB database
const connectOptions = {};
connectOptions.useNewUrlParser = true;
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean2', connectOptions, (err, res) => {
    if(err) {
        console.log("ERROR connecting to database!!!")
        throw err;
    }
    else {
        console.log("The connection to database is success!!!")
        //Web Server listening at defined port up above 
        app.listen(port, function() {
            console.log('Music Web Server listening at http://localhost:' + port);
        });
    }
});
