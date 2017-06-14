var Timezone = require('./timezone_mdl.js');

module.exports.postTimezone = function (req, res) {

    var timezone = new Timezone();

    timezone.title      = req.body.title;
    timezone.city       = req.body.city;
    timezone.utc_offset = req.body.utc_offset;
    timezone.user_id    = req.user._id;

    timezone.save(function (err) {
        if (err)
            res.send(err);
        else
            res.json({message: "timezone added", data: timezone});
    })
};
module.exports.getTimezones = function (req, res) {

    Timezone.find({user_id: req.user._id}, function (err, timezones) {
        if (err)
            res.send(err);
        else
            res.json(timezones);
    })
};
module.exports.postUserTimezone = function (req, res) {

    if (req.user._id != req.params.user_id && !req.user.is_admin)
        return res.status(400).send('not permitted');

    var timezone = new Timezone();

    timezone.title      = req.body.title;
    timezone.city       = req.body.city;
    timezone.utc_offset = req.body.utc_offset;
    timezone.user_id    = req.params.user_id;

    //console.log(timezone);

    timezone.save(function (err) {
        if (err)
            res.send(err);
        else
            res.json({message: "timezone added", data: timezone});
    })
};
module.exports.getUserTimezones = function (req, res) {

    if (req.user._id != req.params.user_id && !req.user.is_admin)
        return res.status(400).send('not permitted');

    Timezone.find({user_id: req.params.user_id}, function (err, timezones) {
        if (err)
            res.send(err);
        else
            res.json(timezones);
    })
};
module.exports.getTimezone = function (req, res) {
    Timezone.find({_id: req.params.timezone_id}, function (err, timezone) {
        if (err)
            res.send(err);
        else {
            if (req.user._id != timezone.user_id && !req.user.is_admin)
                return res.status(400).send('not permitted');

            res.json(timezone);
        }
    })
};

module.exports.putTimezone = function (req, res) {
    Timezone.findById(req.params.timezone_id, function (err, timezone) {
        if (err)
            res.send(err);
        else {
            if (req.user._id != timezone.user_id && !req.user.is_admin)
                return res.status(400).send('not permitted');

            timezone.title = req.body.title;
            timezone.city = req.body.city;
            timezone.utc_offset = req.body.utc_offset;

            timezone.save(function(err){
                if (err)
                    res.send(err);

                else
                    res.json(timezone);
            });
        }
    });
};
module.exports.deleteTimezone = function(req, res) {
    Timezone.findById(req.params.timezone_id, function (err, timezone) {
        if (err)
            res.send(err);
        else {
            if (req.user._id != timezone.user_id && !req.user.is_admin)
                return res.status(400).send('not permitted');

            timezone.remove(function(err){
                if (err)
                    res.send(err);

                else
                    res.sendStatus(200);
            });
        }
    });
}