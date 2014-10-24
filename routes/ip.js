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
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("/");
            // And forward to success page
            res.redirect("/");
        }
    });
});

router.get('/check', function (req, res) {
    var db = req.db;
    var collection = db.get('messagecollection');
    collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
});

module.exports = router;