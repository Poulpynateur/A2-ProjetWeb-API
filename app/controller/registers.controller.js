'use strict';

var Model     = require('../model/appModel');
var response  = require('./responseManager');

const table = "registers";

/**
 * Creates a register in the database.
 * 
 * @param {*} req, the http request
 * @param {*} res, the response to send to the client
 */
exports.create_a_register = function(req, res) {
  var newRegister = new Model(table, req.body);

  //Handles null error
  if(!newRegister.id_Users || !newRegister.id_Events) {
    response.nullEntry(res, "Renseignez les champs : id_user et id_event");
  } else {
    Model.create(table, newRegister, function(err, register) {
      response.create(res, err, register);
    });
  }
};

/**
 * Deletes a register in the database.
 * 
 * @param {*} req, the http request
 * @param {*} res, the response to send to the client
 */
exports.delete_a_register = function(req, res) {
  Model.removeByIds(table, "id_Events", req.params.userId, req.params.eventId, function(err, register) {
    response.byId(res, err, register);
  });
};