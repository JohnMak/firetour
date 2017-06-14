
var User = require('../user/user_mdl');
var Timezone = require('../timezone/timezone_mdl');

var data = require('./data');


function clear_db(done){
    User.findOne({username: data.test_user.username}, function (err, user) {
        if (user) user.remove();
        User.findOne({username: data.test_admin.username}, function (err, user) {
            if (user) {
                user.remove(function(){
                    done();
                })
            }
            else{
                done();
            }
        });
    });
}

module.exports = clear_db;
