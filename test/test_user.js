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


describe('Users REST testing', function () {
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
                done();
            });
        })
    });
    after(function (done) {
        clear_db(function () {
            db.close();
            done();
        })
    });

    describe('Unauthorized Cases', function () {
        it('Get users list', function(done) {
            request(url)
                .get('/api/user')
                .end(function(err, res) {
                    res.status.should.equal(401, "Bad response status");
                    done()
                });
        });
        it('Get timezone', function(done) {
            request(url)
                .get('/api/timezone/abcdef')
                .end(function(err, res) {
                    res.status.should.equal(401, "Bad response status");
                    done()
                });
        });
    });

    describe('Registration & Authorization', function() {
        it('Register test user', function(done) {
            request(url)
                .post('/api/auth/signup')
                .send(test_user)
                .end(function(err, res) {
                    res.status.should.equal(200, 'Register problems');
                    res.body.should.have.property('username', test_user.username);
                    res.body.should.have.property('is_admin', test_user.is_admin);

                    test_user_id = res.body._id;


                    request(url)
                        .get('/api/auth/signout')
                        .end(function(err, res) {
                            res.status.should.equal(200, 'Logout problems');
                            done();
                        });
                })

        });
        it('Register same user username', function(done) {
            request(url)
                .post('/api/auth/signup')
                .send(test_user)
                .end(function(err, res) {
                    res.status.should.equal(400, 'Register duplicates problems');


                    request(url)
                        .get('/api/auth/signout')
                        .end(function(err, res) {
                            res.status.should.equal(200, 'Logout problems');
                            done();
                        });
                })

        });
        it('Logging in as test user', function(done) {
            agent_user
                .post(url+'/api/auth/login')
                .send(test_user)
                .end(function(err, res) {
                    res.status.should.equal(200, 'Authorization problems');
                    res.body.should.have.property('username', test_user.username);
                    res.body.should.have.property('is_admin', test_user.is_admin);


                    done();
                })

        })
    });


    describe('Profile changes', function() {
        it('Changing password', function(done) {
            agent_user
                .put(url+'/api/user/'+test_user_id)
                .send({password: test_user_updated.password})
                .end(function(err, res) {
                    res.status.should.equal(200, 'Changing self password problems');


                    agent_user
                        .put(url+'/api/user/'+test_user_id)
                        .send({password: test_user.password})
                        .end(function(err, res) {
                            res.status.should.equal(200, 'Changing self password problems');
                            done()
                        })
                })
        })

    });

    describe('Timezones operations', function() {
        it('Creating timezones', function(done) {
            agent_user
                .post(url+'/api/timezone')
                .send(test_timezones_array[0])
                .end(function(err, res) {
                    res.status.should.equal(200, 'Adding timezone problems');
                    test_timezone_one_id = res.body.data._id;

                    agent_user
                        .post(url+'/api/timezone')
                        .send(test_timezones_array[1])
                        .end(function(err, res) {
                            res.status.should.equal(200, 'Adding timezone problems');
                            test_timezone_two_id = res.body.data._id;

                            done();
                        });
                });
        });
        it('Editing timezone', function(done) {
            agent_user
                .put(url+'/api/timezone/'+test_timezone_one_id)
                .send(test_timezones_array[2])
                .end(function(err, res) {
                    res.status.should.equal(200, 'Editing timezone problems');
                    res.body.should.have.property('title', test_timezones_array[2].title);
                    res.body.should.have.property('city', test_timezones_array[2].city);
                    res.body.should.have.property('utc_offset', test_timezones_array[2].utc_offset);

                    done();
                });
        });
        it('Deleting timezone', function(done) {
            agent_user
                .del(url+'/api/timezone/'+test_timezone_two_id)
                .end(function(err, res) {
                    res.status.should.equal(200, 'Deleting timezone problems');

                    done();
                });
        });
        it('List timezones', function(done) {
            agent_user
                .get(url+'/api/timezone/')
                .end(function(err, res) {
                    res.status.should.equal(200, 'Deleting timezone problems');

                    var timezones = res.body;
                    timezones.length.should.equal(1, 'List problems');
                    timezones[0].title.should.equal(test_timezones_array[2].title, 'List problems');
                    timezones[0].city.should.equal(test_timezones_array[2].city, 'List problems');
                    timezones[0].utc_offset.should.equal(test_timezones_array[2].utc_offset, 'List problems');

                    done();
                });
        });

    });




});