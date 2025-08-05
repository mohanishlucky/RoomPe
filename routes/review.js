const express = require('express')
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { reviewSchema } = require("../schema.js")
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js")
const listingSchema=require("../schema.js")
const {validateReview, isLoggedIn,isAuthor}=require("../middleware.js")
const {createReview,deleteReview}=require("../controllers/reviews.js")





//Reviews
//Post Review Route
router.post("/",isLoggedIn, validateReview, wrapAsync(createReview));


//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAsync(deleteReview));

module.exports = router;