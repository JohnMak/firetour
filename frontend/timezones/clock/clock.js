var Ract = require('ractive');



var timezones = Ract.extend({
    template: require("./clock.ract"),
    oninit: function(){
        var self = this;
        this.initClock();
        this.observe('utc_offset', function(){
            self.initClock()
        });
    },
    onrender: function(){
        //this.initClock();
    },
    initClock: function(){
        var self = this;
        this.startTime = (new Date()).getTime();

        clearInterval(this.interval);

        this.interval = setInterval(function(){
            self.updateTimes();
        }, 998);


        var utc_offset = this.get('utc_offset');
        utc_offset = utc_offset ? utc_offset : 0;
        this.utc_offset = utc_offset;

        var now = new Date();
        var time = moment(now).utcOffset(utc_offset*60);

        this.initTime = {};

        this.initTime.s = parseInt(time.format('s'))*6;
        this.initTime.m = parseInt(time.format('m'))*6;
        this.initTime.h = parseInt(time.format('h'))*30;

        self.updateTimes();
    },
    updateTimes: function(){
        var now = new Date();
        var time = moment(now).utcOffset(this.utc_offset*60);
        var abs_h =parseInt(time.format('HH'));

        var data = {};
        var sec_dif = Math.round(((new Date).getTime() - this.startTime)/1000);
        data.s = this.initTime.s + 6*sec_dif;
        data.m = this.initTime.m + data.s/60;
        data.h = this.initTime.h + data.m/12;

        data.is_night = (abs_h >= 18) || (abs_h < 6);
        data.time = time.format('HH:mm:ss');


        this.set('data', data);
    },
    old_time: (new Date).getTime()
});


module.exports = timezones;