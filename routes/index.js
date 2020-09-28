const express = require('express');
const router = express.Router();
// const mongoose = require('mongoose');
// It surprices me but it seems that it's unnecessary
// The whole server is connected to the DB automatically
const Book = require('../models/book')

router.get('/', async (req, res) => {
    let books;
    try {
        // books = await Book.find({}).sort({createdAt: 'desc'}).limit(10);
        books = await Book.find().sort({createdAt: 'desc'}).limit(5).exec();
    } catch (error) {
        books = []
    }
    res.render('index', {books: books});

});

module.exports = router
// Here, we export it, as a form of variable
// Then it could be used else where as below
// const indexRouter = require('./routes/index')
// app.use('/', indexRouter)