if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
    // after this, everything would be loaded into our process.env variable in our application
}


const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts')


const indexRouter = require('./routes/index')
// after this, indexRouter variable would be the 'router' variabe under index.js

app.set('view engine', 'ejs')
app.set('views', __dirname+'/views')
// this is to avoid repeating html
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
// tells the public files
app.use(express.static('public'));

const mongoose = require('mongoose');
// never hardcold, be dependent
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', error => console.log(error))
db.on('open', () => console.log('Connected to Mongoose'))


// Here, it sets the routes for /
app.use('/', indexRouter)
// It's not enough yet, because we have to grab information from the file. By exporting


app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on port 3000`);
});


// data base models would go it the directoru "models"