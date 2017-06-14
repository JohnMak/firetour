var mongoose = require('mongoose');


var TimezoneSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: false
    },
    utc_offset: {
        type: Number,
        required: true
    },
    user_id: String
});


module.exports = mongoose.model('Timezone', TimezoneSchema);