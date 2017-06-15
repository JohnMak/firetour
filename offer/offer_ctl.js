var Offer = require('./offer_mdl.js');
var Direction = require('../direction/direction_mdl');
var Subscription = require('../subscription/subscription_mdl');
var request = require('request');


function checkBestOffer(offer) {
    Offer.find({
        direction: offer.direction,
        created: {
            $gte: new Date(new Date().getTime()-24*60*60*1000).toISOString()
        }
    }).sort('price').exec(function(err, data){
        if (data[0]._id.toString().indexOf(offer._id) === 0 &&
            data.length > 0 &&
            data[data.length-1].price * 0.8 > data[0].price) {


            Subscription.find({isActive: true}).exec(function(err, subscrbers){
                for (var i in subscrbers) {

                    request.post(
                        {
                            url: "https://smsc.ru/sys/send.php",
                            form: {
                                login: 'FireTour',
                                psw: 'P}\'/uy">',
                                phones: subscrbers[i].phone,
                                mes: "Upali ceny na turi, prover'te https://firetour.herokuapp.com"
                            }
                        },

                        function (error, response) {
                            console.log(response.body);
                        }
                    )
                }
            });

        }
    })
}

module.exports.postOffer = function (req, res) {

    var offer = new Offer();

    offer.hotel = req.body.hotel;
    offer.link = req.body.link;
    offer.nights = req.body.nights;
    offer.description = req.body.description;
    offer.price = req.body.price;
    offer.direction = req.body.direction;
    offer.created = new Date();

    offer.save(function (err, offerSaved) {
        if (err)
            res.send(err);
        else {
            res.json({message: "offer added", data: offerSaved});
            checkBestOffer(offer);
        }
    })
};

module.exports.getOffers = function (req, res) {

    Offer.find({}).populate('direction').exec(function (err, offers) {
        if (err)
            res.send(err);
        else
            res.json(offers);
    });
};

module.exports.deleteOffer = function (req, res) {
    Offer.findById(req.params.id, function (err, offer) {
        if (err)
            res.send(err);
        else if (offer) {
            offer.remove(function (err) {
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


function fillDirectionOffer(direction) {
    return new Promise(function(resolve, reject){
        Offer.find({direction: direction._id}).sort('-created').exec(function(err, offers){
            if (err) {
                reject()
            }
            else {
                resolve({direction: direction, bestOffer: offers[0]});
            }
        })
    })
}

module.exports.bestOffers = function (req, res) {
    Direction.find().populate('direction').exec(function(err, directions) {

        var awaits = [];
        for (var i in directions) {
            awaits.push(fillDirectionOffer(directions[i]));
        }

        Promise.all(awaits).then(function(data) {
            res.send(data);
        });
    });
};
