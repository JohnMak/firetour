var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../user/user_mdl.js');

passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {

            User.findOne({ 'username' :  username },
                function(err, user) {

                    if (err)
                        return done(err);

                    if (!user){
                        console.log('User Not Found with username '+username);
                        return done(null, false,
                            req.flash('message', 'User Not found.'));
                    }
                    user.verifyPassword(password, function(err, is_match){
                        if (err)
                            return done(err);
                        if (is_match) {
                            return done(null, user);
                        }
                        else
                            return done('wrong');
                    });
                }
            );
        }
    )
);


passport.use('signup', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {
            findOrCreateUser = function(){
                User.findOne({'username':username},function(err, user) {
                    if (err){
                        console.log('Error in SignUp: '+err);
                        return done(err);
                    }

                    if (user) {
                        return done(null, false,
                            req.flash('message','User Already Exists'));
                    } else {

                        var newUser = new User();
                        newUser.username = username;
                        newUser.password = password;

                        newUser.save(function(err) {
                            if (err){
                                console.log('Error in Saving user: '+err);
                                throw err;
                            }
                            return done(null, newUser);
                        });
                    }
                });
            };

            process.nextTick(findOrCreateUser);
        })
);


passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});






module.exports.isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.sendStatus(401)
};












//var BasicStrategy = require('passport-http').BasicStrategy;
//
//passport.use(new BasicStrategy(
//    function(username, password, callback) {
//        User.findOne({ username: username }, function (err, user) {
//            if (err) { return callback(err); }
//
//            // No user found with that username
//            if (!user) { return callback(null, false); }
//
//            // Make sure the password is correct
//            user.verifyPassword(password, function(err, isMatch) {
//                if (err) { return callback(err); }
//
//                // Password did not match
//                if (!isMatch) { return callback(null, false); }
//
//                // Success
//                return callback(null, user);
//            });
//        });
//    }
//));
//
//module.exports.isAuthenticated = passport.authenticate('basic', { session : false });