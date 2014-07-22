var express = require('express');
var router = express.Router();

module.exports = function(app, Mountain) {

    router.use(function(req, res, next) {
        console.log("something is happening");
        next();
    });

    //angular js partials
    // router.route('/partials')
    //     .get(function(res, req) {
    //         var filename = req.params.filename;
    //         if(!filename) return;  // might want to change this
    //         res.render("partials/" + filename );
    //     });

    router.route('/mountains')
        .post(function(req, res) {
            var mountain = new Mountain();
            mountain.name = req.body.name;

            mountain.save(function(err) {
                if (err) {
                    res.send(err);
                }
                res.json({
                    message: 'mountain created'
                });
            });
        })
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
            Mountain.findById(req.params.mountain_id, function(err, mountain) {
                if (err) {
                    res.send(err);
                }
                res.json(mountain);
            });
        });
        // .put(function(req, res) {
        //     Mountain.findById(req.params.mountain_id, function(err, mountain) {
        //         if (err) {
        //             res.send(err);
        //         }
        //         mountain.name = req.body.name;
        //         mountain.save(function(err) {
        //             if (err) {
        //                 res.send(err);
        //             }
        //             res.json({
        //                 message: 'mountain updated'
        //             });
        //         });
        //     });
        // });

    app.use('/api', router);
}
