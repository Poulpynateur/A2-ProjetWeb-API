'use strict';

var Model     = require('../model/appModel');
var response  = require('./responseManager');

const table = "goodies";

/**
 * Lists all the goodies in the database.
 * 
 * @param {*} req, the http request
 * @param {*} res, the response to send to the client
 */
exports.list_all_goodies = function(req, res) {
  const join = "INNER JOIN campuses ON id_Campuses = campuses.id INNER JOIN categories ON id_Categories = categories.id";
  Model.getAll(table + ".id, " + table + ".name, price, description, image, stock, total_orders, category, location", table, function(err, goody) {
    response.getAll(res, err, goody);
  }, join);
};

/**
 * Creates a goody in the database.
 * 
 * @param {*} req, the http request
 * @param {*} res, the response to send to the client
 */
exports.create_a_goody = function(req, res) {
  var newGoody = new Model(table, req.body);

  //Handles null error
  if(!newGoody.name || (!newGoody.price && newGoody.price != 0) || !newGoody.description || (!newGoody.stock && newGoody.stock != 0) ||  !newGoody.id_Categories || !newGoody.id_Campuses) {
    response.nullEntry(res, "Renseignez les champs : name, price, description, stock, id_category et id_campus (optional : image et total_orders)" );
  } else {
    Model.create(table, newGoody, function(err, goody) {
      response.create(res, err, goody);
    });
  }
};

/**
 * Reads a goody in the database.
 * 
 * @param {*} req, the http request
 * @param {*} res, the response to send to the client
 */
exports.read_a_goody = function(req, res) {
  const join = "INNER JOIN campuses ON id_Campuses = campuses.id INNER JOIN categories ON id_Categories = categories.id";
  Model.getById(table + ".name, price, description, image, stock, total_orders, category, location", table, req.params.goodyId, function(err, goody) {
    response.byId(res, err, goody);
  }, join);
};

/**
 * Updates a goody in the database.
 * 
 * @param {*} req, the http request
 * @param {*} res, the response to send to the client
 */
exports.update_a_goody = function(req, res) {
  var row = new Model(table, req.body);

  //Handles null error
  if(!row.name && (!row.price && row.price != 0) && !row.description && (!row.stock && row.stock != 0) && (!row.total_orders && row.total_orders != 0) && !row.id_Categories && !row.id_Campuses &&!row.image) {
    response.nullEntry(res, "Renseignez les champs : name, price, description, stock, total_orders, id_category, id_campus et/ou image" );
  } else {
    Model.updateById(table, row, req.params.goodyId, function(err, goody) {
      response.byId(res, err, goody);
    });
  }
};

/**
 * Deletes a goody in the database.
 * 
 * @param {*} req, the http request
 * @param {*} res, the response to send to the client
 */
exports.delete_a_goody = function(req, res) {
  Model.removeById(table, req.params.goodyId, function(err, goody) {
    response.byId(res, err, goody);
  });
};