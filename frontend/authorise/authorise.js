var Ract = require('ractive');
var ErrorLog = require('../ErrorLog.js');



var auth = Ract.extend({
    el: "main",
    template: require("./authorise.ract"),
    components: {
        Password: require('../password/password.js')
    },
    oninit: function(){
        var self = this;

        function updateAuthUser() {
            $.ajax({
                method: 'get',
                url: '/api/auth/',
                success: function (user) {
                    self.set("is_authorised", true);
                    self.set("is_admin", user.is_admin);
                    self.set('user', user);
                },
                error: function (err) {
                    //ErrorLog.process(err);
                }
            })}

        //setInterval(updateAuthUser, 2000);
        updateAuthUser();

        this.on("rest_login", function(e){
            if (self.get('data.is_regform')){
                var username = self.get('data.input_name');
                var password = self.get('data.input_password');
                var confirm_password = self.get('data.input_confirm_password');

                if (password == confirm_password) {
                    $.ajax({
                        method: "post",
                        url: "/api/auth/signup",
                        data: $(this.find("form")).serialize(),
                        success: function (user) {
                            self.set("is_authorised", true);
                            self.set("is_admin", user.is_admin);
                            self.set('data.error_code', '');
                            self.set('user', user);
                            self.clearForm();
                        },
                        error: function (err) {
                            ErrorLog.process(err);
                            self.set('data.error_code', err.responseText);
                            self.clearForm();
                        }
                    });
                }
            }
            else {
                $.ajax({
                    method: "post",
                    url: "/api/auth/login",
                    data: $(this.find("form")).serialize(),
                    success: function (user) {
                        self.set("is_authorised", true);
                        self.set('data.error_code', '');
                        self.set("is_admin", user.is_admin);
                        self.set('user', user);
                        self.clearForm();
                    },
                    error: function (err) {
                        ErrorLog.process(err);
                        self.set('data.error_code', err.responseText);
                        self.clearForm();
                    }
                });
            }


            e.original.preventDefault();
        });

        this.on("rest_logout", function(e){

            $.ajax({
                method: "get",
                url: "/api/auth/signout",
                success: function(data){
                    self.set("is_authorised", false);
                }
            });

            e.original.preventDefault();
        });

        this.on("toggle_register", function(e){
            self.set('data.is_regform', !self.get('data.is_regform'));

            e.original.preventDefault();
        })
    },
    clearForm: function(){
        this.set('data.input_password', '');
        this.set('data.input_confirm_password', '');
    },
    data: {
        is_regform: false,
        input_name: '123',
        input_password: '',
        input_confirm_password: ''
    }
});


module.exports = auth;