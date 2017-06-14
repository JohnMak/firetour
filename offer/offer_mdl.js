var mongoose = require('mongoose');


var OfferSchema = new mongoose.Schema({
    hotel: {
        type: String,
        required: true
    },
    nights: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        default: false
    },
    price: {
        type: Number,
        default: false
    },
    direction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Direction'
    }
});


module.exports = mongoose.model('Offer', OfferSchema);