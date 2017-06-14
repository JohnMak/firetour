var request     = require('supertest');
var session     = require('supertest-session');
var superagent  = require('superagent');
var should      = require('should');
var assert      = require('assert');

var db          = require('../database/database.js');
var User        = require('../user/user_mdl');
var Timezone    = require('../timezone/timezone_mdl');
var data        = require('./data.js');
var clear_db    = require('./clear_db.js');


describe('REST safety testing', function () {
    var url = data.server_url;


    var agent_user          = superagent.agent();
    var agent_admin         = superagent.agent();

    var test_user           = data.test_user;
    var test_user_updated   = data.test_user_updated;
    var test_user_two       = data.test_user_two;
    var test_admin          = data.test_admin;
    var test_admin_updated  = data.test_admin_updated;

    var test_timezones_array = data.test_timezones;

    var test_user_id = "";
    var test_timezone_one_id = "";
    var test_timezone_two_id = "";
    var test_admin_id = "";

    before(function (done) {

        db.init();
        clear_db(function () {
            User.create(test_admin, function (err, user) {
                if (err) throw "Couldn't create test_admin in DB";
                test_admin_id = "" + user._id;
                agent_admin
                    .post(url+'/api/auth/login')
                    .send(test_admin)
                    .end(function(err, res) {
                        User.create(test_user, function (err, user) {
                            if (err) throw "Couldn't create test_admin in DB";
                            test_user_id = "" + user._id;
                            agent_user
                                .post(url+'/api/auth/login')
                                .send(test_user)
                                .end(function(err, res) {
                                    agent_admin
                                        .post(url+'/api/timezone/by-user/'+test_user_id)
                                        .send(test_timezones_array[0])
                                        .end(function(err, res) {
                                            test_timezone_one_id = res.body.data._id;
                                            agent_admin
                                                .post(url+'/api/timezone/by-user/'+test_admin_id)
                                                .send(test_timezones_array[1])
                                                .end(function(err, res) {
                                                    test_timezone_two_id = res.body.data._id;
                                                    done()
                                                });
                                        });
                                });
                        });
                    });
            });
        })
    });
    after(function (done) {
        clear_db(function () {
            db.close();
            done();
        })
    });

    describe('User trying to act as an admin', function () {
        it('Denying to add user', function(done) {
            agent_user
                .post(url+'/api/user')
                .send(test_user_two)
                .end(function(err, res){
                    res.status.should.equal(400, "Permissions hole");
                    done();
                })
        });
        it('Denying to edit user', function(done) {
            agent_user
                .put(url+'/api/user/'+test_admin_id)
                .send(test_user_two)
                .end(function(err, res){
                    res.status.should.equal(400, "Permissions hole");
                    done();
                })
        });
        it('Denying to delete user', function(done) {
            agent_user
                .del(url+'/api/user/'+test_admin_id)
                .end(function(err, res){
                    res.status.should.equal(400, "Permissions hole");
                    done();
                })
        });
        it('Denying to add timezone to users', function(done) {
            agent_user
                .post(url+'/api/timezone/by-user/'+test_admin_id)
                .send(test_timezones_array[2])
                .end(function(err, res){
                    res.status.should.equal(400, "Permissions hole");
                    done();
                })
        });
        it('Denying to list users timezones', function(done) {
            agent_user
                .get(url+'/api/timezone/by-user/'+test_admin_id)
                .end(function(err, res){
                    res.status.should.equal(400, "Permissions hole");
                    done();
                })
        });
        it('Denying to get users timezone', function(done) {
            agent_user
                .get(url+'/api/timezone/'+test_timezone_two_id)
                .end(function(err, res){
                    res.status.should.equal(400, "Permissions hole");
                    done();
                })
        });
        it('Denying to edit users timezone', function(done) {
            agent_user
                .put(url+'/api/timezone/'+test_timezone_two_id)
                .send(test_timezones_array[2])
                .end(function(err, res){
                    res.status.should.equal(400, "Permissions hole");
                    done();
                })
        });
        it('Denying to remove users timezone', function(done) {
            agent_user
                .del(url+'/api/timezone/'+test_timezone_two_id)
                .send(test_timezones_array[2])
                .end(function(err, res){
                    res.status.should.equal(400, "Permissions hole");
                    done();
                })
        });
    });




});