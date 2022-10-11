const Campground = require("../models/campground")

const mongoose = require('mongoose');

const cities = require('./cities')

mongoose.connect('mongodb://localhost:27017/campGround', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

const seedDB = async () => {
    await Campground.deleteMany({})
    // const c = new Campground({title:"Testing"})
    for (let i = 0; i < 50; i++){
        const rand = Math.floor(Math.random() * 1000)
        const camp = new Campground({
            location: `${cities[rand].city},${cities[rand].state}`,
            title: 'Something ??',
            image: 'https://source.unsplash.com/random/300x300?camping',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima sed cum voluptate! Magni excepturi, dicta eveniet nihil distinctio sequi reprehenderit facilis suscipit ducimus quasi, cumque aut veritatis, ad unde ullam. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Amet quia reprehenderit repudiandae temporibus voluptatum repellat iusto aspernatur, placeat aliquid magnam sequi impedit sunt minus velit, neque enim. Non, nemo accusamus.',
            price: rand
        })
        await camp.save()

    }
    // await c.save()
}

seedDB().then(() => {
    mongoose.connection.close()
})