'user strict'

/****** User Controller ******/

//Loading fs and path modules allowing to work with the file system
var fs = require('fs');
var path = require('path');

//Loading bcrypt module: This module is used to encrypt passwords
var bcrypt = require('bcrypt-nodejs');

//Loadin 'createToken' method created in services/jwt.js
var jwt = require('../services/jwt');

//Loading User Model
var User = require('../models/user');

//Controller methods
function test(req, res) {
    res.status(200).send({
        message: 'Testing an action from User controller as a part of the API Rest using NodeJS and MongoDB.'
    });
}

function saveUser(req, res) {
    var user = new User(); //New User instance
    var params = req.body; //Getting de params from the request body: 'body-parser' module transforms the data inside the body to a JSON object
    console.log('body-params:');
    console.log(params);

    //Adding info to the new user instance
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    //Persisting the user instance into MongoDB using the Mongoose Save method
    if(params.password) {
        //Encrypting the password using bcrypt module
        bcrypt.hash(params.password, null, null, (err, hash) => {
            user.password = hash;
            console.log('user.password: ' + user.password);
            if(user.name != null && user.surname != null && user.email != null) {
                //Save user
                user.save((err, userStored) => {
                    if(err) {
                        res.status(500).send({
                            message: 'ERROR trying to save the user.'
                        });
                    }
                    else {
                        if(!userStored) {
                            res.status(404).send({
                                message: 'Something was wrong, the user has not been registered.'
                            });
                        }
                        else {
                            res.status(200).send({
                                user: userStored
                            });
                        }
                    }
                });
            }
            else {
                res.status(200).send({
                    message: 'Please, fill empty fields.'
                });
            }
        });
    }
    else {
        res.status(200).send({
            message: 'Introduce a valid password.'
        });
    }

}

function loginUser(req, res) {
    console.log('Entramos en Backend loginUser');
    var params = req.body;
    var email = params.email;
    var password = params.password;

    //Checking if the email exists
    User.findOne({
        email: email.toLowerCase()
    }, (err, user) => {
        if(err) {
            res.status(500).send({
                message: 'ERROR in the request.'
            });
        }
        else {
            if(!user) {
                res.status(404).send({
                    message: 'The user does not exist.'
                });
            }
            else {
                //Verifying the password using bcrypt module
                bcrypt.compare(password, user.password, (err, check) => {
                    if(check) {
                        //Returning the user data loggued in
                        if(params.gethash) {
                            //Returning a JWT token using the User object. 
                            //This token must be passed in the URL for every request to the Rest API in order to authentify the user
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }
                        else {
                            res.status(200).send({user});
                        }
                    }
                    else {
                        res.status(404).send({
                            message: 'The user cannot be loggued in. The email or password are incorrects.'
                        });
                    }
                });
            }
        }
    });
}

function updateUser(req, res) {
    //Getting the userId as a URL param
    var userId = req.params.id;
    //Getting the body the user data to update
    var dataToUpdate = req.body;

    // Comparing the URL userId with the userId from payload object we created in 'authenticated.js' file
    if(userId != req.user.sub) {
        return res.status(500).send({
                    message: "ERROR updating the user info. You do not have grants to upload this user."
                });
    }
    User.findByIdAndUpdate(userId, dataToUpdate, (err, userUpdated) => {
        if(err) {
            res.status(500).send({
                message: "ERROR updating the user info."
            });
        }
        else {
            if(!userUpdated) {
                res.status(404).send({
                    message: "The user cannot be updated."
                });
            }
            else {
                //There will be returned the user with the old info, not the new one
                res.status(200).send({
                    user : userUpdated
                });
            }
        }
    });
}

function uploadImage(req, res) {
    var userId = req.params.id;
    //Default file name
    var file_name = 'Image not uploaded...';

    //Because 'connect-multiparty' module loaded in User Routes file, we can use right now the global variable 'files'
    if(req.files) {
        //Uploading image. Getting the path file. The 'image' field represents the image's path
        //e.g: uploads\users\jJzoJ202S2bhRLwNCGpazYC3.jpg
        var file_path = req.files.image.path; 
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        //Validating the extension file
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            //Updating image in user profile
            User.findByIdAndUpdate(userId, {
                image: file_name
            }, (err, userUpdated) => {
                if(err) {
                    res.status(500).send({
                        message: "ERROR updating the user info."
                    });
                }
                else {
                    if(!userUpdated) {
                        res.status(404).send({
                            message: "The user cannot be updated."
                        });
                    }
                    else {
                        //There will be returned the user with the old info, not the new one and the image filename
                        res.status(200).send({
                            image: file_name,
                            user: userUpdated
                        });
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
    var path_file = './uploads/users/' + imageFile;

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
    test,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};