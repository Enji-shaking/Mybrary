const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

// Author is basically the name of the table in the DB
module.exports = mongoose.model('Author', authorSchema)
// After we export, it would be used by 
// const Author = require('../models/author')