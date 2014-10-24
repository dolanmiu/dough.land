var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('messagecollection');
    collection.find({},{},function(e,docs){
        res.render('index', { 
            title: 'Express',
            "messages" : docs
        });
    });
  
});

router.get('/messages', function(req, res) {
    var db = req.db;
    var collection = db.get('messagecollection');
    collection.find({},{},function(e,docs){
        res.render('messagelist', {
            "messages" : docs
        });
    });
});

router.post('/addmessage', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var name = req.body.name;
    var email = req.body.email;
    var comment = req.body.comment;
    var xPos = req.body.xPos;
    var zPos = req.body.zPos;

    // Set our collection
    var collection = db.get('messagecollection');

    // Submit to the DB
    collection.insert({
        "username" : name,
        "email" : email,
        "comment" : comment,
        "xPos" : xPos,
        "zPos" : zPos
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        } else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("/");
            // And forward to success page
            res.redirect("/");
        }
    });
});

router.get('/getmessages', function(req, res) {
    var db = req.db;
    var collection = db.get('messagecollection');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});


module.exports = router;
