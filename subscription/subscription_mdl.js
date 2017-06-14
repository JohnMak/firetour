var mongoose = require('mongoose');


var SubscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    direction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Direction'
    }
});


module.exports = mongoose.model('Subscription', SubscriptionSchema);