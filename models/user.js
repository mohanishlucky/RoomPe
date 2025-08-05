const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");
const { type } = require("../schema");

// When you use Passport-Local Mongoose (a plugin for handling login/signup in MongoDB apps):

// It automatically adds:

// username – the user's login name

// hash – the encrypted (hashed) password

// salt – a random value added to the password before hashing (for extra security)





const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },

})

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('User',userSchema)