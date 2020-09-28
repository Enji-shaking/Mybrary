const express = require('express');
const Book = require('../models/book')
const Author = require('../models/author')
// model
// const path = require('path')
// this combines two different paths
// const fs = require('fs')
const router = express.Router();

// a file library help to upload and regulate files. Requires to add upload.single('cover')
// as a middle in the post path. This would add a "file" attribute to req
const imageMimeType = ['image/jpeg', 'image/png', 'image/gif']
// const multer = require('multer')
// const uploadPath = path.join('public', Book.coverImageBasePath)
// hardcoded and exported from Book, 'uploads/bookCovers'
// const upload = multer({
//     dest: uploadPath,
//     fileFilter: (req, file, callback) => {
//         // the second parameter is to determine if we accept the file
//         callback(null, imageMimeType.includes(file.mimetype))
//     }
// })

// All books route
router.get('/', async (req, res) => {
   // here, if we don't pass anything in, we create a query object, we can build up on it and execute it later
    let query = Book.find();
    if(req.query.title != null && req.query.title.trim()!=''){
        //'title': database model parameter   
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore!=''){
        query = query.lte('publishDate', req.query.publishedBefore);
    }
    if(req.query.publishedAfter != null && req.query.publishedBefore!=''){
        query = query.lte('publishDate', req.query.publishedBefore);
    }

    try {
       const books = await query.exec()
        res.render('books/index',{
            books: books,
            searchOptions: req.query
        });   
    } catch (error) {
        res.redirect('/');
    }
});

// new book route
router.get('/new', async(req, res)=>{
    renderNewBookPage(res, new Book())
})

// create new book route
// cover is the name we set in the form
// This is to send a file, we can change it with the API filePond and upload a string (JSON) instead
/*
router.post('/new', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename: null;
    // this is a binary file
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    });
    try {
        const newBook = await book.save();
        // res.redirect(`books/${newBook.id}`);
        res.redirect('/books');
        // The one below would go to /books/books
        // res.redirect(`books`);
    } catch (error) {
        if(book.coverImageName != null){
            removeBookCover(book.coverImageName)
        }
        renderNewBookPage(res, book, true);
    }
});
*/
router.post('/new', async (req, res) => {
    // this is a binary file
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    });
    saveCover(book, req.body.cover);
    try {
        const newBook = await book.save();
        // res.redirect(`books/${newBook.id}`);
        res.redirect('/books');
        // The one below would go to /books/books
        // res.redirect(`books`);
    } catch (error) {
        renderNewBookPage(res, book, true);
    }
});


async function renderNewBookPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({})
    const params = {
      authors: authors,
      book: book
    }
    if (hasError) params.errorMessage = 'Error Creating Book'
    res.render('books/new', params)
  } catch {
    res.redirect('/books')
  }
}

// Removed at lect 4, because we don't need to remove a file. Instead, we are sending JSON string
// function removeBookCover(fileName) { 
//     fs.unlink(path.join(uploadPath, fileName), err=>{
//         if(err) console.err(err)
//     })
//  }

 function saveCover(book, coverEncoded){
     // https://pqina.nl/filepond/docs/patterns/plugins/file-encode/
    if (coverEncoded == null) return;
    const cover = JSON.parse(coverEncoded);
    if(cover != null && imageMimeType.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data, 'base64');
        // This allows us to create a buffer from some set of data
        // this is base64 encoded
        book.coverImageType = cover.type;
    }
 }
module.exports = router;