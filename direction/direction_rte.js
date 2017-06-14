var DirectionCtl = require('./direction_ctl');
var express         = require('express');
var auth = require('../auth/auth_ctl.js');
var router = express.Router();

router.route('/')
    .post(DirectionCtl.postDirection)
    .get(DirectionCtl.getDirections);
//
// router.route('/by-user/:user_id')
//     .post(auth.isAuthenticated, DirectionCtl.postUserDirection)
//     .get(auth.isAuthenticated, DirectionCtl.getUserDirections);
//

router.route("/:id")
    // .get(auth.isAuthenticated, DirectionCtl.getDirection)
    .put(DirectionCtl.putDirection)
    .delete(DirectionCtl.deleteDirection);


module.exports = router;