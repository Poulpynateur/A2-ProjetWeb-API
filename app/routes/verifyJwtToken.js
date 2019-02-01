'use strict';

const jwt     = require('jsonwebtoken');
const config  = require("../config/config");

var sql = require('../model/db.users_data');

/**
 * Checks whether a token is provided and whether it is verified.
 * 
 * @param {*} req, the http request
 * @param {*} res, the response to send to the client
 * @param {*} next, the next action to do
 */
var verifyToken = function (req, res, next) {
  let token = req.headers['x-access-token'];

  //Checks whether a token is provided
  if(!token || 0 === token.length || "null" === token) {
    res.status(403).send({ auth : false, message : "Aucun token n'a été renseigné (le header < x-access-token > est vide)", status : "warning" });
  } else {
    jwt.verify(token, config.secret, function(err, decoded) {

      //Checks whether the token is verified
      if(err) {
        res.status(500).send({ auth : false, message : "Échec d'authentification. Erreur -> " + err, status : "warning" });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};

/**
 * Checks whether the client has the Membre BDE role.
 * 
 * @param {*} req, the http request
 * @param {*} res, the response to send to the client
 * @param {*} next, the next action to do
 */
var isBdeMember = function(req, res, next) {
  var id = req.userId;

  //Selects the role of the client
  sql.query("SELECT name FROM users INNER JOIN roles ON users.id_role = roles.id WHERE users.id = ?", id, function(err, result) {
    if(result[0].name === "Membre BDE") {
      next();
    } else {
      res.status(403).send({ message : "Requiert le rôle < Membre BDE >", status : "danger" });
    }
  });
};

/**
 * Checks whether the client has the Personnel CESI role.
 * 
 * @param {*} req, the http request
 * @param {*} res, the response to send to the client
 * @param {*} next, the next action to do
 */
var isCesiEmployee = function(req, res, next) {
  var id = req.userId;

  //Selects the role of the client
  sql.query("SELECT name FROM users INNER JOIN roles ON users.id_role = roles.id WHERE users.id = ?", id, function(err, result) {
    if(result[0].name === "Personnel CESI") {
      next();
    } else {
      res.status(403).send({ message : "Requiert le rôle < Personnel CESI >", status : "danger" });
    }
  });
};

/**
 * Checks whether the client has the Membre BDE or Personnel CESI role.
 * 
 * @param {*} req, the http request
 * @param {*} res, the response to send to the client
 * @param {*} next, the next action to do
 */
var isBdeMemberOrCesiEmployee = function(req, res, next) {
  var id = req.userId;

  //Select the role of the client
  sql.query("SELECT name FROM users INNER JOIN roles ON users.id_role = roles.id WHERE users.id = ?", id, function(err, result) {
    if(result[0].name === "Membre BDE" || result[0].name === "Personnel CESI") {
      next();
    } else {
      res.status(403).send({ message : "Requiert le rôle < Membre BDE ou Personnel CESI >", status : "danger" });
    }
  });
}

const authJwt = {};
authJwt.verifyToken               = verifyToken;
authJwt.isBdeMember               = isBdeMember;
authJwt.isCesiEmployee            = isCesiEmployee;
authJwt.isBdeMemberOrCesiEmployee = isBdeMemberOrCesiEmployee;

module.exports = authJwt;