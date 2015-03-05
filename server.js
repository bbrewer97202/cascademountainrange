//server.js

var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//configuration not stored in source control
var mongoConnect = process.env.MONGO_CONNECT || require('./config.json').mongo;

//configure middleware
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 8080));

//database
//todo: connection failure
mongoose.connect(mongoConnect);
var Mountain = require('./api/models/mountain');

//router
var mountainsRoute = require('./api/routes/mountains')(app, Mountain);

//static files
app.use(express.static(path.join(__dirname, '/public')));

app.listen(app.get('port'), function() {
	console.log("starting api on port " + app.get('port'));	
});

