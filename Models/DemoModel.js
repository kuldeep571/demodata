const mongoose = require("mongoose");
const demoSchema = mongoose.Schema({

    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    c_password: {
        type: String,
    },

}, { timestamps: true })

module.exports = mongoose.model('demo', demoSchema);