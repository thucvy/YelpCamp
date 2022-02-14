const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
const { cloudinary } = require('../cloudinary')

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.new = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.create = async (req, res, next) => {
    // if (Object.keys(req.body.campground).length === 0) throw new ExpressError('Invalid Campground Data', 400);
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const newCampground = new Campground(req.body.campground);
    newCampground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    newCampground.author = req.user._id;
    newCampground.geometry = geoData.body.features[0].geometry;
    await newCampground.save();
    req.flash('success', `Campground ${newCampground.title} has successfuly been made`)
    res.redirect(`/campgrounds/${newCampground._id}`)
}

module.exports.show = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    if (!campground) {
        req.flash('error', `Campground does not exist`);
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground })
}

module.exports.edit = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', `Campground does not exist`);
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground })
}


module.exports.update = async (req, res) => {
    const updatedCampground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground }, { runValidators: true });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    // console.log(req.body)
    updatedCampground.images.push(...imgs);
    await updatedCampground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await updatedCampground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', `Campground ${updatedCampground.title} has successfuly been updated`)
    res.redirect(`/campgrounds/${updatedCampground._id}`)
}

module.exports.delete = async (req, res) => {
    const deletedCampground = await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', `Campground ${deletedCampground.title} has successfuly been deleted`)
    res.redirect('/campgrounds');
}