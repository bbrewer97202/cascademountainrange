//server.js

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//configure middleware
app.use(bodyParser());

var port = process.env.PORT || 8080;

//database
//todo: connection failure
mongoose.connect('mongodb://cmruser:h00dh3l3ns@ds029217.mongolab.com:29217/cascade');
var Mountain = require('./app/models/mountain');

//router
var mountainsRoute = require('./app/routes/mountains')(app, Mountain);


app.listen(port);
console.log("starting api on port " + port);
