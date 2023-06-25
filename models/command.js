let mongoose = require("mongoose");

let commandSchema = new mongoose.Schema({
    name: {type: String, required: true},
    desc: {type: String, required: true},
    alter: [{type: String, required: false}]
})

module.exports = mongoose.model("Command", commandSchema);