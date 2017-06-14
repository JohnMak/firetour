/**
 * Created by JohnMak on 29/10/15.
 */

var db = require('./database/database.js');

db.init();


var User = require('./user/user_mdl');
var Timezone = require('./timezone/timezone_mdl');

var default_user = {
    username: 'John',
    password: '1q2w',
    is_admin: false
};
var default_admin = {
    username: 'Admin',
    password: '1q2w',
    is_admin: true
};

User.remove(function(err,removed) {});
Timezone.remove(function(err,removed) {});

User.findOne({username: default_user.username}, function (err, old_user) {
    if (old_user) old_user.remove(function(){});

    var user = new User({
        username: default_user.username,
        password: default_user.password,
        is_admin: default_user.is_admin
    });
    console.log('adding user');
    user.save(function(err){
        if (err) {
            console.log(err);
            return done(err);
        }

        User.findOne({username: default_admin.username}, function (err, old_user) {
            if (old_user) old_user.remove();

            var admin = new User({
                username: default_admin.username,
                password: default_admin.password,
                is_admin: default_admin.is_admin
            });

            console.log('adding admin');
            admin.save(function(err) {
                db.close();
            })

        });
    })

});

//setTimeout(function(){
//    console.log('1233')
//},2000);
