//server.js

var express = require('express');
var app = express();
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
var Mountain = require('./app/models/mountain');

//router
var mountainsRoute = require('./app/routes/mountains')(app, Mountain);


app.listen(port);
console.log("starting api on port " + port);
