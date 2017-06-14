var mongoose = require('mongoose');


var DirectionSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    lowPrice: {
        type: Number,
        required: false
    }
});


module.exports = mongoose.model('Direction', DirectionSchema);