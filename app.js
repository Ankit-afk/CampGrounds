const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const methodOverride = require('method-override')

const ejsMate = require('ejs-mate')

const {campgroundSchema} = require('./schemas')

const Campground = require("./models/campground")
const Review = require('./models/review')
const wrapAsync = require('./utils/wrapAsync')
const expressError = require('./utils/expressError')
const mongoose = require('mongoose');
const { appendFileSync } = require('fs')

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

const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body)
    // console.log(req.body, error);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    }
    else {
        next()
    }
}

app.get('/', (req, res) => {
    res.render("home")
})

app.get('/campgrounds', wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('./campgrounds/index',{campgrounds})
}))

app.get('/campgrounds/new', (req, res) => {
    res.render('./campgrounds/new')
})

app.post('/campgrounds', validateCampground , wrapAsync(async (req, res, next) => {

        const campground = new Campground(req.body.campground)
        await campground.save()
        res.redirect(`/campgrounds/${campground._id}`)
}))

app.get('/campgrounds/:id', wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render("./campgrounds/show",{campground})
}))

app.get('/campgrounds/:id/edit', wrapAsync(async (req,res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('./campgrounds/edit',{campground})

}))

app.put('/campgrounds/:id', validateCampground, wrapAsync(async (req, res) =>{
    const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id', wrapAsync(async (req,res) =>{
    const campground = await Campground.findByIdAndDelete(req.params.id)
    res.redirect('/campgrounds')
}))

app.post('/campgrounds/:id/reviews', wrapAsync(async (req,res) =>{
    const campground = await Campground.findById(req.params.id)
    console.log(campground)
    const review = new Review(req.body.review)
    console.log(review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.all("*", (req, res, next) => {
    next(new expressError("Page not found", 404))
})

app.use((err,req,res,next) => {
    const {statusCode = 500} = err
    if (!err.message) err.message = "Something went wrong"
    res.status(statusCode).render("../error", {err})
})

app.listen(port, () => console.log(`app listening on port ${port}!`))