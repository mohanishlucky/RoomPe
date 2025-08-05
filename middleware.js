const Listing = require("./models/listing.js")
const Review = require("./models/reviews.js")
const listingSchema=require("./schema.js")
const ExpressError=require("./utils/ExpressError.js")
const { reviewSchema } = require("./schema.js")

module.exports.isLoggedIn=(req,res,next)=>{
  //  console.log(req.path,"...",req.originalUrl);
       if(!req.isAuthenticated()){
                req.session.redirectUrl=req.originalUrl
         req.flash("error","You must be logged in to create a listing")
         return res.redirect("/login")
    }
  next();
}

//locals are accessible anywhere and passport dont have an access to delete the locals

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl
  }
  next()
}


module.exports.isOwner=async (req,res,next)=>{
   let id = req.params.id;
      let listing=await Listing.findById(id)
      if(!listing.owner._id.equals(res.locals.currUser._id)){ //if it  is not equal
         req.flash("error","You are not the owner of listing")
         return res.redirect(`/listings/${id}`)
      }
      next();
}

module.exports.isAuthor=async (req,res,next)=>{
   let {id,reviewId} = req.params;
      let review=await Review.findById(reviewId)
      if(!review.author._id.equals(res.locals.currUser._id)){ //if it  is not equal
         req.flash("error","You are not the author of review ")
         return res.redirect(`/listings/${id}`)
      }
      next();
}

module.exports.validateListing=(req,res,next)=>{
      let {error }= listingSchema.validate(req.body);
        // console.log("JOI RESULT:", result);
        if(error){
            let errorMsg=error.details.map((el)=>
                el.message
            ).join(",")
            throw new ExpressError(404,errorMsg)
        } 
        else{
            next();
        }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    // console.log("JOI RESULT:", result);
    if (error) {
        let errorMsg = error.details.map((el) =>
            el.message
        ).join(",")
        throw new ExpressError(404, errorMsg)
    }
    else {
        next();
    }
}
