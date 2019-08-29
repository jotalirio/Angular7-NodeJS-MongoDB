'use strict'

//Loading modules
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'course_secret_key';

//The user object will be codify inside the jwt token (hash)
exports.createToken = (user) => {
    //Data to be codified
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),               //Date when the token is created
        exp: moment().add(30, 'days').unix  //Expire data for the token
    };

    //Encoding the data up above using a secret key
    return jwt.encode(payload, secret);
};


