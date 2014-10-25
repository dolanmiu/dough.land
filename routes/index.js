var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    var db = req.db;
    var collection = db.get('messagecollection');
    collection.find({}, {}, function (e, docs) {
        res.render('index', {
            title: 'Express',
            "messages": docs
        });
    });

});

router.get('/messages', function (req, res) {
    var db = req.db;
    var collection = db.get('messagecollection');
    collection.find({}, {}, function (e, docs) {
        res.render('messagelist', {
            "messages": docs
        });
    });
});

module.exports = router;