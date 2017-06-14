var Ract = require('ractive');
var ErrorLog = require('../ErrorLog.js');



var manage_panel = Ract.extend({
    template: require("./manage_panel.ract"),
    components: {
      Password: require('../password/password.js')
    },
    oninit: function(){
        var self = this;

        this.set('utc_offsets',Array.apply(null, {length: 25}).map(Function.call, function(i){return i-12}));

        this.update_userlist();



        this.on('set_manage_user', function(event) {
            self.set('data.manage_user._id', event.context._id);

            self.update_user_timezones(event.context._id, function(){
                self.copy_manage_user();
            });

        });


        this.on('delete_user', function(event){
            self.rest_delete_user(event.context._id, function(){
                self.update_userlist();
                self.set('data.manage_user', {});
            });
            event.original.preventDefault();
        })
    },


    /////// MANAGE USERS ///////
    add_user:function() {
        var self = this;
        var users = this.get('data.users');

        var init_name = 'New User';
        var cur_name = 'New User';
        var acc = 0;
        var find = true;
        while (find) {
            find = false;
            for (var i in users) {
                var user = users[i];
                if (user && user.username == cur_name) {
                    acc += 1;
                    cur_name = init_name + ' ('+acc+')';
                    find = true;
                    break;
                }
            }
        }
        this.rest_create_user(cur_name, function(data){
            //self.set('data.users.'+data._id, data);
            self.update_userlist();
        })
    },
    update_userlist: function(){
        var self = this;
        this.rest_get_userlist(function(data) {
            var users = {};
            for (var i in data) if (data.hasOwnProperty(i)){
                var user = data[i];
                users[user._id] = user;
            }
            self.set('data.users', users);
            self.set('filter_string', '');
        });
    },

    open_change_password: function(user_id) {
        $('#modal_password').modal('show');
    },
    filter_users: function(find) {
        find = find.toLowerCase();
        var users = this.get('data.users');

        for (var i in users) {
            var user = users[i];
            user.hide = !(user.username.toLowerCase().search(find)>=0)
        }
        this.set('data.users', users);
    },
    update_user: function(user_id, username, is_admin) {
        var self = this;
        var user = this.get('data.users.'+user_id);

        this.rest_update_user({
                _id: user_id,
                password: false,
                username: username,
                is_admin: is_admin
            }, function(){
                self.set('data.users.'+user._id+'.username', username);
                self.set('data.users.'+user._id+'.is_admin', is_admin);

                self.copy_manage_user();

            },
            function(){
                self.copy_manage_user();
            }
        )
    },
    copy_manage_user: function(){
        var user_id = this.get('data.manage_user._id');
        var user = this.get('data.users.'+user_id);

        this.set('data.manage_user', $.extend(true, {},user));
    },

    update_user_timezones: function(user_id, callback){
        var self = this;
        this.rest_get_user_timezones(user_id, function(data){
            self.set('data.users.'+user_id+'.timezones', data);

            if (typeof callback === 'function')
                callback(data);
        });
    },



    /////// MANAGE USER'S TIMEZONES ///////

    add_user_timezone: function() {
        this.push('data.manage_user.timezones', {title:'', city:'', utc_offset:0});
    },
    remove_user_timezone: function(tz_i, tz_id) {
        var self = this;
        self.rest_delete_user_timezone(tz_id,function(){
            self.splice('data.manage_user.timezones',tz_i, 1);
        });
    },
    update_user_timezone: function(tz_id, tz_title, tz_city, tz_utc_offset, user_id) {
        var self = this;
        var tz = {
            _id: tz_id,
            title: tz_title,
            city: tz_city,
            utc_offset: tz_utc_offset
        };
        if (tz.title !=='' && tz.city != '') {

            if (!tz._id)
                self.rest_post_user_timezone(tz, user_id, function () {
                    self.update_user_timezones(user_id, function () {
                        self.copy_manage_user();
                    });
                });
            else
                self.rest_update_user_timezone(tz)
        }
    },


    ////// REST API AJAX METHODS /////////
    rest_get_userlist: function(callback, error){
        $.ajax({
            method: 'get',
            url: '/api/user',
            success: callback,
            error: function(err){
                ErrorLog.process(err);
                if (typeof error === 'function')
                    error(err);
            }
        })
    },


    rest_create_user: function(username, callback, error){
        $.ajax({
            method: 'post',
            url: '/api/user',
            data: {username:username, password:'1'},
            success: callback,
            error: function(err){
                ErrorLog.process(err);
                if (typeof error === 'function')
                    error(err);
            }
        })
    },
    rest_delete_user: function(user_id, callback, error){
        $.ajax({
            method: 'delete',
            url: '/api/user/'+user_id,
            success: callback,
            error: function(err){
                ErrorLog.process(err);
                if (typeof error === 'function')
                    error(err);
            }
        })
    },
    rest_update_user: function(user, callback, error){
        $.ajax({
            method: 'put',
            url: '/api/user/'+user._id,
            data: {
                username: user.username,
                is_admin: user.is_admin
            },
            success: callback,
            error: function(err){
                ErrorLog.process(err);
                if (typeof error === 'function')
                    error(err);
            }
        })
    },

    rest_get_user_timezones: function(user_id, callback, error) {
        $.ajax({
            method: 'get',
            url: '/api/timezone/by-user/'+user_id,
            success: callback,
            error: function(err){
                ErrorLog.process(err);
                if (typeof error === 'function')
                    error(err);
            }
        })
    },

    rest_delete_user_timezone: function(timezone_id, callback, error) {
        $.ajax({
            method: 'delete',
            url: '/api/timezone/'+timezone_id,
            success: callback,
            error: function(err){
                ErrorLog.process(err);
                if (typeof error === 'function')
                    error(err);
            }
        })
    },

    rest_update_user_timezone: function(timezone, callback, error) {
        $.ajax({
            method: 'put',
            url: '/api/timezone/'+timezone._id,
            data: timezone,
            success: callback,
            error: function(err){
                ErrorLog.process(err);
                if (typeof error === 'function')
                    error(err);
            }
        })
    },

    rest_post_user_timezone: function(timezone, user_id, callback, error) {
        $.ajax({
            method: 'post',
            url: '/api/timezone/by-user/'+user_id,
            data: timezone,
            success: callback,
            error: function(err){
                ErrorLog.process(err);
                if (typeof error === 'function')
                    error(err);
            }
        })
    }

});


module.exports = manage_panel;