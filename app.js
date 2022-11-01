const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const methodOverride = require('method-override')

const ejsMate = require('ejs-mate')

const expressError = require('./utils/expressError')
const mongoose = require('mongoose');
const { appendFileSync } = require('fs')

const campground = require('./routes/campgrounds')
const review = require('./routes/reviews')

mongoose.connect('mongodb://localhost:27017/campGround', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

app.engine('ejs', ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('__method'))


app.get('/', (req, res) => {
    res.render("home")
})

app.use('/campgrounds',campground)
app.use('/campgrounds/:id/reviews',review)

app.all("*", (req, res, next) => {
    next(new expressError("Page not found", 404))
})

app.use((err,req,res,next) => {
    const {statusCode = 500} = err
    if (!err.message) err.message = "Something went wrong"
    res.status(statusCode).render("../error", {err})
})

app.listen(port, () => console.log(`app listening on port ${port}!`))