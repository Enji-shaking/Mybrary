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

// page of adding new book route
router.get('/new', async(req, res)=>{
    renderNewBookPage(res, new Book())
})



// Create a new book
router.post('/new', async (req, res) => {
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
         res.redirect(`/books/${newBook.id}`);
    } catch (error) {
        renderNewBookPage(res, book, true);
    }
});

// Delete a book
router.delete('/:id', async (req, res) => {
    let book;
    try {
        book = await Book.findById(req.params.id);
        await book.remove();
        res.redirect('/books');
         
    } catch (error) {
        if(book == null){
            res.redirect('/');
        }else{
            res.redirect(`/book/${book.id}`);
        }
    }
});

// access specific book
router.get('/:id', async(req, res)=>{
    try {
        // const book = await Book.findById(req.params.id);
        // const author = await Author.findById(book.author);
        // or, another way of doing so is 
        const book = await Book.findById(req.params.id).populate('author').exec(); 
        // This preload all the author information
        res.render('books/show', {book: book});
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
})

// page of updating new book route
router.get('/:id/edit', async(req, res)=>{
    try {
        const book = await Book.findById(req.params.id);
        renderEditPage(res, book)
        // const authors = await Author.find({});
        // res.render('books/edit', {book: book, authors: authors});
    } catch (error) {
         res.redirect('/');
    }
})

// updating a book
router.put('/:id', async(req, res)=>{
    let book;
    let authors;
    try {
        authors = await Author.find({});
        book = await Book.findById(req.params.id);
        book.title = req.body.title;
        book.publishDate = req.body.publishDate;
        book.description = req.body.description;
        book.pageCount = req.body.pageCount;
        book.author = req.body.author;
        if(req.body.cover != null && req.body.cover != ''){
            saveCover(book, req.body.cover);
        }
        await book.save();
        res.redirect(`/books/${book.id}`);
    } catch (error) {
        console.log(error);
        if(book == null || authors == null){
            res.redirect('/');
        }else{
            renderEditPage(res, book, true);
        }
    }
})


async function renderNewBookPage(res, book, hasError = false) {
    renderFormPage(res, book, 'new', hasError)
}

async function renderEditPage(res, book, hasError = false) {
    renderFormPage(res, book, 'edit', hasError)
}
async function renderFormPage(res, book, form, hasError = false) {
  try {
    const authors = await Author.find({})
    const params = {
      authors: authors,
      book: book
    }
    if (hasError){
        if(form === 'edit'){
            params.errorMessage = 'Error Updating Book'
        }else{
            params.errorMessage = 'Error Creating Book'
        }
    } 
    res.render(`books/${form}`, params)
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