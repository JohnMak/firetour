var express = require('express');
var router = express.Router();

var offer = require('../offer/offer_mdl');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendfile('views/index.html');
});


router.get('/addoffer', function(req, res, next) {
    res.sendfile('views/addoffer.html');
});
router.get('/subscribers', function(req, res, next) {
    res.sendfile('views/subscribers.html');
});

module.exports = router;
