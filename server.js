if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
    // after this, everything would be loaded into our process.env variable in our application
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
// This is for passing information back and forward
const methodOverride = require('method-override')

const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')
// after this, indexRouter variable would be the 'router' variabe under index.js

// set up view
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
// after setting where the views are, we directly do render
app.set('layout', 'layouts/layout')
// This is our default layout
app.use(expressLayouts)
app.use(express.static('public'))
// tells the public files
app.use(methodOverride('_method'))
// we tell what we want the parameter to be.

app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))
// This also limits the file size

// Here, it sets the routes for /, /author, /books
// all is going to be prepended with /authors
app.use('/', indexRouter)
app.use('/authors', authorRouter);
app.use('/books', bookRouter);
// It's not enough yet, because we have to grab information from the file. By exporting
// For some reason, these have to be used after we setting up the vie

// set up mongoose
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});
// never hardcold, be dependent
// Here, we have to manually set the environment variable in our server, maybe at database
// ? Check on how to set it on digital ocean
const db = mongoose.connection;
db.on('error', error => console.log(error))
db.on('open', () => console.log('Connected to Mongoose'))

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on port 3000`);
});

// data base models would go it the directory "models"