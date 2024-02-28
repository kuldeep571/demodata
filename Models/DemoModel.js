const mongoose = require("mongoose");
const DemoSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: false,
        },
        password: {
            type: String,
            required: false,
        },
        c_password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("demo", DemoSchema);