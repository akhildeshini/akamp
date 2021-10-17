const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campmodel');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
const sample = array => array[Math.floor(Math.random() * array.length)];
const dbupdate=async()=>
{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++)
    {
        const c=Math.floor(Math.random()*1000);
        const d=Math.floor(Math.random()*100);
        const CampGround= new Campground({title:`${cities[c].city}`,description:`${sample(places)} , ${sample(descriptors)}`,location:`${cities[c].state}`,price:`${d}`,image:`https://source.unsplash.com/collection/483251`,author:'610193f620e5d4567cc999cb'})
        await CampGround.save();
    }
}
dbupdate();