'use strict';

/** 
 * Sends a created response to the client.
 * 
 * @param {*} res, the response to send to the client
 * @param {array} result, the result of the query in the database
 */
function created(res, result) { 0 === result ? res.status(201).send({message : "Enregistrement correctement créé", status : "success" }) : res.status(201).send({ id : result, message : "Enregistrement correctement créé", status : "success" }); }

/** 
 * Sends an ok response to the client.
 * 
 * @param {*} res, the response to send to the client
 * @param {array} result, the result of the query in the database
 */
function ok(res, result)      { res.status(200).send({ result, message : "Requête effectuée", status : "success" }); }

/**
 * Sends a bad request response to the client.
 * 
 * @param {*} res, the response to send to the client
 * @param {object} err, the error of the query in the database
 */
function badRequest(res, err) { res.status(400).send({ err, message : "Un problème a eu lieu, réessayez plus tard", status : "warning" }); }

/**
 * Sends a not found response to the client.
 * 
 * @param {*} res, the response to send to the client
 */
function notFound(res)        { res.status(404).send({ code : "ER_ID_NOT_FOUND", message : "Cet ID n'existe pas", status : "warning" }); }

/**
 * Sends a bad request response to the client and specifies that a required entry is null.
 * 
 * @param {*} res, the response to send to the client
 * @param {array} result, the result of the query in the database 
 */
exports.nullEntry = function(res, result) {
  res.status(400).send({ code : "ER_NULL_ENTRY", message : result, status : "warning" });
}

/**
 * Sends a not found response to the client and specifies that the user doesn't exist.
 * 
 * @param {*} res, the response to send to the client
 */
exports.userNotFound = function(res) {
  res.status(404).send({ code : "ER_USER_NOT_FOUND", message : "Votre addresse mail n'est pas reconnue", status : "warning" });
}

/**
 * Sends an internal server response to the client.
 * 
 * @param {*} res, the response to send to the client
 */
exports.internalServorError = function(res) { 
  res.status(500).send({ error : true, response : null, status : "warning" });
}

/**
 * Sends a generic response to the client for GET all queries.
 * 
 * @param {*} res, the response to send to the client
 * @param {object} err, the error of the query in the database
 * @param {array} result, the result of the query in the database
 */
exports.getAll = function(res, err, result) {
  if(err) {
    res.status(500).send({ error : true, response : null, status : "warning" });
  } else {
    ok(res, result);
  }
}

/**
 * Sends a generic response to the client for POST queries.
 * 
 * @param {*} res, the response to send to the client
 * @param {object} err, the error of the query in the database
 * @param {array} result, the result of the query in the database
 */
exports.create = function(res, err, result) {
  if(err) {
    badRequest(res, err);
  } else {
    created(res, result);
  }
}

/**
 * Sends a generic response to the client for queries by Id.
 * 
 * @param {*} res, the response to send to the client
 * @param {object} err, the error of the query in the database
 * @param {array} result, the result of the query in the database
 */
exports.byId = function(res, err, result) {
  if(err == "Not found") {
    notFound(res);
  } else if(err) {
    badRequest(res, err);
  } else {
    ok(res, result);
  }
}