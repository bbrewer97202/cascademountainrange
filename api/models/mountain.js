var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MountainSchema = new Schema({
   name: String 
});

module.exports = mongoose.model('Mountain', MountainSchema);
