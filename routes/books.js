const express = require('express');
const Book = require('../models/book')
const Author = require('../models/author')
// model

const router = express.Router();
const imageMimeType = ['image/jpeg', 'image/png', 'image/gif']

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