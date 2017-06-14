var Ract = require('ractive');

$(function () {
    window.EDITOR = true;

    var MainRact = Ract.extend({
        el: "main",
        template: require("./main.ract"),
        components: {
            Landing: require('./landing/landing.js'),
        },
        oninit: function() {

            this.observe('is_authorised', function(new_value){
                $('body').attr('is_authorised', new_value);
            })
        },
        onrender: function() {
            setTimeout(function(){
                $('body').removeClass('loading');


                setTimeout(function(){
                    $('body').addClass('loaded');
                },1000);

            },500);
        },
        publish: function() {
        },
        data: {
            is_authorised: false
        }
    });


    window.MainRact = new MainRact();


});
