const express = require('express')
const router = express.Router();
const User = require("../models/user");
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const {signup,login,logout}=require("../controllers/users.js");
const wrapAsync = require('../utils/wrapAsync.js');


router.get("/signup", (req, res) => {
    res.render("../views/users/signup.ejs")
})

router.post("/signup", wrapAsync(signup))


router.get("/login",(req,res)=>{
    res.render("../views/users/login.ejs")
})


// passport.authenticate() is a middleware used before login
//when username and password and doesnt matches it should redirect to /login
//local is our strategy
// If login fails, show a flash message (like: "Invalid username or password")
router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),login)

router.get("/logout",logout)



module.exports = router;
