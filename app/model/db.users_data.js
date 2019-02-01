'use strict';

var mysql = require('mysql');

//Local mysql database connection
var connection = mysql.createConnection( {
  host      : 'localhost',
  user      : 'root',
  password  : '',
  database  : 'users_data'
});

connection.connect(function(err) {
  if(err) throw err;
});

module.exports = connection;