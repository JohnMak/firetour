var Ract = require('ractive');
var ErrorLog = require('../ErrorLog.js');



var timezones = Ract.extend({
    template: require("./timezones.ract"),
    components: {
        Clock: require('./clock/clock.js')
    },
    oninit: function(){
        var self = this;

        this.getTimezones();

        this.set('utc_offsets',Array.apply(null, {length: 25}).map(Function.call, function(i){return i-12}));

        this.set('data.current_utc_offset', moment().utcOffset()/60);

        this.on('rest_add_timezone', function(e){
            $.ajax({
                method: 'post',
                data: $(self.find("#add_timezone_form")).serialize(),
                url: '/api/timezone/',
                success: function(){
                    self.getTimezones();
                },
                error: function (err) {
                    ErrorLog.process(err);
                }
            });

            e.original.preventDefault();
        });

    },
    open_edit_timezone: function(tz){
        this.set('data.edit_tz', $.extend(true, {}, tz));

        $("#modal_timezone").modal('show');
    },
    filter_timezones: function(fs){
        fs = fs.toLowerCase();

        var tzs = this.get('data.timezones');

        $(tzs).each(function(){
            var string = (this.title +' '+ this.city).toLowerCase();

            if (fs=='' || string.search(fs)>=0 )
                this.hide = false;
            else
                this.hide = true;
        });

        this.set('data.timezones', tzs);
    },
    save_edit_timezone: function(){
        var tz = this.get('data.edit_tz');
        var self = this;

        function success(){
            self.getTimezones();
            $("#modal_timezone").modal('hide');
        }
        var data = $(self.find("#edit_timezone_form")).serialize();

        if (tz.title && tz.city) {

            if (tz._id) {
                $.ajax({
                    method: 'put',
                    data: data,
                    url: '/api/timezone/'+tz._id,
                    success: success,
                    error: function (err) {
                        ErrorLog.process(err);
                        $("#modal_timezone").modal('hide');
                    }
                });
            }
            else {
                $.ajax({
                    method: 'post',
                    data: data,
                    url: '/api/timezone/',
                    success: success,
                    error: function (err) {
                        ErrorLog.process(err);
                        $("#modal_timezone").modal('hide');
                    }
                });
            }
        }


    },
    getTimezones: function(){
        var self = this;
        $.ajax({
            method: "get",
            url:"/api/timezone",
            success: function(data){
                self.set('data.timezones', data);
                self.set('filter_string', '');
            },
            error: function (err) {
                ErrorLog.process(err);
            }
        })
    },
    rest_remove_timezone: function(id){
        //console.log(id);
        var self = this;
        $.ajax({
            method: "delete",
            url:"/api/timezone/"+id,
            success: function(data){
                //console.log(data);
                self.getTimezones();
            },
            error: function (err) {
                ErrorLog.process(err);
            }
        })
    },
    data: {
        current_time: function() {
            return {utc_offset: 0}
        }
    }
});


module.exports = timezones;