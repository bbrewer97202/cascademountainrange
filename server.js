//server.js

var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//configuration not stored in source control
var config = require('./config.json');

//configure middleware
app.use(bodyParser());

var port = process.env.PORT || 8080;

//database
//todo: connection failure
mongoose.connect(config.mongo);
var Mountain = require('./api/models/mountain');

//router
var mountainsRoute = require('./api/routes/mountains')(app, Mountain);

//static files
app.use(express.static(path.join(__dirname, '/public')));

app.listen(port);
console.log("starting api on port " + port);
