var express = require('express');
var router = express.Router();

router.post('/add', function (req, res) {
    var db = req.db;
    
    var ip = req.body.ip;

    var collection = db.get('usercollection');
    collection.insert({
        "ip": ip
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding IP to the database.");
        } else {
            res.location("/");
            res.redirect("/");
        }
    });
});

router.post('/check', function (req, res) {
    var db = req.db;
    
    var ip = req.body.ip;
    //check if exists maybe make a sub routine for the add also.
    var collection = db.get('usercollection');
    collection.find({"ip" : ip}, {}, function (e, docs) {
        if (docs.length > 0) {
            res.send(true); 
        } else {
            res.send(false);   
        }
    });
});

module.exports = router;