var Ract = require('ractive');
var ErrorLog = require('../ErrorLog.js');




var landing = Ract.extend({
    template: require("./landing.ract"),
    components: {
    },
    oninit: function(){
        var self = this;


        function updateOffers() {
            $.ajax({
                method: "get",
                url: "/api/offer/best",
                data: $(this.find("form")).serialize(),
                success: function(offers) {
                    for (var i in offers) {
                        if (offers[i].bestOffer && offers[i].bestOffer.created) {
                            offers[i].bestOffer.created = moment(offers[i].bestOffer.created).format('HH:mm');
                        }
                    }
                    console.log(offers);

                    self.set("offers", offers);
                }
            })
        }

        updateOffers();

        self.set('isSubscribed', $.cookie("isSubscribed"));

        this.on("rest_subscribe", function(e){
            var name = self.get('data.input_name');
            var phone = self.get('data.input_phone');
            var confirm_password = self.get('data.input_confirm_password');

            if (name && phone) {
                $.ajax({
                    method: "post",
                    url: "/api/subscription",
                    data: $(this.find("form")).serialize(),
                    success: function (user) {
                        self.set('isSubscribed', true);
                        $.cookie("isSubscribed", true);
                    },
                    error: function (err) {

                    }
                });
            }
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
    data: function () {
        return {
            offers: [],
            isSubscribed: false
        }
    }
});


module.exports = landing;