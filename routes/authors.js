const express = require('express');
const router = express.Router();
const Author = require('../models/author')
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
         res.redirect('/');
    }
});

// new author route
// /authors/new
router.get('/new', (req, res)=>{
    res.render('authors/new', {
        author: new Author()
    })
})

router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name.trim()
    })
    try{
        const newAuthor = await author.save();
        //  res.redirect(`authors/${newAuthor.id}`);
        // in rediect, we always input the full path, same for action
        res.redirect('/author');
    }catch{
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        });
    }
});

module.exports = router;