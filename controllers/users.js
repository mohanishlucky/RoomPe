const User = require("../models/user");

module.exports.signup=async (req, res) => {
    try {
        let { username, email, password } = req.body
        const newUser = new User({
            email, username
        })
        const registeredUser = await User.register(newUser, password)
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                next(err);
            }
       req.flash("success", "Welcome to RoomPe")
        res.redirect("/listings")
        })
        
    } catch (error) {
         req.flash("error",error.message)
         res.redirect("/signup")
    }
}


module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to RoomPe :)")
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}

module.exports.logout=(req,res,next)=>{
    req.logout((error)=>{
        if(error){
           return  next(error)
        }
        req.flash("success","you are logged out")
        res.redirect("/listings");
    })
}