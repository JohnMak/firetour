var Direction = require('./direction_mdl.js');

module.exports.postDirection = function (req, res) {

    var direction = new Direction();

    direction.from = req.body.from;
    direction.to = req.body.to;
    direction.lowPrice = req.body.lowPrice;

    direction.save(function (err) {
        if (err)
            res.send(err);
        else
            res.json({message: "direction added", data: direction});
    })
};

module.exports.getDirections = function (req, res) {

    Direction.find({}, function (err, directions) {
        if (err)
            res.send(err);
        else
            res.json(directions);
    })
};

module.exports.putDirection = function (req, res) {
    Direction.findById(req.params.id, function (err, direction) {
        if (err)
            res.send(err);
        else {
            direction.from = req.body.from || direction.from;
            direction.to = req.body.to || direction.to;
            direction.lowPrice = req.body.lowPrice || direction.lowPrice;

            direction.save(function (err) {
                if (err)
                    res.send(err);

                else
                    res.json(direction);
            });
        }
    });
};

module.exports.deleteDirection = function (req, res) {
    Direction.findById(req.params.id, function (err, direction) {
        if (err)
            res.send(err);
        else if (direction) {
            direction.remove(function (err) {
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
