'use strict'

/****** Middleware ******/

//Note: This middleware will be executed before any request to the Rest API

//Loading modules
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'course_secret_key';

//This method will receive a request, response and the 'next' object to get out of the middleware
exports.ensureAuth = (req, res, next) => {
    //The token (hash) will be passed by the Auth Http Header
    if(!req.headers.authorization) {
        return res.status(403).send({
            message: 'The Auth Header does not exist in the request.'
        });
    }
    //The token can have ' or " character so we have to remove them using the javascript replace method
    var token = req.headers.authorization.replace(/['"]+/g, '');
    try {
        //Desencrypting the token (hash)
        var payload = jwt.decode(token, secret);
        //Checking the expiration date from the token
        if(payload.exp <= moment.unix()) {
            //The token has expired
            res.status(404).send({
                message: 'The token has expirated.'
            });
        }
    }
    catch(ex) {
        console.log(ex);
        return res.status(404).send({
            message: 'Invalid token.'
        });
    }

    //Adding the user to the request
    req.user = payload;

    //Ussing next to exit from the middleware
    next();
};

