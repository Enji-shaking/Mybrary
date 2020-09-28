const mongoose = require("mongoose");
const path = require('path')
const coverImageBasePath = 'uploads/bookCovers'

const bookSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName:{
        type: String,
        required: true
    },
    author: {
        // we want to refer to the author collection 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
        // this name must match the name we set when we export the Author model
    }
})
// create a virtual property, derive value from the above values
bookSchema.virtual('coverImagePath').get(function () { 
    if(this.coverImageName != null){
        return path.join('/', coverImageBasePath, this.coverImageName)
    }
 })
// Author is basically the name of the table in the DB
module.exports = mongoose.model('Book', bookSchema);
module.exports.coverImageBasePath = coverImageBasePath;