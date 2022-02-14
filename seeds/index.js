if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelpCampGround';

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const User = require('../models/user')

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl); //create new db instance if not existed
    console.log('Mongo Connection open!!!')
}

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dtz6ijzcq/image/upload/v1644707432/YelpCamp/izcqbbhn2qvt1nbny7ix.jpg',
                    filename: 'YelpCamp/izcqbbhn2qvt1nbny7ix'
                },
                {
                    url: 'https://res.cloudinary.com/dtz6ijzcq/image/upload/v1644706098/YelpCamp/ckr54odvyv6slgalvkha.jpg',
                    filename: 'YelpCamp/ckr54odvyv6slgalvkha'
                },
            ],
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus, natus dolorum ea, neque ex autem enim inventore reiciendis sunt cumque deleniti exercitationem tenetur sequi. Libero ad qui magnam molestias vel.',
            price,
            author: '6209c720ad494cf6ec879206',
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            }
        })
        await camp.save();
    }
}

seedDB()
    .then(() => mongoose.connection.close())

