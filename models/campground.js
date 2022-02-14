const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnailEdit').get(function () {
    return this.url.replace('/upload', '/upload/c_fill,h_150,w_200');
})
ImageSchema.virtual('thumbnailShow').get(function () {
    return this.url.replace('/upload', '/upload/c_fill,h_750,w_900');
})

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectID,
            ref: 'Review'
        }
    ],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, opts);

campgroundSchema.virtual('properties.popUpMarkup').get(function () {
    // return 'I AM POPUP'
    return `<h4><a href="/campgrounds/${this._id}">${this.title}</a></h4><p>${this.location}</p>`
})


campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

const Campground = mongoose.model('Campground', campgroundSchema);


module.exports = Campground;