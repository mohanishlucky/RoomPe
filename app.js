if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
    // Loads variables from a .env file into process.env.
}
// This ensures that .env is only loaded in development or testing environments — not in production.
// This conditionally loads environment variables from a .env file only when your app is not running in production.

// console.log(process.env.SECRET)

const express = require('express')
const app = express();
const mongoose = require('mongoose')
const Listing = require("./models/listing.js")
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const listingSchema = require("./schema.js")
const { reviewSchema } = require("./schema.js")
const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const session = require("express-session")
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStartegy = require('passport-local');
const User = require("./models/user.js");




const Review = require("./models/reviews.js");
const { wrap } = require('module');
const { maxHeaderSize } = require('http');
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use(express.json())
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")))



// const MONGO_URL = 'mongodb://127.0.0.1:27017/RoomPe';
const dbUrl = process.env.ATLASDB_URL;
//now all listings will be not there because it is running on cloud not locally
async function main() {
    await mongoose.connect(dbUrl);
}

main().then(() => {
    console.log("Connected to MongoDB Atlas")
}).catch((err) => {
    console.log(err)
})




const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600 // time in seconds
});

// Then handle store error AFTER it’s defined
store.on("error", (err) => {
    console.log("ERROR in Mongo Session Store", err);
});

// Session configuration object
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

// app.get("/", (req, res) => {
//     res.send("Success")
// })


app.use(session(sessionOptions))
app.use(flash());

app.use(passport.initialize());
//A middleware taht initializes passport
app.use(passport.session());
passport.use(new LocalStartegy(User.authenticate()))
// You're telling Passport.js to use the Local Strategy (i.e., username + password login), and you're using the .authenticate() method that Passport-Local Mongoose provides for your User model.


// “Hey Passport, when a user logs in, use the User model’s built-in login-checking method to verify the username and password.”
// User.authenticate() is a function automatically added by passport-local-mongoose.

// It compares the password entered by the user with the hashed password stored in the database.

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
// When a user logs in, Passport saves only the user ID (or something minimal) in the session.
passport.deserializeUser(User.deserializeUser());
//When a request comes in, Passport uses that ID to fetch the full user from the database 



app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


app.get("/demouser", async (req, res) => {
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "delta-student"
    })

    let registeredUser = await User.register(fakeUser, "mohan@123");
    res.send(registeredUser)
    //checks if username exist and it is unique  ,automatically it checks
    // register(user,password,callback)
})

app.use("/listings", listingRouter)

app.use("/listings/:id/reviews", reviewRouter)
app.use("/", userRouter)

// Handle 404 - Page Not Found
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Custom Error Handler (handles all errors passed to `next(err)`)
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Oops! Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { err });
});



app.listen(3000, () => {
    console.log("Server is listening on Port no 3000")
})



// app.get("/testListing",async(req,res)=>{
//     let sample=new Listing({
//         title:"My New Villa",
//         description:"By the beach ",
//         price:1200,
//         location:"Srikakulam",
//         country:"India"
//     })

//    await sample.save();
//    console.log("Sample was saved")
//    res.send("successful testing")
// })
