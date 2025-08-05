const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js")

module.exports.createReview=async (req, res) => {
    console.log(req.params.id)
    let lisitng = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
    newReview.author=req.user._id
    lisitng.reviews.push(newReview)
    await newReview.save();
    await lisitng.save();
    console.log("new review saved");
     req.flash("success","New Review Created ⭐")
    res.redirect(`/listings/${lisitng._id}`)
}

module.exports.deleteReview=async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
      req.flash("success","New Review Created ⭐")
    res.redirect(`/listings/${id}`)
}