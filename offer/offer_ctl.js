var Offer = require('./offer_mdl.js');
var Direction = require('../direction/direction_mdl');
var request = require('request');


function checkBestOffer(offer) {
    Offer.find({direction: offer.direction}).sort('price').exec(function(err, data){
        if (data[0]._id.toString().indexOf(offer._id) === 0) {
            console.log('submitting');
            request.get(
                {
                    url: "https://smsc.ru/sys/send.php",
                    qs: {
                        login: 'FireTour',
                        psw: 'P}\'/uy">',
                        phones: '+79139877788',
                        mes: 'Снизилась цена на туры'
                    }
                },

                function (error, response) {
                    console.log(response);
                }
            )
        }
    })
}

module.exports.postOffer = function (req, res) {

    var offer = new Offer();

    offer.hotel = req.body.hotel;
    offer.nights = req.body.nights;
    offer.description = req.body.description;
    offer.price = req.body.price;
    offer.direction = req.body.direction;

    offer.save(function (err) {
        if (err)
            res.send(err);
        else {
            res.json({message: "offer added", data: offer});
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
        Offer.find({direction: direction._id}).sort('price').exec(function(err, offers){
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
