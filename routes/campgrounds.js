const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync')
const expressError = require('../utils/expressError')
const {campgroundSchema} = require('../schemas')
const Campground = require("../models/campground")


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

router.get('/', wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('./campgrounds/index',{campgrounds})
}))

router.get('/new', (req, res) => {
    res.render('./campgrounds/new')
})

router.post('/', validateCampground , wrapAsync(async (req, res, next) => {

        const campground = new Campground(req.body.campground)
        await campground.save()
        res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews')
    // console.log(campground)
    res.render("./campgrounds/show",{campground})
}))

router.get('/:id/edit', wrapAsync(async (req,res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('./campgrounds/edit',{campground})
}))

router.put('/:id', validateCampground, wrapAsync(async (req, res) =>{
    const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', wrapAsync(async (req,res) =>{
    const campground = await Campground.findByIdAndDelete(req.params.id)
    res.redirect('/campgrounds')
}))

module.exports = router