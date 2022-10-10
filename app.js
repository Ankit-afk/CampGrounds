const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const methodOverride = require('method-override')

const Campground = require("./models/campground")

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/campGround', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })


app.set("view engine", "ejs")
app.set("views", path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('__method'))


app.get('/', (req, res) => {
    res.render("home")
})


app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('./campgrounds/index',{campgrounds})
})

app.get('/campgrounds/new', (req, res) => {
    res.render('./campgrounds/new')
})

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render("./campgrounds/show",{campground})
})

app.get('/campgrounds/:id/edit', async (req,res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('./campgrounds/edit',{campground})

})

app.put('/campgrounds/:id', async (req, res) =>{
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
})

app.delete('/campgrounds/:id', async (req,res) =>{
    const campground = await Campground.findByIdAndDelete(req.params.id)
    res.redirect('/campgrounds')
})

app.listen(port, () => console.log(`app listening on port ${port}!`))