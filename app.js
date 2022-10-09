const express = require('express')
const app = express()
const port = 3000
const path = require('path')

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


app.get('/', (req, res) => {
    res.render("home")
})

app.get('/makeCampground', async (req, res) => {
    const camp = new Campground({title:"Shallow Ravine", price:"15.99", description:"A hidden spot under the bridge. Complimentary river view!", location:"Salford"})
    await camp.save()
    res.send(camp)
})

app.listen(port, () => console.log(`app listening on port ${port}!`))