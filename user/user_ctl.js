/**
 * Created by JohnMak on 23/10/15.
 */
var User = require('./user_mdl.js');


module.exports.postUser = function (req, res) {

    if (!req.user.is_admin)
        return res.status(400).send('not permitted');

    var user = new User({
        username: req.body.username,
        password: req.body.password
    });

    //console.log(user);

    user.save(function (err) {
        if (err) {
            res.send(err);
            res.sendStatus(500);
        }
        else
            res.json(user);
    });
};

module.exports.getUser = function (req, res) {

    if (req.user._id != req.params.user_id && !req.user.is_admin)
        return res.status(400).send('not permitted');


    User.findById(req.params.user_id, function (err, user) {
        if (err) {
            res.send(err);
            res.sendStatus(500);
        }
        else
            res.json(user)
    })
};

module.exports.putUser = function (req, res) {

    if (req.user._id != req.params.user_id && !req.user.is_admin)
        return res.status(400).send('not permitted');


    if ((req.user._id == req.params.user_id) && req.body.is_admin &&
        (req.body.is_admin != req.user.is_admin))
            return res.status(400).send('not permitted');


    User.findById(req.params.user_id, function (err, user) {
        if (err) {
            res.send(err);
            res.status(400);
        }
        else{
            if (req.body.username) user.username = req.body.username;
            if (req.body.is_admin) user.is_admin = req.body.is_admin;
            if (req.body.password) user.password = req.body.password;

            user.save(function (err, user) {
                    if (err){
                        console.log(err);
                        res.sendStatus(500);
                    }

                    else {
                        res.json(user);
                    }
                });
        }
    });
};

module.exports.deleteUser = function (req, res) {

    if (req.user._id == req.params.user_id || !req.user.is_admin)
        return res.status(400).send('not permitted');

    User.findByIdAndRemove(req.params.user_id, function (err) {
        if (err) {
            res.send(err);
            res.sendStatus(500);
        }
        else
            res.json({message: 'User deleted'});
    })
};


module.exports.getUsers = function (req, res) {
    if (!req.user.is_admin)
        return res.status(400).send('not permitted');

    User.find(function (err, users) {
        if (err) {
            res.send(err);
            res.sendStatus(500);
        }
        else
            res.json(users)
    })
};