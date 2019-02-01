'use strict';

var Model     = require('../model/appModel');
var response  = require('./responseManager');

const table = "events";

/**
 * Lists all the events in the database.
 * 
 * @param {*} req, the http request
 * @param {*} res, the response to send to the client
 */
exports.list_all_events = function(req, res) {
  const join = "INNER JOIN campuses ON id_Campuses = campuses.id INNER JOIN repetitions ON id_Repetitions = repetitions.id INNER JOIN approbations ON id_Approbations = approbations.id INNER JOIN users_data.users users ON id_Users = users.id";
  Model.getAll(table + ".id, name, description, image, date, price_participation, firstname, lastname, location, repetition, approbation", table, function(err, event) {
    response.getAll(res, err, event);
  }, join);
};

/**
 * Creates an event in the database.
 * 
 * @param {*} req, the http request
 * @param {*} res, the response to send to the client
 */
exports.create_an_event = function(req, res) {
  var newEvent = new Model(table, req.body);

  //Handles null error
  if(!newEvent.name || !newEvent.description || !newEvent.image || !newEvent.date || (!newEvent.price_participation && newEvent.price_participation != 0) || !newEvent.id_Users || !newEvent.id_Campuses || !newEvent.id_Repetitions) {
    response.nullEntry(res, "Renseignez les champs : name, description, image, date (yyyy/mm/dd), price, id_user, id_campus et id_repetition");
  } else {
    Model.getRole(req.userId, function(error, result) {
      if(error) {
        response.internalServorError(error);

      //Checks whether the event has been approved by a BDE Member
      } else if(req.body.approved === 'approved' && ((result[0].name) ? result[0].name : result.name) === "Membre BDE") {

        //Checks whether the event to create is the top event (event of the month)
        if(!req.body.topEvent) {
          newEvent.id_Approbations = 2;
          Model.create(table, newEvent, function(err, event) {
            response.create(res, err, event);
          });
        } else {
          newEvent.id_Approbations = 4;

          //Changes the top event : the last one become a simple event
          Model.updateLastTopEvent(function(err, event) {
            if(err) {
              response.internalServorError(res);
            } else {
              Model.create(table, newEvent, function(err, event) {
                response.create(res, err, event);
              });
            }
          });
        }

      } else {
        Model.create(table, newEvent, function(err, event) {
          response.create(res, err, event);
        });
      }

    });
  }
};

/**
 * Reads an event in the database.
 * 
 * @param {*} req, the http request
 * @param {*} res, the response to send to the client
 */
exports.read_an_event = function(req, res) {
  const join = "INNER JOIN campuses ON id_Campuses = campuses.id INNER JOIN repetitions ON id_Repetitions = repetitions.id INNER JOIN approbations ON id_Approbations = approbations.id INNER JOIN users_data.users users ON id_Users = users.id";
  Model.getById("name, description, image, date, price_participation, firstname, lastname, location, repetition, approbation", table, req.params.eventId, function(err, event) {
    response.byId(res, err, event);
  }, join);
};

/**
 * Updates an event in the database.
 * 
 * @param {*} req, the http request
 * @param {*} res, the response to send to the client
 */
exports.update_an_event = function(req, res) {
  var row = new Model(table, req.body);
  if(row.image == "default path") { delete(row.image); }

  //Handles null error
  if(!row.name && !row.description && !row.image && !row.date && (!row.price_participation && row.price_participation != 0) && !row.id_Users && !row.id_Campuses && !row.id_Repetitions && !row.id_Approbations) {
    response.nullEntry(res, "Renseignez les champs : name, description, image, date (yyyy/mm/dd), price, id_user, id_campus, id_repetition et/ou id_approbation");
  } else {
    Model.updateById(table, row, req.params.eventId, function(err, event) {
      response.byId(res, err, event);
    });
  }
};

/**
 * Deletes an event in the database.
 * 
 * @param {*} req, the http request
 * @param {*} res, the response to send to the client
 */
exports.delete_an_event = function(req, res) {
  Model.removeById(table, req.params.eventId, function(err, event) {
    response.byId(res, err, event);
  });
};