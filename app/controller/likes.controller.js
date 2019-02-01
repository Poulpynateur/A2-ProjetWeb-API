'use strict';

var Model     = require('../model/appModel');
var response  = require('./responseManager');

const table = "likes";

/**
 * Creates a like in the database.
 * 
 * @param {*} req, the http request
 * @param {*} res, the response to send to the client
 */
exports.create_a_like = function(req, res) {
  var newLike = new Model(table, req.body);

  //Handles null error
  if(!newLike.id_Users || !newLike.id_Pictures) {
    response.nullEntry(res, "Renseignez les champs : id_user et id_picture");
  } else {
    Model.create(table, newLike, function(err, like) {
      response.create(res, err, like);
    });
  }
};

/**
 * Deletes a like in the database.
 * 
 * @param {*} req, the http request
 * @param {*} res, the response to send to the client
 */
exports.delete_a_like = function(req, res) {
  Model.removeByIds(table, "id_Pictures", req.params.userId, req.params.pictureId, function(err, like) {
    response.byId(res, err, like);
  });
};