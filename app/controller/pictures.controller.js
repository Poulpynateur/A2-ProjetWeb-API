'use strict';

var Model     = require('../model/appModel');
var response  = require('./responseManager');

const table = "pictures";

/**
 * Updates a picture in the database to signal that it has been reported.
 * 
 * @param {*} req, the http request
 * @param {*} res, the response to send to the client
 */
exports.report_a_picture = function(req, res) {
  Model.getById("link", table, req.params.pictureId, function(error, link) {
    if(error) {
      response.internalServorError(res);
    } else {

      //Adds ".reported" after the extension of the picture to hide it on the web site and to signal that is has been reported
      link[0].link += ".reported";
      Model.updateById(table, { link : link[0].link }, req.params.pictureId, function(err, report) {
        response.byId(res, err, report);
      });
    }
  });
};

/**
 * Deletes a picture in the database.
 * 
 * @param {*} req, the http request
 * @param {*} res, the response to send to the client
 */
exports.delete_a_picture = function(req, res) {
  Model.removeById(table, req.params.pictureId, function(err, picture) {
    response.byId(res, err, picture);
  });
}