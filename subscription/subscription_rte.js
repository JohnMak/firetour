var SubscriptionCtl = require('./subscription_ctl');
var express         = require('express');
var auth = require('../auth/auth_ctl.js');
var router = express.Router();

router.route('/')
    .post(SubscriptionCtl.postSubscription)
    .get(SubscriptionCtl.getSubscriptions);

router.route("/:id")
    // .get(auth.isAuthenticated, SubscriptionCtl.getSubscription)
    .put(SubscriptionCtl.putSubscription)
    .delete(SubscriptionCtl.deleteSubscription);


module.exports = router;