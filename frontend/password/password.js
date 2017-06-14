var Ract = require('ractive');
var ErrorLog = require('../ErrorLog.js');



var password = Ract.extend({
    template: require("./password.ract"),
    oninit: function(){
        var self = this;
        this.on('save', function(e){
           self.save();
            e.original.preventDefault();
        });
    },
    open_modal: function(){
        var user_id = this.get('user_id');
        $(this.find('.modal_password')).modal('show');
    },
    save: function(){
        var self = this;
        var modal = $(this.find('.modal_password'));
        var user_id = this.get('user_id');
        var password = this.get('password');
        $.ajax({
                method:"put",
                data:{
                    password: password
                },
                url:'/api/user/'+user_id,
                success: function(){
                    modal.modal('hide');
                    self.set('password', '')
                },
                error: function(err){
                    ErrorLog.process(err);
                    modal.modal('hide');

                }
            }
        )
    }
});


module.exports = password;