/**
 * Created by JohnMak on 25/10/15.
 */
var AuthCtl = require('./auth_ctl.js');
var passport = require('passport');
var express         = require('express');
var router = express.Router();



router.post('/login', function(req, res, next) {
    passport.authenticate('login', function(err, user, info) {
        if (err) {
            if (err == 'wrong')
                return res.status(400).send('wrong credentials');
            return next(err);
        }
        if (!user) {
            return res.status(400).send('no user');
        }

        req.logIn(user, function(err) {
            if (err) {
                console.log('wrong credentials');
                return res.sendStatus(500);
            }
            res.json(user);
            return res.status(200);
        });
    })(req, res, next);

});


router.post('/signup', function(req, res, next) {
    passport.authenticate('signup', function(err, user, info) {
        if (err) {
            return next(err); }

        if (!user) {
            return res.status(400).send('username exist');
        }

        req.logIn(user, function(err) {
            if (err) { return next(err); }
            res.json(user);
            return res.status(200);
        });
    })(req, res, next);
});

router.get('/', AuthCtl.isAuthenticated, function(req, res) {
        res.json(req.user);
        res.sendStatus(200);
    });

router.get('/signout', function(req, res) {
    req.logout();
    res.sendStatus(200);
});

//router.route('/login')
//    .get(AuthCtl.)
//    .post(UserCtl.postUser);
//
//router.route('/:user_id')
//    .get(auth.isAuthenticated, UserCtl.getUser)
//    .delete(auth.isAuthenticated, UserCtl.deleteUser);

module.exports = router;