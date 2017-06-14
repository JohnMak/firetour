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


describe('Admin REST testing', function () {
    var url = data.server_url;


    var agent_user          = superagent.agent();
    var agent_admin         = superagent.agent();

    var test_user           = data.test_user;
    var test_user_updated   = data.test_user_updated;
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
                        done()
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

    describe('Admin edits user', function () {
        it('Add user', function (done) {
            agent_admin
                .post(url + '/api/user')
                .send(test_user)
                .end(function (err, res) {
                    res.status.should.equal(200, "Bad response status");
                    test_user_id = res.body._id;
                    done();
                })
        });
        it('Change user\'s password', function (done) {
            agent_admin
                .put(url + '/api/user/' + test_user_id)
                .send({password: test_admin_updated.password})
                .end(function (err, res) {
                    res.status.should.equal(200, "Bad response status");


                    agent_user
                        .post(url + '/api/auth/login')
                        .send(test_user_updated)
                        .end(function (err, res) {
                            res.status.should.equal(200, "Use authentication problems with changed password");
                            done()
                        });
                })
        });
    })
    describe('Admin edits users\' timezones', function () {
        it('Add user\'s timezone', function(done) {
            agent_admin
                .post(url+'/api/timezone/by-user/'+test_user_id)
                .send(test_timezones_array[0])
                .end(function(err, res) {
                    res.status.should.equal(200, "Adding timezone to user problem");
                    test_timezone_one_id = res.body.data._id;
                    agent_admin
                        .post(url+'/api/timezone/by-user/'+test_user_id)
                        .send(test_timezones_array[1])
                        .end(function(err, res) {
                            res.status.should.equal(200, "Adding timezone to user problem");
                            test_timezone_two_id = res.body.data._id;
                            done()
                        });
                });
        });
        it('Edit user\'s timezone', function(done) {
            agent_admin
                .put(url+'/api/timezone/'+test_timezone_one_id)
                .send(test_timezones_array[2])
                .end(function(err, res) {
                    res.status.should.equal(200, "Editing timezone to user problem");
                    done()
                });
        });
        it('Delete user\'s timezone', function(done) {
            agent_admin
                .del(url+'/api/timezone/'+test_timezone_two_id)
                .end(function(err, res) {
                    res.status.should.equal(200, "Deleting timezone to user problem");
                    done()
                });
        });
        it('Listening user\'s timezones', function(done) {
            agent_admin
                .get(url+'/api/timezone/by-user/'+test_user_id)
                .end(function(err, res) {
                    res.status.should.equal(200, "Listening user\'s timezones problem");
                    var list = res.body;
                    list.length.should.equal(1, "Listening user\'s timezones problem");
                    list[0].title.should.equal(test_timezones_array[2].title, "Listening user\'s timezones problem");
                    list[0].city.should.equal(test_timezones_array[2].city, "Listening user\'s timezones problem");
                    list[0].utc_offset.should.equal(test_timezones_array[2].utc_offset, "Listening user\'s timezones problem");

                    done()
                });
        });
    });




});