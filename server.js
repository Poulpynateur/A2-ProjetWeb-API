const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ip = '127.0.0.1';
const port = process.env.PORT || 3000;

app.listen(port, ip);

console.log('API server started on: ' + ip + ':' + port);

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:8000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
  next();
});

var routes = require('./app/routes/appRoutes');
routes(app);