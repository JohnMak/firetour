var TimezoneCtl = require('./timezone_ctl');
var express         = require('express');
var auth = require('../auth/auth_ctl.js');
var router = express.Router();

router.route('/')
    .post(auth.isAuthenticated, TimezoneCtl.postTimezone)
    .get(auth.isAuthenticated, TimezoneCtl.getTimezones);

router.route('/by-user/:user_id')
    .post(auth.isAuthenticated, TimezoneCtl.postUserTimezone)
    .get(auth.isAuthenticated, TimezoneCtl.getUserTimezones);

router.route("/:timezone_id")
    .get(auth.isAuthenticated, TimezoneCtl.getTimezone)
    .put(auth.isAuthenticated, TimezoneCtl.putTimezone)
    .delete(auth.isAuthenticated, TimezoneCtl.deleteTimezone);


module.exports = router;