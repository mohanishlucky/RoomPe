require('dotenv').config();
const Listing = require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
//✅ This imports the Mapbox Geocoding Service SDK module.
// It provides access to functions like forwardGeocode() (to convert addresses to coordinates).
const mapToken = process.env.MAP_Token;
// This reads the Mapbox API token from your .env file using process.env.
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
// Create a client to talk to Mapbox

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
}

module.exports.renderNewForm = (req, res) => {

    // if(!req.isAuthenticated()){
    //      req.flash("error","You must be logged in to create a listing")
    //      return res.redirect("/login")
    // }
    res.render("listings/new.ejs")

}

module.exports.showListing = async (req, res) => {
    let id = req.params.id;
    const listing = await Listing.findById(id).populate({
        path: "reviews", populate: {
            path: "author"
        }
    }).populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings");  // <-- return is important here
    }

    res.render("listings/show.ejs", { listing ,mapToken});
}

module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,  // Location text from user (e.g., "Delhi, India")
    limit: 1                            // Limit result to top 1 match
}).send();                              // Send the request to Mapbox servers

// User submits a form with location like "Hyderabad, India"

// req.body.listing.location gets that string

// forwardGeocode turns it into coordinates like [78.4867, 17.3850]

// You store those coordinates in listing.geometry.coordinates to later show on the map.


    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url,"",filename)
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = { url, filename }
     newlisting.geometry=response.body.features[0].geometry;
    let savedListing=await newlisting.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created ⭐")
    res.redirect("/listings");
}

module.exports.editListing = async (req, res) => {
    let id = req.params.id;
    let l = await Listing.findById(id)
    res.render("listings/edit.ejs", { l })
}

module.exports.updateListing = async (req, res) => {

    let id = req.params.id;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename }
        await listing.save();
    }
    req.flash("success", "Listing Updated  ⭐")
    res.redirect(`/listings/${id}`)
}

module.exports.deleteListing = async (req, res) => {
    let id = req.params.id;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    req.flash("success", " Listing Deleted ⭐")
    console.log(deletedlisting)
    res.redirect("/listings")
}