/**
 * Created by JohnMak on 29/10/15.
 */

var mongoose = require('mongoose');
var config = require("../config");


module.exports.init = function init(){
    mongoose.connect(config.DB_URI, { server: { poolSize: config.DB_POOL_SIZE }}, function(err) {
        if(err) {
            console.log('connection error', err);
        }
    });
};


module.exports.close = function close(){
    mongoose.connection.close()
};