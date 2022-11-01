const express = require('express')
const router = express.Router({mergeParams:true})
const wrapAsync = require('../utils/wrapAsync')
const expressError = require('../utils/expressError')
const {reviewSchema} = require('../schemas')

const Campground = require("../models/campground")
const Review = require("../models/review")

const validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new expressError(msg,400)
    }
    else {
        next()
    }
}

router.post('/', validateReview, wrapAsync(async (req,res) =>{
    const campground = await Campground.findById(req.params.id)
    // console.log(req.params)
    const review = new Review(req.body.review)
    // console.log(review)
    campground.reviews.push(review)
    // console.log(campground)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewID', wrapAsync(async (req,res,next) =>{
    const {id,reviewID} = req.params
    await Campground.findByIdAndUpdate(id, {$pull:{reviews: reviewID}})
    await Review.findByIdAndDelete(reviewID)
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router