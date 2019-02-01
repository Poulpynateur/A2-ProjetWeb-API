'use strict';

const config = require('../config/config');

var jwt       = require('jsonwebtoken');
var bcrypt    = require('bcryptjs');
var sql       = require('../model/db.users_data');
var response  = require('./responseManager');

/**
 * Signs in to the API to get a token that will be use to send request to the API.
 * 
 * @param {*} req, the http request
 * @param {*} res, the response to send to the client
 */
exports.signin = function (req, res) {
  let email = req.body.email;

  //Handles null error
  if(!email) {
    response.nullEntry(res, "Veuillez renseignez votre adresse mail (champ : email)");
  } else {
    sql.query("SELECT id, email, password FROM users WHERE email = ?", email, function(err, result) {

      //Checks whether the email address exists in the database
      if(err) {
        res.status(500).send(err);
      } else if(result.length === 0) {
        response.userNotFound(res);
      } else {
        let password = req.body.password;

        //Handles null error
        if(!password) {
          response.nullEntry(res, "Veuillez renseignez votre mot de passe (champ : password)");
        } else {
          //Checks whether the typed password is correct
          var passwordIsValid = bcrypt.compareSync(password, result[0].password);
          if(!passwordIsValid && password != result[0].password) {
            res.status(401).send({ auth : false, accessToken : null, message : "Mot de passe invalide" });
          } else {
            //Generates a token and send it within the response
            var token = jwt.sign({ id : result[0].id }, config.secret, { expiresIn : 86400 });
            res.status(200).send({ auth : true, accessToken : token });
          }
  
        }
      }
    });
  }
}