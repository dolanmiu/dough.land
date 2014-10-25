var express = require('express');
var router = express.Router();


router.post('/add', function (req, res) {
    var db = req.db;

    var name = req.body.name;
    var email = req.body.email;
    var comment = req.body.comment;
    var xPos = req.body.xPos;
    var zPos = req.body.zPos;
    var ip = req.body.ip;

    // Set our collection
    var collection = db.get('messagecollection');

    collection.find({
        "ip": ip
    }, {}, function (e, docs) {
        if (docs.length > 0) {
            res.status(500).send("User already posted before");
        } else {
            collection.insert({
                "username": name,
                "email": email,
                "comment": comment,
                "xPos": xPos,
                "zPos": zPos,
                "ip": ip
            }, function (err, doc) {
                if (err) {
                    res.status(500).send("There was a problem adding the information to the database.");
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });
});

router.get('/get', function (req, res) {
    var db = req.db;

    var collection = db.get('messagecollection');
    collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
});

router.post('/delete', function (req, res) {
    var db = req.db;
    var ip = req.body.ip;

    var collection = db.get('messagecollection');
    collection.remove({"ip": ip}, {}, function (e, docs) {
        if (e) {
            res.status(500).send("There was a problem deleting the message to the database.");
        } else {
            res.sendStatus(200);
        }
    });
});

module.exports = router;