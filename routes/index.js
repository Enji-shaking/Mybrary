const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Book = require('../models/book')
router.get('/', async (req, res) => {
    let books;
    try {
        // books = await Book.find({}).sort({createdAt: 'desc'}).limit(10);
        books = await Book.find().sort({createdAt: 'desc'}).limit(1).exec();
    } catch (error) {
        books = []
    }
    res.render('index', {books: books});

});

// as of now, it's not hooked up

module.exports = router