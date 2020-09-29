const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');
// All authors route
router.get('/', async (req, res) => {
    let searchOptions = {};
    // a get request is sent through the query string
    // a post request is sent through the body
    if(req.query.name != null && req.query.name !== ''){
        // 'i': case insensitive
        searchOptions.name = new RegExp(req.query.name, 'i')
        // ? what does RegExp do
    }
    try {
        const authors = await Author.find(searchOptions);
        res.render('authors/index', {authors: authors, searchOptions: req.query});
        // inside {}, we pass the information, which would be used later by 
        // <%= searchOptions.name %>
    } catch (error) {
         res.redirect('/bookshelf');
    }
});

// new author route
// /authors/new
router.get('/new', (req, res)=>{
    res.render('authors/new', {
        author: new Author()
    })
})

router.post('/new', async (req, res) => {
    const author = new Author({
        name: req.body.name.trim()
    })
    try{
        const newAuthor = await author.save();
        // in rediect, we always input the full path, same for action
        res.redirect(`/authors/${newAuthor.id}`);
        // go to the show page
    }catch{
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        });
    }
});
// This has to be below get(/new), otherwise the server would think new as an id
router.get('/:id', async (req, res)=>{
    try {
        const author = await Author.findById(req.params.id);
        const books = await Book.find({author: author.id}).limit(6).exec();
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        });
    } catch (error) {
        console.log(error)
         res.redirect('/bookshelf');
    }
})
// show the update page
router.get('/:id/edit', async (req, res)=>{
    try {
        const author = await Author.findById(req.params.id);
        res.render('authors/edit', {
            author: author
        })
        
    } catch (error) {
         res.redirect('/authors');
    }

})
// update an author
router.put('/:id', async (req, res)=>{
    let author;
    try {
        // params.id comes from the top part "/:id"
        author = await Author.findById(req.params.id);
        const name = req.body.name;
        author.name = name;
        await author.save();
        res.redirect(`/authors/${author.id}`);
        // go to the show page
    } catch (error) {
        if(author == null){
            // This means we failed at finding
             res.redirect('/bookshelf');
        }else{
            res.render('authors/edit',{
                author: author,
                errorMessage: 'Error updating Author'
            });      
        }
    }
})

// Never use get method because Google would click on every link when a browswer load up
router.delete('/:id', async (req, res)=>{
    let author;
    try {
        // params.id comes from the top part "/:id"
        author = await Author.findById(req.params.id);
        await author.remove();
        res.redirect('/authors');
        // go to the show page
    } catch (error) {
        if(author == null){
            res.redirect('/bookshelf');
        }else{
             res.redirect(`/authors/${author.id}`);
        }
    }
})

// from browswer, we could only do get and post. To enable put and delete, we have to use a library called method overide
// What it does: it allows us to use a post form, sent to our server with a special parameter to indicate if we are using put or delete

module.exports = router;