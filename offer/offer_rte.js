var OfferCtl = require('./offer_ctl');
var express         = require('express');
var auth = require('../auth/auth_ctl.js');
var router = express.Router();

router.route('/')
    .post(OfferCtl.postOffer)
    .get(OfferCtl.getOffers);

router.route('/best')
    .get(OfferCtl.bestOffers);

router.route("/:id")
    .delete(OfferCtl.deleteOffer);


module.exports = router;