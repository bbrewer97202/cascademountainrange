var express = require('express');
var router = express.Router();

module.exports = function(app, Mountain) {

    router.route('/mountains')
        .get(function(req,res) {
            Mountain.find(function(err, mountains) {
                if (err) {
                    res.send(err);
                }
                res.json(mountains);
            });
        });

    router.route('/mountains/:mountain_id')
        .get(function(req, res) {
            
            Mountain.find({ id: req.params.mountain_id }, function(err, mountain) {
                if (err) {
                    res.send(err);
                }
                res.json(mountain[0]);
            });
        });

    router.route('/region/:region_id')
        .get(function(req, res) {            

            Mountain.find({ state: req.params.region_id.toUpperCase() }, function(err, mountains) {
                if (err) {
                    res.send(err);
                }
                res.json(mountains);
            });
        });

    app.use('/api', router);
}
