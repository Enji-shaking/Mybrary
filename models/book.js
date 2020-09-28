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
    // commented out at lect 4, because we are not sending an actual file
    // coverImageName:{
    //     type: String,
    //     required: true
    // },
    coverImage:{
        type: Buffer,
        required: true
    },
    coverImageType:{
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
// removed at lect 4
// bookSchema.virtual('coverImagePath').get(function () { 
//     if(this.coverImageName != null){
//         return path.join('/', coverImageBasePath, this.coverImageName)
//     }
//  })
bookSchema.virtual('coverImagePath').get(function () { 
    if(this.coverImage != null && this.coverImageType != null){
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
 })


// Book is basically the name of the table in the DB
module.exports = mongoose.model('Book', bookSchema);
// module.exports.coverImageBasePath = coverImageBasePath;
// This exports a static member, can be accessed by
// Book.coverImageBasePath