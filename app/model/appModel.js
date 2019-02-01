'use strict';

var sql = require('./db.site_data');

var Model = function(table, model) {
  //Campus object constructor
  if(table === "campuses") {
    this.location = model.location;
  }
  //Event object constructor
  else if(table === "events") {
    if(model.name)                      { this.name                 = model.name; }
    if(model.description)               { this.description          = model.description; }
    if(model.image)                     { this.image                = model.image }
    if(model.date)                      { this.date                 = model.date; }
    if(model.price || model.price == 0) { this.price_participation  = model.price; }
    if(model.id_user)                   { this.id_Users             = model.id_user; }
    if(model.id_campus)                 { this.id_Campuses          = model.id_campus; }
    if(model.id_repetition)             { this.id_Repetitions       = model.id_repetition; }
    if(model.id_approbation)            { this.id_Approbations      = model.id_approbation; }
  }
  //Goody object constructor
  else if(table === "goodies") {
    if(model.name)                      { this.name           = model.name; }
    if(model.price || model.price == 0) { this.price          = model.price; }
    if(model.description)               { this.description    = model.description; }
    if(model.stock || model.stock == 0) { this.stock          = model.stock; }
    if(model.total_orders)              { this.total_orders   = model.total_orders; }
    if(model.id_category)               { this.id_Categories  = model.id_category; }
    if(model.id_campus)                 { this.id_Campuses    = model.id_campus; }
    if(model.image)                     { this.image          = model.image; }
  }
  //Register object constructor
  else if(table === "registers") {
    this.id_Users   = model.id_user;
    this.id_Events  = model.id_event;
  }
  //Like object constructor
  else if(table === "likes") {
    this.id_Users     = model.id_user;
    this.id_Pictures  = model.id_picture;
  }
  //Vote object constructor
  else if(table === "votes") {
    this.id_Users   = model.id_user;
    this.id_Events  = model.id_event;
  }
  //Category object contructor
  else if(table === "categories") {
    this.category = model.category;
  }
};

/**
 * Inserts a new row into the database.
 * 
 * @param {string} table, the name of the table to query
 * @param {object} newRow, the values to insert
 * @param {function} result, the function using the result of the sql query
 */
Model.create = function(table, newRow, result) {
  sql.query("INSERT INTO " + table + " SET ?", newRow, function(err, res) {
    if(err) {
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};

/**
 * Selects a row in the database.
 * 
 * @param {string} fields, the fields to select
 * @param {string} table, the name of the table to query
 * @param {int} rowId, the Id of the row to select
 * @param {function} result, the function using the result of the sql query
 * @param {string} join, the join query (optional)
 */
Model.getById = function(fields, table, rowId, result, join = "") {
  sql.query("SELECT " + fields + " FROM " + table + " " + join + " WHERE " + table + ".id = ?", rowId, function(err, res) {
    if(err) {
      result(err, null);
    } else if(res.length == 0) {
      err = "Not found";
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

/**
 * Selects all rows in the database.
 * 
 * @param {string} fields, the fields to select
 * @param {string} table, the name of the table to query
 * @param {function} result, the function using the result of the sql query
 * @param {string} join, the join query (optional)
 */
Model.getAll = function(fields, table, result, join = "") {
  sql.query("SELECT " + fields + " FROM " + table + " " + join, function(err, res) {
    if(err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

/**
 * Updates a row in the database.
 * 
 * @param {string} table, the name of the table to query
 * @param {object} row, the fields and values to update
 * @param {int} rowId, the Id of the row to update
 * @param {function} result, the function using the result of the sql query
 */
Model.updateById = function(table, row, rowId, result) {
  sql.query("UPDATE " + table + " SET ? WHERE id = ?", [row, rowId], function(err, res) {
    if(err) {
      result(err, null);
    } else if(res.affectedRows === 0) {
      err = "Not found";
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

/**
 * Changes the current top event to simple event in the database.
 * 
 * @param {function} result, the function using the result of the sql query
 */
Model.updateLastTopEvent = function(result) {
  //Selects the top event
  sql.query("SELECT id FROM events WHERE id_Approbations = 4", function(error, row) {
    if(error) {
      result(err, null);
      //Checks whether there is a top event in the database
    } else if(row.length != 0) {
      sql.query("UPDATE events SET id_Approbations = 2 WHERE id = ?", row[0].id, function(err, res) {
        if(err) {
          result(err, null);
        } else {
          result(null, res);
        }
      });
    } else {
      result(null, row);
    }
  });
};

/**
 * Removes a row in the database by giving one Id.
 * 
 * @param {string} table, the name of the table to query
 * @param {int} rowId, the Id of the row to remove
 * @param {function} result, the function using the result of the sql query
 */
Model.removeById = function(table, rowId, result) {
  sql.query("DELETE FROM " + table + " WHERE id = ?", rowId, function(err, res) {
    if(err) {
      result(err, null);
    } else if(res.affectedRows === 0) {
      err = "Not found";
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

/**
 * Removes a row in the database by giving two Ids.
 * 
 * @param {string} table, the name of the table to query
 * @param {string} id_Name, the name of the second Id
 * @param {string} id_user, the Id of the user to remove
 * @param {int} id, the Id of the id_Name to remove
 * @param {function} result, the function using the result of the sql query
 */
Model.removeByIds = function(table, id_Name, id_user, id, result) {
  sql.query("DELETE FROM " + table + " WHERE id_Users = ? AND " + id_Name + " = ?", [id_user, id], function(err, res) {
    if(err) {
      result(err, null);
    } else if(res.affectedRows === 0) {
      err = "Not found";
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

/**
 * Selects a role in the database.
 * 
 * @param {int} rowId, the Id of the row to select
 * @param {function} result, the function using the result of the sql query
 */
Model.getRole = function(rowId, result) {
  sql.query("SELECT users_data.roles.name FROM site_data.events events INNER JOIN users_data.users users ON events.id_Users = users.id INNER JOIN users_data.roles roles ON users.id_role = roles.id WHERE users.id = ?", rowId, function(err, res) {
    if(err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
}

module.exports = Model;