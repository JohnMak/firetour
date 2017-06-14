var Subscription = require('./subscription_mdl.js');

var Nodemailer = require('nodemailer');
var transporter = Nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'hottour2017@gmail.com',
        pass: 'Matrix2010'
    }
});

module.exports.postSubscription = function (req, res) {

    var subscription = new Subscription();

    subscription.name = req.body.name;
    subscription.direction = req.body.direction;
    subscription.phone = req.body.phone;

    subscription.save(function (err, subscription) {
        if (err)
            res.send(err);
        else {

            var mailOptions = {
                from: '<no-reply@hottour.com> "ОгоньТур"', // sender address
                to: "makeev.john@gmail.com", // list of receivers
                subject: 'Новая подписка', // Subject line
                text: subscription.name + ' - ' + subscription.phone
            };

            transporter.sendMail(mailOptions);

            res.json({message: "subscription added", data: subscription});
        }
    })
};

module.exports.getSubscriptions = function (req, res) {

    Subscription.find({}).populate('direction').exec(function (err, subscriptions) {
        if (err)
            res.send(err);
        else
            res.json(subscriptions);
    });
};

module.exports.putSubscription = function (req, res) {
    Subscription.findById(req.params.id, function (err, subscription) {
        if (err)
            res.send(err);
        else {

            subscription.name = req.body.name || subscription.name;
            subscription.direction = req.body.direction || subscription.direction;
            subscription.phone = req.body.phone || subscription.phone;
            subscription.isActive = req.body.isActive || subscription.isActive;

            subscription.save(function (err) {
                if (err)
                    res.send(err);

                else
                    res.json(subscription);
            });
        }
    });
};

module.exports.deleteSubscription = function (req, res) {
    Subscription.findById(req.params.id, function (err, subscription) {
        if (err)
            res.send(err);
        else if (subscription) {
            subscription.remove(function (err) {
                if (err)
                    res.send(err);

                else
                    res.sendStatus(200);
            });
        }
        else {
            res.sendStatus(200);
        }
    });
};
