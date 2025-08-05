const express = require('express')
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const listingSchema = require("../schema.js")
const ExpressError = require("../utils/ExpressError.js")
const { reviewSchema } = require("../schema.js")
const Listing = require("../models/listing.js")
const { isLoggedIn } = require("../middleware.js")
const { isOwner } = require("../middleware.js")
const { validateListing } = require("../middleware.js")
const { index, renderNewForm, showListing, createListing, editListing, updateListing, deleteListing } = require("../controllers/listings.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage })

//.. means going to parent directory


router.route("/")
    .get(wrapAsync(index))
    .post(isLoggedIn,validateListing,upload.single("listing[image]"),
        wrapAsync(createListing));
    // .post(upload.single("listing[image]"),(req,res)=>{
    //     res.send(req.file)
    // })

router.get("/new", isLoggedIn, renderNewForm)
// If you place /:id before /new, Express will treat "new" as a dynamic id parameter — meaning /new would match /:id and treat "new" as the id.
//that is not possible 


router.route("/:id")
    .get(wrapAsync(showListing))
    .put(isLoggedIn, isOwner, upload.single("listing[image]"),validateListing, wrapAsync(updateListing))
    .delete(isLoggedIn, wrapAsync(deleteListing));



//Index Route
// router.get("/", wrapAsync(index))

//Show Route
// router.get("/:id", wrapAsync(showListing));

//Create Route
// router.post("/",validateListing,isLoggedIn,
//     wrapAsync(createListing));


//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editListing))

//Update Route
// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(updateListing))

//Delete Route
// router.delete("/:id",isLoggedIn,wrapAsync(deleteListing))


module.exports = router;