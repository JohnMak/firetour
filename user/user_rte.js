/**
 * Created by JohnMak on 23/10/15.
 */
var UserCtl = require('./user_ctl.js');
var express         = require('express');
var auth = require('../auth/auth_ctl.js');
var router = express.Router();

router.route('/')
    .get(auth.isAuthenticated, UserCtl.getUsers)
    .post(auth.isAuthenticated, UserCtl.postUser);

router.route('/:user_id')
    .put(auth.isAuthenticated, UserCtl.putUser)
    .delete(auth.isAuthenticated, UserCtl.deleteUser);

module.exports = router;