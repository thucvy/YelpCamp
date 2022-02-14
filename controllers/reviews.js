const { redirect } = require('express/lib/response');
const Campground = require('../models/campground');
const Review = require('../models/review')

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (req.body.review.rating === 0) {
        console.log(req.body.review.rating)
    }

    // if (req.body.review.rating.equals('0')) {
    //     req.flash('error', 'Please put your rating')
    //     return redirect(`/campgrounds/${campground._id}`)
    // }
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', `New review for campground ${campground.title} has successfuly been submitted`)
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', `Your review has successfuly been deleted`)
    res.redirect(`/campgrounds/${id}`)
}