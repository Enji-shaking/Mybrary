const mongoose = require("mongoose");
const Book = require('./book')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

// Those are important when different data are connected with id referencing each other
authorSchema.pre('remove', function(next){
    // If we call this callback, that means it's okay to move forward
    Book.find({author: this.id}, (err, books) => {
        if(err){
            // connection lost
            next(err);
        }else if(books.length > 0){
            // he has books
            books.forEach((book) =>{
                book.remove();
                next()
            })
        }else{
            next();
        }
    })
})
// Author is basically the name of the table in the DB
module.exports = mongoose.model('Author', authorSchema)
// After we export, it would be used by 
// const Author = require('../models/author')