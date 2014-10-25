var express = require('express');
var router = express.Router();

router.post('/check', function (req, res) {
    var db = req.db;
    
    var ip = req.body.ip;
    //check if exists maybe make a sub routine for the add also.
    var collection = db.get('messagecollection');
    collection.find({"ip" : ip}, {}, function (e, docs) {
        if (docs.length > 0) {
            res.send(true); 
        } else {
            res.send(false);   
        }
    });
});

module.exports = router;