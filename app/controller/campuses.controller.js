'use strict';

var Model     = require('../model/appModel');
var response  = require('./responseManager');

const table = "campuses";

/**
 * Lists all the campuses in the database.
 * 
 * @param {*} req, the http request
 * @param {*} res, the response to send to the client
 */
exports.list_all_campuses = function(req, res) {
  Model.getAll("*", table, function(err, campus) {
    response.getAll(res, err, campus);
  });
};

/**
 * Creates a campus in the daatabase.
 * 
 * @param {*} req, the http request
 * @param {*} res, the response to send to the client
 */
exports.create_a_campus = function(req, res) {
  var newCampus = new Model(table, req.body);

  //Handles null error
  if(!newCampus.location) {
    response.nullEntry(res, "Renseignez le champ location");
  } else {
    Model.create(table, newCampus, function(err, campus) {
      response.create(res, err, campus);
    });
  }
};

/**
 * Reads a campus in the database.
 * 
 * @param {*} req, the http request
 * @param {*} res, the response to send to the client
 */
exports.read_a_campus = function(req, res) {
  Model.getById("location", table, req.params.campusId, function(err, campus) {
    response.byId(res, err, campus);
  });
};

/**
 * Updates a campus in the database.
 * 
 * @param {*} req, the http request
 * @param {*} res, the response to send to the client
 */
exports.update_a_campus = function(req, res) {
  var row = new Model(table, req.body);

  //Handles null error
  if(!row.location) {
    response.nullEntry(res, "Renseignez le champ location");
  } else {
    Model.updateById(table, row, req.params.campusId, function(err, campus) {
      response.byId(res, err, campus);
    });
  }
};

/**
 * Deletes a campus in the database.
 * 
 * @param {*} req, the http request
 * @param {*} res, the response to send to the client
 */
exports.delete_a_campus = function(req, res) {
  Model.removeById(table, req.params.campusId, function(err, campus) {
    response.byId(res, err, campus);
  });
};